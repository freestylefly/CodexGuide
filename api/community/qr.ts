import { requirePaidCommunityBuyers } from "../../server/auth.js";
import { findCurrentOrder, getActiveGroupQr } from "../../server/db.js";
import { AppError, errorResponse } from "../../server/errors.js";
import { assertMethod, noStoreHeaders } from "../../server/http.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      const buyers = requirePaidCommunityBuyers(request);
      const orders = await Promise.all(
        buyers.map((buyer) => findCurrentOrder(buyer.buyerKey, buyer.provider)),
      );
      const order = orders.find((candidate) => candidate?.status === "PAID");

      if (!order) {
        throw new AppError(403, "payment_required", "确认支付后才能查看群二维码。" );
      }

      const asset = await getActiveGroupQr();
      if (!asset) {
        throw new AppError(503, "group_qr_unavailable", "群二维码正在更新，请稍后刷新。" );
      }

      return new Response(Buffer.from(asset.image_base64, "base64"), {
        headers: noStoreHeaders({
          "Content-Disposition": "inline",
          "Content-Type": asset.content_type,
          "X-Content-Type-Options": "nosniff",
        }),
      });
    } catch (error) {
      return errorResponse(error);
    }
  },
};

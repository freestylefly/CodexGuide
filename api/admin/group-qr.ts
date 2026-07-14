import { requireAdminSession } from "../../server/auth.js";
import { getActiveGroupQr, replaceActiveGroupQr } from "../../server/db.js";
import { AppError, errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, noStoreHeaders } from "../../server/http.js";
import { validateGroupQrImage } from "../../server/security.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET", "POST"]);
      requireAdminSession(request);

      if (request.method === "GET") {
        const asset = await getActiveGroupQr();
        if (!asset) throw new AppError(404, "group_qr_not_found", "尚未上传群二维码。" );

        return new Response(Buffer.from(asset.image_base64, "base64"), {
          headers: noStoreHeaders({
            "Content-Disposition": "inline",
            "Content-Type": asset.content_type,
            "X-Content-Type-Options": "nosniff",
          }),
        });
      }

      assertSameOrigin(request);
      const form = await request.formData();
      const file = form.get("groupQr");

      if (!(file instanceof File)) {
        throw new AppError(400, "missing_image", "请选择群二维码图片。" );
      }

      const image = validateGroupQrImage(Buffer.from(await file.arrayBuffer()));
      const id = await replaceActiveGroupQr(image.contentType, image.bytes);

      return Response.json({ id, updated: true }, { headers: noStoreHeaders() });
    } catch (error) {
      return errorResponse(error);
    }
  },
};

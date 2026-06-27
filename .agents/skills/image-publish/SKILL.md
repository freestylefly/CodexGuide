---
name: image-publish
description: 当 CodexGuide 项目图片需要规范命名、右下角文字水印、阿里 OSS 上传、CDN 验证，或替换 Markdown 图片链接时使用。
---

# 图片发布

本 Skill 仅供 CodexGuide 仓库使用。目标是把插入文档的图片处理成**可发布**状态：本地规范命名，按需加水印，上传到阿里 OSS，通过 CDN 验证，最后在 Markdown 中引用公开 URL。

## 步骤

1. 首次在本会话使用本 Skill 时，询问用户是否把新图片默认处理为“加水印 + 图床化 + 替换到实际文档/网页”。
   - 如果用户同意，本会话后续新图片默认自动执行：规范命名、添加 `苍何` 水印、上传 OSS、验证 CDN、把文档或网页中的引用替换为水印版 CDN URL。
   - 如果用户不同意，仅按用户每次明确要求处理。
   - 如果用户已经在本会话明确同意过，不要重复询问。
   完成标准：本会话的新图片默认处理偏好已明确。

2. 确认源图片和目标 Markdown。
   完成标准：明确源文件、插入位置和图片 alt 文本。

3. 规范本地图片文件。
   - 指南正文图片默认放在 `docs/images/`。
   - 文件名使用小写 kebab-case，描述图片内容，不使用截图编号。
   - 除非用户明确要求转换格式，否则保留原扩展名。
   完成标准：最终本地路径稳定，且没有覆盖无关文件。

4. 按偏好或用户要求添加水印。
   - Windows 使用 `scripts/add-watermark.ps1`。
   - Linux/macOS 使用 `scripts/add-watermark.sh`。
   - 默认水印文字是 `苍何`。
   - 先生成预览图；用户确认效果前，不替换原图。
   - 如果用户已同意默认水印，后续新图片不需要每次重新确认水印。
   完成标准：预览图已生成，并完成视觉检查。

5. 上传到阿里 OSS。
   - Windows 使用 `scripts/upload-oss-image.ps1`。
   - Linux/macOS 使用 `scripts/upload-oss-image.sh`。
   - 从 `.env.oss.local` 读取凭据。
   - 如果 `.env.oss.local` 缺失，先新建带占位符的 `.env.oss.local` 模板，让用户补充后停止本次上传。
   - 不打印密钥。
   - 优先使用文档中已有的 CDN 形态：`https://cdn.canghecode.com/codexguide/docs/images/<name>`。
   完成标准：脚本输出对象路径和公开 URL。

6. 验证 CDN URL。
   完成标准：`curl -I` 返回 `HTTP/1.1 200 OK`，并且 `Content-Type` 是图片类型。

7. 仅在图片 URL 验证通过后更新 Markdown 或网页。
   - 如果用户已同意默认图床化和水印，文档和网页里应引用水印版 CDN URL，而不是本地图片或无水印 URL。
   完成标准：目标文件在指定位置包含最终 CDN URL，本地行号检查能看到插入或替换后的内容。

## 命令

Windows 水印预览：

```powershell
.\.agents\skills\image-publish\scripts\add-watermark.ps1 `
  -InputPath .\docs\images\example.png `
  -OutputPath .\docs\images\example-watermarked.png `
  -Text "苍何"
```

Windows OSS 上传：

```powershell
.\.agents\skills\image-publish\scripts\upload-oss-image.ps1 `
  -InputPath .\docs\images\example-watermarked.png `
  -PublicName example-watermarked.png
```

Linux/macOS 水印预览：

```bash
.agents/skills/image-publish/scripts/add-watermark.sh \
  docs/images/example.png \
  docs/images/example-watermarked.png \
  "苍何"
```

Linux/macOS OSS 上传：

```bash
.agents/skills/image-publish/scripts/upload-oss-image.sh \
  docs/images/example-watermarked.png \
  example-watermarked.png
```

CDN 检查：

```powershell
curl.exe -I -sS "https://cdn.canghecode.com/codexguide/docs/images/example-watermarked.png"
```

`.env.oss.local` 缺失时创建模板：

```powershell
@"
# Aliyun OSS image hosting config for CodexGuide.
# This file is local-only: `.env.*` is ignored by Git.

ALIYUN_OSS_ACCESS_KEY_ID=
ALIYUN_OSS_ACCESS_KEY_SECRET=
ALIYUN_OSS_BUCKET=
ALIYUN_OSS_ENDPOINT=
ALIYUN_OSS_PUBLIC_BASE_URL=https://cdn.canghecode.com/codexguide
ALIYUN_OSS_OBJECT_PREFIX=codexguide
ALIYUN_OSS_LOCAL_PATHS=docs/images
"@ | Set-Content -Encoding UTF8 .env.oss.local
```

## 规则

- 不删除源图片。
- 不在聊天或日志中暴露 `.env.oss.local` 的值。
- `.env.oss.local` 缺失时，应创建模板文件让用户补充，不要让用户从零猜配置项。
- 如果 OSS 上传失败，只报告明确的 OSS 错误类型，例如 `NoSuchBucket`，不要输出请求头。
- 如果 `.env.oss.local` 的 public base 已经包含 `/codexguide`，最终 Markdown URL 不要重复拼接。
- 项目默认本地和远端目录都是 `docs/images`。只有目标文档已有其他 CodexGuide 图片约定时，才覆盖该目录。
- Linux/macOS 上传依赖 `curl`、`openssl`、`awk` 和 `date`；水印依赖 ImageMagick 的 `magick` 命令。缺少依赖时停止并说明。
- Linux/macOS 中文水印字体渲染不理想时，使用 `WATERMARK_FONT` 指定字体。

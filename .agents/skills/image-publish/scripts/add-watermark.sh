#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <input-path> <output-path> [watermark-text]" >&2
  exit 2
fi

input_path="$1"
output_path="$2"
text="${3:-苍何}"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick 'magick' command is required for watermarking on Linux/macOS." >&2
  exit 127
fi

mkdir -p "$(dirname "$output_path")"

width="$(magick identify -format '%w' "$input_path")"
font_size="$(awk -v width="$width" 'BEGIN { size=int(width * 0.035 + 0.5); if (size < 28) size = 28; print size }')"
padding="$(awk -v width="$width" 'BEGIN { pad=int(width * 0.028 + 0.5); if (pad < 18) pad = 18; print pad }')"

font_args=()
if [[ -n "${WATERMARK_FONT:-}" ]]; then
  font_args=(-font "$WATERMARK_FONT")
else
  available_fonts="$(magick -list font 2>/dev/null | awk -F: '/^[[:space:]]*Font:/ { gsub(/^[[:space:]]+/, "", $2); print $2 }')"
  for candidate in "Noto-Sans-CJK-SC-Bold" "Noto-Sans-CJK-SC" "PingFang-SC" "Microsoft-YaHei" "WenQuanYi-Zen-Hei"; do
    if printf '%s\n' "$available_fonts" | grep -Fxq "$candidate"; then
      font_args=(-font "$candidate")
      break
    fi
  done
fi

magick "$input_path" \
  -gravity southeast \
  "${font_args[@]}" \
  -pointsize "$font_size" \
  -fill "rgba(0,0,0,0.47)" \
  -annotate +"$((padding - 3))"+"$((padding - 3))" "$text" \
  -fill "rgba(255,255,255,0.82)" \
  -annotate +"$padding"+"$padding" "$text" \
  "$output_path"

ls -l "$output_path"

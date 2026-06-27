#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || $# -gt 4 ]]; then
  echo "Usage: $0 <input-path> [public-name] [remote-dir] [content-type]" >&2
  exit 2
fi

input_path="$1"
public_name="${2:-$(basename "$input_path")}"
remote_dir="${3:-docs/images}"
content_type="${4:-}"
env_path=".env.oss.local"

if [[ ! -f "$env_path" ]]; then
  cat > "$env_path" <<'EOF'
# Aliyun OSS image hosting config for CodexGuide.
# This file is local-only: `.env.*` is ignored by Git.

ALIYUN_OSS_ACCESS_KEY_ID=
ALIYUN_OSS_ACCESS_KEY_SECRET=
ALIYUN_OSS_BUCKET=
ALIYUN_OSS_ENDPOINT=
ALIYUN_OSS_PUBLIC_BASE_URL=https://cdn.canghecode.com/codexguide
ALIYUN_OSS_OBJECT_PREFIX=codexguide
ALIYUN_OSS_LOCAL_PATHS=docs/images
EOF
  echo ".env.oss.local not found. A template has been created; fill it in and rerun upload." >&2
  exit 1
fi

get_env_value() {
  local key="$1"
  awk -F= -v key="$key" '
    $0 !~ /^[[:space:]]*#/ && $1 == key {
      sub(/^[^=]*=/, "")
      gsub(/^"|"$/, "")
      print
      exit
    }
  ' "$env_path"
}

ak="$(get_env_value ALIYUN_OSS_ACCESS_KEY_ID)"
sk="$(get_env_value ALIYUN_OSS_ACCESS_KEY_SECRET)"
bucket="$(get_env_value ALIYUN_OSS_BUCKET)"
endpoint_host="$(get_env_value ALIYUN_OSS_ENDPOINT)"
prefix="$(get_env_value ALIYUN_OSS_OBJECT_PREFIX)"
public_base="$(get_env_value ALIYUN_OSS_PUBLIC_BASE_URL)"

for pair in "ALIYUN_OSS_ACCESS_KEY_ID:$ak" "ALIYUN_OSS_ACCESS_KEY_SECRET:$sk" "ALIYUN_OSS_BUCKET:$bucket" "ALIYUN_OSS_ENDPOINT:$endpoint_host" "ALIYUN_OSS_OBJECT_PREFIX:$prefix" "ALIYUN_OSS_PUBLIC_BASE_URL:$public_base"; do
  if [[ -z "${pair#*:}" ]]; then
    echo "Missing required OSS config: ${pair%%:*}" >&2
    exit 1
  fi
done

endpoint_host="${endpoint_host#http://}"
endpoint_host="${endpoint_host#https://}"
endpoint_host="${endpoint_host%/}"
if [[ "$endpoint_host" =~ ^oss-[^.]+$ ]]; then
  endpoint_host="${endpoint_host}.aliyuncs.com"
fi

if [[ -z "$content_type" ]]; then
  extension="$(printf '%s' "${public_name##*.}" | tr '[:upper:]' '[:lower:]')"
  case "$extension" in
    png) content_type="image/png" ;;
    jpg|jpeg) content_type="image/jpeg" ;;
    webp) content_type="image/webp" ;;
    gif) content_type="image/gif" ;;
    svg) content_type="image/svg+xml" ;;
    *) content_type="application/octet-stream" ;;
  esac
fi

prefix="${prefix#/}"
prefix="${prefix%/}"
remote_dir="${remote_dir#/}"
remote_dir="${remote_dir%/}"
object_key="${prefix}/${remote_dir}/${public_name}"
object_key="${object_key#/}"
date_value="$(LC_ALL=C TZ=GMT date '+%a, %d %b %Y %H:%M:%S GMT')"
resource="/${bucket}/${object_key}"
string_to_sign="$(printf 'PUT\n\n%s\n%s\n%s' "$content_type" "$date_value" "$resource")"
signature="$(printf '%s' "$string_to_sign" | openssl dgst -sha1 -hmac "$sk" -binary | openssl base64)"
uri="https://${bucket}.${endpoint_host}/${object_key}"

curl -sS -X PUT \
  -H "Date: ${date_value}" \
  -H "Authorization: OSS ${ak}:${signature}" \
  -H "Content-Type: ${content_type}" \
  --data-binary "@${input_path}" \
  "$uri"

public_base="${public_base%/}"
public_path="${remote_dir}/${public_name}"

printf 'UploadedObject=%s\n' "$object_key"
printf 'ContentType=%s\n' "$content_type"
printf 'PublicUrl=%s/%s\n' "$public_base" "$public_path"

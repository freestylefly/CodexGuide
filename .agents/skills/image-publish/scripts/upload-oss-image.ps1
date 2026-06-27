param(
  [Parameter(Mandatory = $true)]
  [string] $InputPath,

  [string] $PublicName,
  [string] $RemoteDir = "docs/images",
  [string] $ContentType
)

$ErrorActionPreference = "Stop"

$envPath = Join-Path (Get-Location) ".env.oss.local"
if (-not [System.IO.File]::Exists($envPath)) {
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
"@ | Set-Content -Encoding UTF8 -LiteralPath $envPath
  throw ".env.oss.local not found. A template has been created; fill it in and rerun upload."
}

$envMap = @{}
Get-Content -Encoding UTF8 -LiteralPath $envPath | ForEach-Object {
  if ($_ -match "^\s*#" -or $_ -notmatch "=") { return }
  $k, $v = $_ -split "=", 2
  $envMap[$k.Trim()] = $v.Trim().Trim('"')
}

$required = @(
  "ALIYUN_OSS_ACCESS_KEY_ID",
  "ALIYUN_OSS_ACCESS_KEY_SECRET",
  "ALIYUN_OSS_BUCKET",
  "ALIYUN_OSS_ENDPOINT",
  "ALIYUN_OSS_OBJECT_PREFIX"
)

foreach ($key in $required) {
  if (-not $envMap[$key]) {
    throw "Missing required OSS config: $key"
  }
}

$resolvedInput = Resolve-Path -LiteralPath $InputPath
if (-not $PublicName) {
  $PublicName = Split-Path -Leaf $resolvedInput.Path
}
if (-not $ContentType) {
  $extension = [System.IO.Path]::GetExtension($PublicName).ToLowerInvariant()
  $ContentType = switch ($extension) {
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".webp" { "image/webp" }
    ".gif" { "image/gif" }
    ".svg" { "image/svg+xml" }
    default { "application/octet-stream" }
  }
}

$ak = $envMap["ALIYUN_OSS_ACCESS_KEY_ID"]
$sk = $envMap["ALIYUN_OSS_ACCESS_KEY_SECRET"]
$bucket = $envMap["ALIYUN_OSS_BUCKET"]
$endpointHost = $envMap["ALIYUN_OSS_ENDPOINT"].Trim().TrimEnd("/") -replace "^https?://", ""
if ($endpointHost -match "^oss-[^.]+$") {
  $endpointHost = "$endpointHost.aliyuncs.com"
}

$prefix = $envMap["ALIYUN_OSS_OBJECT_PREFIX"].Trim("/")
$remoteDirClean = $RemoteDir.Trim("/")
$objectKey = (($prefix, $remoteDirClean, $PublicName) | Where-Object { $_ }) -join "/"
$date = [DateTime]::UtcNow.ToString("r", [Globalization.CultureInfo]::InvariantCulture)
$resource = "/$bucket/$objectKey"
$stringToSign = "PUT`n`n$ContentType`n$date`n$resource"

$hmac = New-Object System.Security.Cryptography.HMACSHA1
$hmac.Key = [Text.Encoding]::UTF8.GetBytes($sk)
$signature = [Convert]::ToBase64String($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($stringToSign)))
$auth = "Authorization: OSS ${ak}:$signature"
$uri = "https://$bucket.$endpointHost/$objectKey"

& curl.exe -sS -X PUT -H "Date: $date" -H $auth -H "Content-Type: $ContentType" --data-binary "@$($resolvedInput.Path)" $uri
if ($LASTEXITCODE -ne 0) {
  throw "curl upload failed with exit code $LASTEXITCODE"
}

$publicBase = $envMap["ALIYUN_OSS_PUBLIC_BASE_URL"]
if (-not $publicBase) {
  throw "Missing required OSS config: ALIYUN_OSS_PUBLIC_BASE_URL"
}
$publicBase = $publicBase.TrimEnd("/")
$publicPath = (($remoteDirClean, $PublicName) | Where-Object { $_ }) -join "/"

[PSCustomObject]@{
  UploadedObject = $objectKey
  ContentType = $ContentType
  PublicUrl = "$publicBase/$publicPath"
}

param(
  [Parameter(Mandatory = $true)]
  [string] $InputPath,

  [Parameter(Mandatory = $true)]
  [string] $OutputPath,

  [string] $Text = "苍何",
  [double] $FontScale = 0.035,
  [int] $MinimumFontSize = 28,
  [double] $PaddingScale = 0.028,
  [int] $TextAlpha = 210,
  [int] $ShadowAlpha = 120
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$resolvedInput = Resolve-Path -LiteralPath $InputPath
$outputFullPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputPath))
$outputDir = [System.IO.Path]::GetDirectoryName($outputFullPath)
if (-not [System.IO.Directory]::Exists($outputDir)) {
  [System.IO.Directory]::CreateDirectory($outputDir) | Out-Null
}

$img = [System.Drawing.Image]::FromFile($resolvedInput.Path)
try {
  $pixelFormat = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height, $pixelFormat)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.DrawImage($img, 0, 0, $img.Width, $img.Height)

    $fontSize = [Math]::Max($MinimumFontSize, [Math]::Round($img.Width * $FontScale))
    $font = New-Object System.Drawing.Font("Microsoft YaHei UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($ShadowAlpha, 0, 0, 0))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($TextAlpha, 255, 255, 255))
    try {
      $size = $g.MeasureString($Text, $font)
      $padding = [Math]::Round($img.Width * $PaddingScale)
      $x = $img.Width - $size.Width - $padding
      $y = $img.Height - $size.Height - $padding

      $g.DrawString($Text, $font, $shadowBrush, $x + 3, $y + 3)
      $g.DrawString($Text, $font, $textBrush, $x, $y)
      $bmp.Save($outputFullPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $font.Dispose()
      $shadowBrush.Dispose()
      $textBrush.Dispose()
    }
  }
  finally {
    $g.Dispose()
    $bmp.Dispose()
  }
}
finally {
  $img.Dispose()
}

Get-Item -LiteralPath $outputFullPath | Select-Object FullName, Length

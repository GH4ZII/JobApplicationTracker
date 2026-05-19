$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$iconDir = Join-Path $PSScriptRoot "..\src-tauri\icons"
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null

function New-AppBitmap([int]$size) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $graphics = [System.Drawing.Graphics]::FromImage($bmp)
  $graphics.Clear([System.Drawing.Color]::FromArgb(30, 41, 59))
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(59, 130, 246))
  $margin = [int]($size * 0.2)
  $graphics.FillRectangle(
    $brush,
    $margin,
    $margin,
    $size - (2 * $margin),
    $size - (2 * $margin)
  )
  $graphics.Dispose()
  return $bmp
}

function Save-Png([int]$size, [string]$name) {
  $bmp = New-AppBitmap $size
  $path = Join-Path $iconDir $name
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Created $path"
}

Save-Png 32 "32x32.png"
Save-Png 128 "128x128.png"
Save-Png 256 "128x128@2x.png"

$bmpForIco = New-AppBitmap 256
$icon = [System.Drawing.Icon]::FromHandle($bmpForIco.GetHicon())
$icoPath = Join-Path $iconDir "icon.ico"
$stream = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()
$bmpForIco.Dispose()
Write-Host "Created $icoPath"

Copy-Item (Join-Path $iconDir "128x128.png") (Join-Path $iconDir "icon.icns")
Write-Host "Icons ready in $iconDir"

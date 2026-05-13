param(
    [Parameter(Mandatory=$true)][string]$Source,
    [Parameter(Mandatory=$true)][string]$OutDir,
    [int[]]$Sizes = @(16, 24, 32, 48, 64, 96, 128, 256, 512, 1024)
)

Add-Type -AssemblyName PresentationCore

if (-not (Test-Path $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

$srcPath = (Resolve-Path $Source).Path
$bitmap = New-Object System.Windows.Media.Imaging.BitmapImage
$bitmap.BeginInit()
$bitmap.CacheOption = [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
$bitmap.UriSource = New-Object System.Uri($srcPath)
$bitmap.EndInit()
$bitmap.Freeze()

foreach ($size in $Sizes) {
    $scaleX = $size / $bitmap.PixelWidth
    $scaleY = $size / $bitmap.PixelHeight
    $transform = New-Object System.Windows.Media.ScaleTransform($scaleX, $scaleY)
    $scaled = New-Object System.Windows.Media.Imaging.TransformedBitmap($bitmap, $transform)

    $target = New-Object System.Windows.Media.Imaging.RenderTargetBitmap(
        $size, $size, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $visual = New-Object System.Windows.Media.DrawingVisual
    $ctx = $visual.RenderOpen()
    $rect = New-Object System.Windows.Rect(0, 0, $size, $size)
    $ctx.DrawImage($scaled, $rect)
    $ctx.Close()
    $target.Render($visual)

    $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
    $frame = [System.Windows.Media.Imaging.BitmapFrame]::Create($target)
    $encoder.Frames.Add($frame)

    $outPath = Join-Path $OutDir "${size}x${size}.png"
    $stream = [System.IO.File]::Create($outPath)
    $encoder.Save($stream)
    $stream.Close()
    Write-Output "Wrote $outPath"
}

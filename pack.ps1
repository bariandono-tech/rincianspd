# pack.ps1 - Packs public/unpacked.html back into public/index.html
# Usage: powershell -ExecutionPolicy Bypass -File pack.ps1

$unpackedPath = "public\unpacked.html"
$indexPath    = "public\index.html"

if (!(Test-Path $unpackedPath)) {
    Write-Error "File tidak ditemukan: $unpackedPath"
    exit 1
}
if (!(Test-Path $indexPath)) {
    Write-Error "File tidak ditemukan: $indexPath"
    exit 1
}

# Read the unpacked HTML as raw text
$htmlContent = Get-Content -Raw -Path $unpackedPath -Encoding UTF8

# Encode it as a JSON string (this handles all escaping: ", \, newlines, etc.)
$jsonString = ConvertTo-Json $htmlContent -Compress

# Read the current index.html
$indexContent = Get-Content -Raw -Path $indexPath -Encoding UTF8

# Replace the content between <script type="__bundler/template"> ... </script>
$pattern     = '(?s)(<script type="__bundler/template">)(.*?)(</script>)'
$replacement = "`$1`n$jsonString`n`$3"

$newIndex = [regex]::Replace($indexContent, $pattern, $replacement)

if ($newIndex -eq $indexContent) {
    Write-Warning "Tidak ada perubahan - pattern __bundler/template tidak ditemukan atau sudah sama."
} else {
    Set-Content -Path $indexPath -Value $newIndex -Encoding UTF8 -NoNewline
    $size = (Get-Item $indexPath).Length
    Write-Output "Berhasil! index.html diperbarui - $size bytes"
}

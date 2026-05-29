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

# Read files as plain .NET strings (avoids PowerShell's decorated strings
# which cause ConvertTo-Json to produce {"value":"..."} instead of "...")
$htmlContent  = [System.IO.File]::ReadAllText((Resolve-Path $unpackedPath).Path, [System.Text.Encoding]::UTF8)
$indexContent = [System.IO.File]::ReadAllText((Resolve-Path $indexPath).Path,    [System.Text.Encoding]::UTF8)

# JSON-encode the HTML (handles ", \, newlines, etc.)
$jsonString = ConvertTo-Json $htmlContent -Compress
# Escape </script> so the HTML parser doesn't terminate the <script> block early
$jsonString = $jsonString.Replace('</script>', '<\/script>')

# Use plain string search/replace to avoid regex backreference issues
# (HTML template literals contain ${i}, ${key}, etc. that would break [regex]::Replace)
$startTag = '<script type="__bundler/template">'
$endTag   = '</script>'

$startIdx = $indexContent.IndexOf($startTag)
if ($startIdx -eq -1) {
    Write-Warning "Tag __bundler/template tidak ditemukan di index.html"
    exit 1
}

$contentStart = $startIdx + $startTag.Length
$endIdx = $indexContent.IndexOf($endTag, $contentStart)
if ($endIdx -eq -1) {
    Write-Warning "Closing </script> tidak ditemukan setelah template tag"
    exit 1
}

$before   = $indexContent.Substring(0, $contentStart)
$after    = $indexContent.Substring($endIdx)
$newIndex = $before + "`n" + $jsonString + "`n" + $after

if ($newIndex -eq $indexContent) {
    Write-Warning "Tidak ada perubahan - konten sudah sama."
} else {
    [System.IO.File]::WriteAllText(
        (Resolve-Path $indexPath).Path,
        $newIndex,
        [System.Text.Encoding]::UTF8
    )
    $size = (Get-Item $indexPath).Length
    Write-Output "Berhasil! index.html diperbarui - $size bytes"
}

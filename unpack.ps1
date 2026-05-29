$html = Get-Content -Raw -Path "public\index.html"
$templateRegex = "(?s)<script type=`"__bundler/template`">(.*?)<\/script>"
if ($html -match $templateRegex) {
    $json = $Matches[1].Trim()
    $decoded = ConvertFrom-Json $json
    Set-Content -Path "public\unpacked.html" -Value $decoded
    Write-Output "Successfully unpacked to public\unpacked.html"
} else {
    Write-Output "Template script block not found!"
}

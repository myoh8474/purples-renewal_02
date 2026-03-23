$file = "c:\MH_WORK\퍼플스\purplesUX_renewal_02\why-purples.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Medal 1: Heritage - crown icon
$old1 = '<div class="wp-medal">' + "`r`n" + '                        <div class="wp-medal-img-icon wp-medal-placeholder">'
$content = $content.Replace($old1, '<div class="wp-medal-circle">' + "`r`n" + '                        <svg viewBox="0 0 80 80" fill="none"><path d="M16 52h48v6H16z" fill="rgba(255,255,255,0.9)"/><path d="M16 52L22 32l12 10 6-20 6 20 12-10 6 20" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" fill="none" stroke-linejoin="round"/><circle cx="40" cy="22" r="3" fill="#D4AF37"/><circle cx="22" cy="32" r="2.5" fill="#D4AF37"/><circle cx="58" cy="32" r="2.5" fill="#D4AF37"/></svg><span class="wp-medal-icon-placeholder">')

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding $true))
Write-Host "Done"

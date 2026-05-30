$candidates = @('ollama','gemini','claude','codex','openai','gemma','llama','ollama.exe','gemini.exe')
foreach ($n in $candidates) {
    $c = Get-Command -Name $n -ErrorAction SilentlyContinue
    if ($c) {
        Write-Host "$n -> $($c.Source) ($($c.CommandType))"
    }
    else {
        Write-Host "$n -> not found"
    }
}
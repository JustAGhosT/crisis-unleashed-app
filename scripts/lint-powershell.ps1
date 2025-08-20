param(
    [string]$Path = "."
)

$ErrorActionPreference = 'Stop'
Write-Host "[PSScriptAnalyzer] Linting PowerShell scripts in $Path" -ForegroundColor Cyan

# Check for ScriptAnalyzer availability
$module = Get-Module -ListAvailable -Name PSScriptAnalyzer
if (-not $module) {
    Write-Warning "PSScriptAnalyzer not available. Install with: Install-Module PSScriptAnalyzer -Scope CurrentUser"
    exit 0
}

# Settings file
$settingsPath = Join-Path -Path ".pssa" -ChildPath "ScriptAnalyzerSettings.psd1"
$settings = @{}
if (Test-Path $settingsPath) {
    $settings = @{ Settings = $settingsPath }
}

# Find ps1 scripts (exclude common folders)
$files = Get-ChildItem -Path $Path -Recurse -Include *.ps1 -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules|.venv|dist|.next" }

if (-not $files) {
    Write-Host "No PowerShell scripts found." -ForegroundColor Yellow
    exit 0
}

$hadIssues = $false
foreach ($f in $files) {
    Write-Host "Analyzing $($f.FullName)" -ForegroundColor Gray
    $results = Invoke-ScriptAnalyzer -Path $f.FullName -Severity Error,Warning @settings
    if ($results) {
        $hadIssues = $true
        $results | ForEach-Object {
            Write-Host ("{0}:{1} {2} - {3}" -f $_.ScriptName, $_.Line, $_.RuleName, $_.Message) -ForegroundColor Red
        }
    }
}

if ($hadIssues) { exit 1 } else { exit 0 }

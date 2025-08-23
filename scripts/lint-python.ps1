param(
    [string]$Path = "backend"
)

$ErrorActionPreference = 'Stop'
Write-Host "[ruff] Linting Python files in $Path" -ForegroundColor Cyan

# Resolve ruff command if available
$ruff = (Get-Command ruff -ErrorAction SilentlyContinue)
if (-not $ruff) {
    # Try from .venv
    $venvRuff = Join-Path -Path ".venv" -ChildPath "Scripts/ruff.exe"
    if (Test-Path $venvRuff) {
        $ruff = $venvRuff
    }
}

if (-not $ruff) {
    Write-Warning "ruff is not installed. Install with: pip install ruff (or use your venv)"
    exit 0
}

${configPath} = Join-Path -Path "backend" -ChildPath "pyproject.toml"
if (Test-Path ${configPath}) {
    Write-Host "Using Ruff config: ${configPath}" -ForegroundColor DarkGray
    & $ruff check $Path --config ${configPath} --exclude "backend/types/**" --exclude "backend/types_old/**"
} else {
    & $ruff check $Path --exclude "backend/types/**" --exclude "backend/types_old/**"
}
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

# Activate virtual environment
if (Test-Path -Path ".\.venv\Scripts\activate.ps1") {
    & .\.venv\Scripts\activate.ps1
} else {
    Write-Host "Virtual environment not found or activation script missing. Trying alternative..."
    if (Test-Path -Path ".\.venv\Scripts\Activate.ps1") {
        & .\.venv\Scripts\Activate.ps1
    } elseif (Test-Path -Path ".\.venv\Scripts\Activate") {
        .\.venv\Scripts\Activate
    } else {
        Write-Host "Warning: Could not find virtual environment activation script. You may need to create it with: python -m venv .venv"
    }
}

# Check if the problematic types directory still exists and remove it
if (Test-Path -Path ".\types") {
    Write-Host "Removing problematic 'types' directory..."
    Remove-Item -Path ".\types" -Recurse -Force
}

# Set PYTHONPATH to include the current directory
$env:PYTHONPATH = $PWD

# Define the port to use
$backendPort = 8010

  # Check if the backend port is already in use and kill the process if needed
  try {
    $connections = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
    $pids = @($connections | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique)
    if ($pids.Count -gt 0) {
        $procInfo = $pids | ForEach-Object { Get-Process -Id $_ -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path }
        Write-Host "Port $backendPort in use by:`n$($procInfo | Format-Table | Out-String)"
        $uvicornPids = $procInfo | Where-Object { $_.ProcessName -match 'python' -or $_.ProcessName -match 'uvicorn' } | Select-Object -ExpandProperty Id
        if ($uvicornPids.Count -gt 0) {
            $confirm = Read-Host "Kill uvicorn/python processes on port $backendPort? (y/N)"
            if ($confirm -match '^[Yy]$') {
                Stop-Process -Id $uvicornPids -Force
                Start-Sleep -Seconds 1
                Write-Host "Terminated process(es): $($uvicornPids -join ', ')"
            } else {
                Write-Host "Aborting process termination."
            }
        } else {
            Write-Host "Non-uvicorn process is using port $backendPort. Skipping termination."
        }
    }
  } catch {
      Write-Host "Warning: Unable to check for processes using port $backendPort. If server fails to start, manually check for processes using this port."
  }

# Start the server with uvicorn
Write-Host "Starting server on port $backendPort..."
python -m uvicorn server:app --reload --host 0.0.0.0 --port $backendPort
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
    $processUsingBackendPort = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processUsingBackendPort) {
        Write-Host "Port $backendPort is in use by process ID: $processUsingBackendPort. Terminating process..."
        Stop-Process -Id $processUsingBackendPort -Force
        Start-Sleep -Seconds 1  # Give it a moment to release the port
        Write-Host "Process terminated."
    }
} catch {
    Write-Host "Warning: Unable to check for processes using port $backendPort. If server fails to start, manually check for processes using this port."
}

# Start the server with uvicorn
Write-Host "Starting server on port $backendPort..."
python -m uvicorn server:app --reload --host 0.0.0.0 --port $backendPort
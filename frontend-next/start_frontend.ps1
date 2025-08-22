# Define the port to use
$frontendPort = 3010

# Check if the frontend port is already in use and kill the process if needed
try {
    $processUsingFrontendPort = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processUsingFrontendPort) {
        Write-Host "Port $frontendPort is in use by process ID: $processUsingFrontendPort. Terminating process..."
        Stop-Process -Id $processUsingFrontendPort -Force
        Start-Sleep -Seconds 1  # Give it a moment to release the port
        Write-Host "Process terminated."
    }
} catch {
    Write-Host "Warning: Unable to check for processes using port $frontendPort. If server fails to start, manually check for processes using this port."
}

# Start the frontend with a specific port
Write-Host "Starting frontend on port $frontendPort..."
pnpm dev --port $frontendPort
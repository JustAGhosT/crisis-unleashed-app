# PowerShell script to start the backend server
Write-Host "Starting Crisis Unleashed Backend..."
Write-Host "========================================"

# Set environment variables for development
$env:ENVIRONMENT = "development"
$env:USE_IN_MEMORY_DB = "true"
$env:PORT = "8010"

# Determine which mode to use - development or production
$useDevelopmentMode = $true  # Set to $false for production mode

if ($useDevelopmentMode) {
    # Development mode - use the simplified server
    Write-Host "Using DEVELOPMENT mode with simplified server"
    Write-Host "--------------------------------------"
    Write-Host "Starting server on port $env:PORT..."
    # Changed from run.py to server.py since that's the actual server file
    python -m server
} else {
    # Production mode - use the full server implementation
    Write-Host "Using PRODUCTION mode with full server implementation"
    Write-Host "--------------------------------------"
    Write-Host "Starting server on port $env:PORT..."
    
    # Get number of CPU cores for worker count (half the cores, minimum 2)
    $cpuCount = (Get-CimInstance Win32_ComputerSystem).NumberOfLogicalProcessors
    $workerCount = [Math]::Max(2, [Math]::Floor($cpuCount / 2))
    
    # Production uvicorn without reload flag and with appropriate worker count
    uvicorn server:app --host 0.0.0.0 --port $env:PORT --workers $workerCount
}
# PowerShell script to start the backend server
Write-Host "Starting Crisis Unleashed Backend..."
Write-Host "========================================"

# Set defaults only when not already provided by the caller/host
if (-not $env:ENVIRONMENT) { $env:ENVIRONMENT = "development" }
if (-not $env:USE_IN_MEMORY_DB) { $env:USE_IN_MEMORY_DB = "true" }
if (-not $env:PORT) { $env:PORT = "8010" }

# Determine which mode to use based on ENVIRONMENT variable
$useDevelopmentMode = ($env:ENVIRONMENT -eq "development")

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
    $cpuCount = [Environment]::ProcessorCount
    $workerCount = [Math]::Max(2, [Math]::Floor($cpuCount / 2))
    
    # Production uvicorn without reload flag and with appropriate worker count
    python -m uvicorn server:app --host 0.0.0.0 --port $env:PORT --workers $workerCount
}
# Activate virtual environment
.\.venv\Scripts\Activate

# Check if the problematic types directory still exists and remove it
if (Test-Path -Path ".\types") {
    Write-Host "Removing problematic 'types' directory..."
    Remove-Item -Path ".\types" -Recurse -Force
}

# Set PYTHONPATH to include the current directory
$env:PYTHONPATH = $PWD

# Start the server with uvicorn
python -m uvicorn server:app --reload
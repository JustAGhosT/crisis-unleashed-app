# Create a Python virtual environment if it doesn't exist
if (-not (Test-Path -Path ".venv")) {
    python -m venv .venv
}

# Activate the virtual environment
. . .\.venv\Scripts\Activate.p   # note leading dot & space# Upgrade pip using the venv's Python
.\.venv\Scripts\python.exe -m pip install --upgrade pip

# Install Python dependencies using the venv's Python
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Write-Host "Backend setup complete! Run 'pnpm start' to start the development servers."

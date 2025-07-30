# Create a Python virtual environment if it doesn't exist
if (-not (Test-Path -Path ".venv")) {
    python -m venv .venv
}

# Activate the virtual environment
.\\.venv\\Scripts\\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

Write-Host "Backend setup complete! Run 'pnpm start' to start the development servers."

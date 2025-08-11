# This script will remove all Python cache files from Git's index while keeping them in your working directory

# Find all tracked Python cache files
$pycacheFiles = git ls-files | Where-Object { $_ -match '__pycache__\\.*\\.pyc$' -or $_ -match '\\.py[cod]$' }

# Remove each file from Git's index while keeping it in the working directory
foreach ($file in $pycacheFiles) {
    Write-Host "Removing from Git index: $file"
    git rm --cached $file
}

Write-Host "\nCleanup complete. Run 'git status' to see the changes."
Write-Host "Don't forget to commit these changes to update the repository."

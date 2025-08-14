function Move-FolderContents($Source, $Destination) {
    if (-not (Test-Path $Source)) { return } # Skip if source doesn't exist
    Get-ChildItem -Path $Source -Force | ForEach-Object {
        $destPath = Join-Path $Destination $_.Name
        if ($_.PSIsContainer) {
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -ErrorAction SilentlyContinue | Out-Null
            }
            Move-FolderContents $_.FullName $destPath
            Remove-Item $_.FullName -Force -Recurse
        } else {
            Move-Item $_.FullName $destPath -Force
        }
    }
}

Move-FolderContents ".\src\app" ".\frontend-next\src\app"
Move-FolderContents ".\src\components" ".\frontend-next\src\components"
Move-FolderContents ".\src\lib" ".\frontend-next\src\lib"
Move-FolderContents ".\src\types" ".\frontend-next\src\types"
Move-FolderContents ".\src\styles" ".\frontend-next\src\styles"

Get-ChildItem -Path .\src\ -File -Force | Move-Item -Destination .\frontend-next\src\ -Force
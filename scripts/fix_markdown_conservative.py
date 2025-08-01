import os
import re
from pathlib import Path

def fix_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Remove any markdown lint messages
    lines = [line for line in lines if 'md012' not in line.lower()]
    
    # Remove consecutive blank lines (keep max 2)
    cleaned_lines = []
    prev_blank = False
    for line in lines:
        is_blank = not line.strip()
        if is_blank and prev_blank:
            continue  # Skip consecutive blank lines
        cleaned_lines.append(line)
        prev_blank = is_blank
    
    # Ensure exactly one blank line at the end of file
    while cleaned_lines and not cleaned_lines[-1].strip():
        cleaned_lines.pop()
    cleaned_lines.append('\n')
    
    # Write back the cleaned content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)

def main():
    # Get all markdown files in the factions directory and subdirectories
    factions_dir = Path('docs/factions')
    md_files = list(factions_dir.rglob('*.md'))
    
    print(f"Found {len(md_files)} markdown files to clean")
    
    for md_file in md_files:
        print(f"Cleaning {md_file}...")
        fix_markdown_file(md_file)
    
    print("Markdown cleaning complete!")

if __name__ == "__main__":
    main()

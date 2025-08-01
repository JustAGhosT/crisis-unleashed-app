import os
import re
from pathlib import Path

def fix_md022(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        fixed_lines.append(line)
        
        # Check if current line is a heading (starts with 1-6 # followed by space)
        if re.match(r'^#{1,6}\s', line.strip()):
            # Check if previous line is not empty (unless it's the first line)
            if i > 0 and lines[i-1].strip() != '' and not (i > 1 and re.match(r'^#{1,6}\s', lines[i-2].strip())):
                # Insert blank line before heading
                fixed_lines.insert(-1, '\n')
            
            # Check if next line is not empty (unless it's the last line)
            if i < len(lines) - 1 and lines[i+1].strip() != '' and not (i < len(lines) - 2 and re.match(r'^#{1,6}\s', lines[i+2].strip())):
                # Insert blank line after heading
                fixed_lines.append('\n')
        
        i += 1
    
    # Write back the fixed content if changes were made
    if lines != fixed_lines:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(fixed_lines)
        return True
    return False

def main():
    # Get all markdown files in the docs directory and subdirectories
    docs_dir = Path('docs')
    md_files = list(docs_dir.rglob('*.md'))
    
    print(f"Found {len(md_files)} markdown files to check")
    
    fixed_count = 0
    for md_file in md_files:
        print(f"Checking {md_file}...")
        if fix_md022(md_file):
            print(f"  Fixed MD022 issues in {md_file.name}")
            fixed_count += 1
    
    print(f"\nFixed MD022 issues in {fixed_count} files")

if __name__ == "__main__":
    main()

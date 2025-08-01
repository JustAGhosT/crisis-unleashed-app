import os
import re
from pathlib import Path

def fix_md032(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if current line is a list item
        if re.match(r'^\s*[-*+]\s+', line) or (i > 0 and re.match(r'^\s*\d+\.\s+', line)):
            # Check if previous line is not empty and not a list item
            if i > 0 and not is_list_item(lines[i-1]) and lines[i-1].strip() != '':
                fixed_lines.append('\n')
            
            fixed_lines.append(line)
            
            # Move to next non-list item
            i += 1
            while i < len(lines) and (lines[i].startswith('    ') or lines[i].startswith('\t') or 
                                    re.match(r'^\s*[-*+]\s+', lines[i]) or 
                                    re.match(r'^\s*\d+\.\s+', lines[i])):
                fixed_lines.append(lines[i])
                i += 1
            
            # Check if next line is not empty and not a heading
            if i < len(lines) and lines[i].strip() != '' and not lines[i].startswith('#'):
                fixed_lines.append('\n')
            continue
            
        fixed_lines.append(line)
        i += 1
    
    # Write back the fixed content if changes were made
    if lines != fixed_lines:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(fixed_lines)
        return True
    return False

def is_list_item(line):
    return bool(re.match(r'^\s*[-*+]\s+', line) or re.match(r'^\s*\d+\.\s+', line))

def main():
    # Get all markdown files in the docs directory and subdirectories
    docs_dir = Path('docs')
    md_files = list(docs_dir.rglob('*.md'))
    
    print(f"Found {len(md_files)} markdown files to check")
    
    fixed_count = 0
    for md_file in md_files:
        print(f"Checking {md_file}...")
        if fix_md032(md_file):
            print(f"  Fixed MD032 issues in {md_file.name}")
            fixed_count += 1
    
    print(f"\nFixed MD032 issues in {fixed_count} files")

if __name__ == "__main__":
    main()

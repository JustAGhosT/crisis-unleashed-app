import os
import re
from pathlib import Path

def fix_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Remove any markdown lint messages
    content = re.sub(r'<!--.*?-->\s*', '', content, flags=re.DOTALL)
    
    # Fix 2: Ensure consistent spacing around headings
    content = re.sub(r'(\S)(\n#+\s)', r'\1\n\n\2', content)  # Before headings
    content = re.sub(r'(#+\s.+?)(\n\S)', r'\1\n\n\2', content)  # After headings
    
    # Fix 3: Fix list formatting
    content = re.sub(r'(\S)(\n\s*[-*]\s)', r'\1\n\2', content)  # Before lists
    content = re.sub(r'([-*]\s.+?)(\n\S)', r'\1\n\2', content)  # After lists
    
    # Fix 4: Remove trailing whitespace
    content = re.sub(r'[ \t]+\n', '\n', content)
    
    # Fix 5: Ensure exactly one newline at end of file
    content = content.rstrip('\n') + '\n'
    # Write back the fixed content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # Get all markdown files in the factions directory and subdirectories
    factions_dir = Path('docs/factions')
    md_files = list(factions_dir.rglob('*.md'))
    
    print(f"Found {len(md_files)} markdown files to process")
    
    for md_file in md_files:
        print(f"Processing {md_file}...")
        fix_markdown_file(md_file)
    
    print("Markdown formatting fixes complete!")

if __name__ == "__main__":
    main()

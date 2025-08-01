import os
import re
from pathlib import Path

def fix_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Ensure exactly one newline at end of file
    content = content.rstrip('\n') + '\n'
    
    # Fix 2: Ensure consistent spacing around headings
    content = re.sub(r'(\S)(\n#+\s)', r'\1\n\n\2', content)  # Before headings
    content = re.sub(r'(#+\s.+?)(\n\S)', r'\1\n\n\2', content)  # After headings
    
    # Fix 3: Ensure lists have blank lines before them
    content = re.sub(r'(\S)(\n\s*[-*]\s)', r'\1\n\n\2', content)
    
    # Fix 4: Ensure consistent spacing around lists
    content = re.sub(r'(\S)(\n\s*[-*]\s)', r'\1\n\n\2', content)  # Before lists
    content = re.sub(r'([-*]\s.+?)(\n\S)', r'\1\n\n\2', content)  # After lists
    
    # Fix 5: Ensure consistent spacing around code blocks
    content = re.sub(r'(```)(\w*\n)', r'\n\1\2', content)  # Before code blocks
    content = re.sub(r'(\n```)(\n\S)', r'\1\n\n\2', content)  # After code blocks
    
    # Fix 6: Remove trailing whitespace
    content = re.sub(r'[ \t]+\n', '\n', content)
    
    # Write back the fixed content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # Get all markdown files in the pairs directory
    pairs_dir = Path('docs/factions/pairs')
    md_files = list(pairs_dir.glob('*.md'))
    
    print(f"Found {len(md_files)} markdown files to process")
    
    for md_file in md_files:
        print(f"Processing {md_file}...")
        fix_markdown_file(md_file)
    
    print("Markdown formatting fixes complete!")

if __name__ == "__main__":
    main()

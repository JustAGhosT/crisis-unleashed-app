#!/usr/bin/env python3
"""
Generate a secure secret key for the Crisis Unleashed Backend.

This script generates a cryptographically secure random key suitable
for JWT token signing and other security purposes.
"""

import secrets
import sys


def generate_secret_key(length: int = 64) -> str:
    """
    Generate a secure random hex string.
    
    Args:
        length: Length in characters (default 64 = 32 bytes)
    
    Returns:
        Secure random hex string
    """
    # Generate half the characters since hex encoding doubles the length
    return secrets.token_hex(length // 2)


def main() -> None:
    """Main function to generate and display a secret key."""
    print("CRISIS UNLEASHED BACKEND - SECRET KEY GENERATOR")
    print("=" * 50)
    
    # Generate keys of different lengths
    keys = {
        "Standard (64 chars / 32 bytes)": generate_secret_key(64),
        "Strong (128 chars / 64 bytes)": generate_secret_key(128),
    }
    
    for name, key in keys.items():
        print(f"\n{name}:")
        print(f"SECRET_KEY={key}")
    
    print("\n" + "=" * 50)
    print("INSTRUCTIONS:")
    print("1. Copy one of the keys above")
    print("2. Replace SECRET_KEY=__REPLACE_ME_SECURE_RANDOM_HEX__ in your .env file")
    print("3. Keep this key secret and never commit it to version control!")
    
    print("\nALTERNATIVE METHODS:")
    print("* Command line: openssl rand -hex 32")
    print("* Python: import secrets; secrets.token_hex(32)")
    print("* Online: Use a reputable password generator (64+ chars)")


if __name__ == "__main__":
    main()
"""
Verify MongoDB timezone awareness configuration across the backend.

This script searches for:
- PyMongo MongoClient instantiations
- Motor AsyncIOMotorClient / MotorClient instantiations
- Explicit bson.codec_options.CodecOptions usages
- Connection strings containing tzUTC parameters

It reports whether tz_aware (PyMongo/Motor) or tz_aware in CodecOptions
is explicitly set, and flags potential risks of naive datetimes being returned.

Run:
  python backend/scripts/verify_mongo_tz.py
"""
from __future__ import annotations

import ast
import os
import re
from dataclasses import dataclass
from typing import Iterable, Optional

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))

CLIENT_NAMES = {
    "MongoClient",              # PyMongo
    "AsyncIOMotorClient",       # Motor asyncio
    "MotorClient",              # Motor tornado (legacy)
}

CODEC_OPTIONS_NAMES = {
    "CodecOptions",             # bson.codec_options.CodecOptions
}

URI_PATTERN = re.compile(r"mongodb(?:\+srv)?://[^\s'\"]+", re.IGNORECASE)


@dataclass
class Finding:
    file: str
    line: int
    kind: str  # 'client', 'codec', 'uri'
    name: str
    tz_aware: Optional[bool]
    extra: str = ""

    def fmt(self) -> str:
        base = f"{self.file}:{self.line}: [{self.kind}] {self.name}"
        if self.tz_aware is None:
            return f"{base} tz_aware: <unspecified> {self.extra}".rstrip()
        return f"{base} tz_aware: {self.tz_aware} {self.extra}".rstrip()


def iter_py_files(base: str) -> Iterable[str]:
    for root, _, files in os.walk(base):
        for f in files:
            if f.endswith(".py") and ".venv" not in root and "__pycache__" not in root:
                yield os.path.join(root, f)


def get_call_name(node: ast.Call) -> Optional[str]:
    # Handles `Name(...)`, `pkg.Name(...)`, `pkg.sub.Name(...)`
    target = node.func
    if isinstance(target, ast.Name):
        return target.id
    if isinstance(target, ast.Attribute):
        # Reconstruct last attribute only
        return target.attr
    return None


def kw_bool(kwargs: list[ast.keyword], key: str) -> Optional[bool]:
    for kw in kwargs:
        if kw.arg == key:
            if isinstance(kw.value, ast.Constant) and isinstance(kw.value.value, bool):
                return kw.value.value
            # Could be a Name/Attribute; unknown at static time
            return None
    return None


def kw_str(kwargs: list[ast.keyword], key: str) -> Optional[str]:
    for kw in kwargs:
        if kw.arg == key and isinstance(kw.value, ast.Constant) and isinstance(kw.value.value, str):
            return kw.value.value
    return None


def analyze_file(path: str) -> list[Finding]:
    findings: list[Finding] = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            src = f.read()
    except Exception:
        return findings

    # First: AST analysis for client and codec options
    try:
        tree = ast.parse(src, filename=path)
    except SyntaxError:
        tree = None

    if tree is not None:
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                name = get_call_name(node)
                if not name:
                    continue

                if name in CLIENT_NAMES:
                    tz = kw_bool(node.keywords, "tz_aware")
                    # Also detect codec_options argument presence (cannot easily tell tz_aware inside here statically)
                    has_codec = any(kw.arg == "codec_options" for kw in node.keywords)
                    extra = "(codec_options given)" if has_codec else ""
                    findings.append(Finding(path, node.lineno, "client", name, tz, extra))

                elif name in CODEC_OPTIONS_NAMES:
                    tz = kw_bool(node.keywords, "tz_aware")
                    findings.append(Finding(path, node.lineno, "codec", name, tz))

    # Second: regex scan for URIs with tzUTC
    for m in URI_PATTERN.finditer(src):
        uri = m.group(0)
        # Calculate line number from match position
        match_pos = m.start()
        # Count newlines up to the match position to get line number (1-indexed)
        line_no = src[:match_pos].count('\n') + 1
        # Normalize for case-insensitive key lookup
        lower = uri.lower()
        tzutc: Optional[bool] = None
        if "tzutc=true" in lower:
            tzutc = True
        elif "tzutc=false" in lower:
            tzutc = False
        findings.append(Finding(path, line_no, "uri", "connection_string", tzutc, extra=uri))

    return findings


def main() -> None:
    backend_root = os.path.abspath(os.path.join(ROOT))
    targets = [os.path.join(backend_root)]

    all_findings: list[Finding] = []
    for base in targets:
        for file_path in iter_py_files(base):
            all_findings.extend(analyze_file(file_path))

    if not all_findings:
        print("No MongoDB client or codec options usages found.")
        return

    print("=== MongoDB timezone awareness verification ===")
    problems = 0
    for finding in sorted(all_findings, key=lambda x: (x.file, x.line, x.kind)):
        print(finding.fmt())
        # Heuristics: tz_aware unspecified is risky, False is wrong if code uses tz-aware datetimes
        if finding.kind in {"client", "codec"}:
            if finding.tz_aware is None:
                problems += 1
            elif finding.tz_aware is False:
                problems += 1
        if finding.kind == "uri" and finding.tz_aware is False:
            problems += 1

    print("=== Summary ===")
    print(f"Total findings: {len(all_findings)} | Potential issues: {problems}")
    if problems:
        print("Recommendation: Ensure PyMongo/Motor clients are created with tz_aware=True, or use\n"
              "CodecOptions(tz_aware=True) on database/collection. For URIs, prefer tzUTC=true.")
        print("Context: Your models (e.g., backend/repository/outbox_models.py) use timezone-aware\n"
              "datetimes via datetime.now(UTC). Mixed naive/aware datetimes will cause subtle bugs.")


if __name__ == "__main__":
    main()
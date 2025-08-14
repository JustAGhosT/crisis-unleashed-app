/**
 * ESLint config for the Next.js app router project.
 * Disables pages-specific rule and scopes Next rootDir here.
 */
module.exports = {
  root: true,
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    next: {
      rootDir: ["."],
    },
  },
  rules: {
    // App Router project; no pages directory
    "next/no-html-link-for-pages": "off",
  },
};

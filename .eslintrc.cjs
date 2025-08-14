/**
 * Root ESLint config to scope Next.js rules to the frontend-next app.
 * Prevents monorepo root scans from expecting a pages directory at the root.
 */
module.exports = {
  root: true,
  settings: {
    next: {
      // Point Next.js ESLint rules to the correct app root(s)
      rootDir: ["frontend-next/"],
    },
  },
  overrides: [
    {
      files: ["frontend-next/**/*.{ts,tsx}"],
      extends: ["next", "next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    },
  ],
};

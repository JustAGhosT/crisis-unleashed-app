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
    // Allow CSS custom-properties-only style usage in MoodBoard component
    // We disable the generic forbid rule here and keep usage constrained in code
    // by setting only CSS variables via inline style.
    {
      files: ["frontend-next/src/components/factions/MoodBoard.tsx"],
      rules: {
        // Permit style prop in this file (used only to set CSS custom properties)
        "react/forbid-dom-props": "off",
      },
    },
  ],
};

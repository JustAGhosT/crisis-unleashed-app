import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Flags",
  description: "Admin interface for managing feature flags",
  robots: { index: false, follow: false },
};

export default function FeatureFlagsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Feature Flags</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Basic admin page restored to satisfy typed routes. Integrate controls as needed.
      </p>
      <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm">Coming soon: manage feature flags here.</p>
      </div>
    </main>
  );
}

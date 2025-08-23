export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-1/3 rounded bg-muted/30" />
        <div className="h-4 w-2/3 rounded bg-muted/20" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg border border-border/40 bg-background/40" />
          ))}
          <div className="md:col-span-2 xl:col-span-3 h-48 rounded-lg border border-border/40 bg-background/40" />
        </div>
      </div>
    </div>
  );
}

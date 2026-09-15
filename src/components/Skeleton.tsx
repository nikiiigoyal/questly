/**
 * Reusable shimmer skeleton block for loading states.
 * Usage: <Skeleton className="h-10 w-full rounded-2xl" />
 */
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-line ${className}`}
      aria-hidden="true"
    />
  );
}

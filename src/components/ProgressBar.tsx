export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

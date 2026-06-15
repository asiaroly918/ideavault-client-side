export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-base-content/70 font-medium">Loading amazing ideas...</p>
    </div>
  );
}

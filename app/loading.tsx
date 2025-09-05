export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-textPrimary mb-2">Loading GigFlow</h2>
        <p className="text-textSecondary">Finding the perfect gigs for you...</p>
      </div>
    </div>
  );
}

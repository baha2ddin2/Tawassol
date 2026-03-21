export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-8 w-full">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
      <p className="mt-2 text-sm text-gray-500 font-medium">Loading more ...</p>
    </div>
  );
}

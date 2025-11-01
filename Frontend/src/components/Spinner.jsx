export const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};

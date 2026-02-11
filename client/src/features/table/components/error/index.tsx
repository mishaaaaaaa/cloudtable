export const TableError = () => {
  return (
    <div className="flex flex-col h-full w-full bg-white text-[13px] font-sans text-gray-900 overflow-hidden rounded-lg shadow-sm items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-100 max-w-md">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-1">Network Error</h3>
        <p className="text-red-600 mb-4">Ooops! We couldn't load the data. Please check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors font-medium shadow-sm"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="flex flex-col h-screen bg-white text-sm font-sans text-gray-900 border-t border-gray-200">
      {/* 1. App Header */}

      <div className="h-14 bg-[#f0404a] flex items-center px-4">
        <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
      </div>

      {/* 2. Toolbar */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-4 shadow-sm z-20">
        <div className="w-24 h-8 bg-gray-100 rounded animate-pulse"></div>
        <div className="ml-auto">
          <div className="w-16 h-5 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>

      {/* 3. The Grid Skeleton */}
      <div className="flex-1 overflow-hidden bg-[#f5f5f5] relative">
        {/* Header */}

        <div className="flex h-[30px] border-b border-gray-300 bg-gray-100">
          <div className="w-12 border-r border-gray-300 flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-300 rounded-sm animate-pulse"></div>
          </div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-[150px] border-r border-gray-300 px-2 flex items-center">
              <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 20 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex h-[35px] border-b border-gray-200 bg-white">
            <div className="w-12 border-r border-gray-200 bg-gray-50 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {Array.from({ length: 15 }).map((_, colIndex) => (
              <div key={colIndex} className="w-[150px] border-r border-gray-200 px-2 flex items-center">
                <div className={`h-3 bg-gray-100 rounded animate-pulse ${colIndex % 3 === 0 ? "w-24" : colIndex % 2 === 0 ? "w-16" : "w-10"}`}></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="h-8 border-t border-gray-200 bg-white flex items-center px-4 justify-between z-20">
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div> <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

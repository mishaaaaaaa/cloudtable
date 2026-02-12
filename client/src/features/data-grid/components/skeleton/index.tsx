export const TableSkeleton = () => {
  return (
    <div className="flex flex-col h-full w-full bg-white text-[13px] font-sans text-gray-900 overflow-hidden rounded-lg shadow-sm">
      <div className="h-12 bg-sky-300 flex items-center px-4 shrink-0">
        <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
      </div>

      <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-4 shadow-sm z-20 shrink-0">
        <div className="w-24 h-8 bg-gray-100 rounded animate-pulse"></div>
        <div className="ml-auto">
          <div className="w-16 h-5 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white relative">
        <div className="flex h-[32px] border-b border-gray-300 bg-[#f5f5f5]">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-[150px] border-r border-gray-300 px-2 flex items-center">
              <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {Array.from({ length: 20 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex h-[32px] border-b border-gray-200 bg-white">
            {Array.from({ length: 15 }).map((_, colIndex) => (
              <div key={colIndex} className="w-[150px] border-r border-gray-200 px-2 flex items-center">
                <div className={`h-3 bg-gray-100 rounded animate-pulse ${colIndex % 3 === 0 ? "w-24" : colIndex % 2 === 0 ? "w-16" : "w-10"}`}></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="h-9 border-t border-gray-200 bg-white flex items-center px-4 justify-between shrink-0">
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div> <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export const TableHeader = () => {
  return (
    <div className="h-12 bg-sky-300 flex items-center px-4 justify-between text-white shrink-0 z-30 relative">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg tracking-tight">CloudTable</span>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-white/30 transition-colors">Beta</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#fcb812] rounded-full flex items-center justify-center text-xs text-black font-bold border-2 border-white/20 cursor-pointer">
          UG
        </div>
      </div>
    </div>
  );
};

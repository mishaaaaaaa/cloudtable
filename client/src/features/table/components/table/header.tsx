export const TableHeader = () => {
  return (
    <div className="h-12 bg-[#73a3ee] flex items-center px-4 justify-between text-white shrink-0 z-30 relative">
      <div className="flex items-center gap-4">
        {/* Hamburger Icon */}
        <svg className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
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

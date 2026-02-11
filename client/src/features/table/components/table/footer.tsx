import React from "react";

interface TableFooterProps {
  recordCount: number;
}

export const TableFooter: React.FC<TableFooterProps> = ({ recordCount }) => {
  return (
    <div className="h-9 border-t border-gray-200 bg-white flex items-center px-4 text-xs text-gray-600 justify-between shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="bg-white border border-gray-300 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm">View 1</div>
        <div>{recordCount.toLocaleString()} records</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-[11px] uppercase tracking-wide text-gray-400 cursor-pointer hover:text-gray-600">Help</div>
        <div className="text-[11px] uppercase tracking-wide text-gray-400">Autosaved</div>
      </div>
    </div>
  );
};

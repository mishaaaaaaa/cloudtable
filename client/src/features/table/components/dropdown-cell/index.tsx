import { useState, useEffect } from "react";
import type { CellContext } from "@tanstack/react-table";
import { Select, type SelectOption } from "@/shared/ui/select";
import type { Row } from "@/features/table/types";

type DropdownCellProps = CellContext<Row, unknown> & {
  options: string[];
  selectClassName?: string;
};

export const DropdownCell = ({ getValue, row, column, table, options, selectClassName }: DropdownCellProps) => {
  const initialValue = String(getValue() ?? "");
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const selectOptions: SelectOption[] = options.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const handleChange = (newValue: string) => {
    setValue(newValue);
    table.options.meta?.updateData(row.index, column.id as keyof Row, newValue, row.original.id);
  };

  return (
    <div className="w-full h-full px-1 py-1">
      <Select
        value={value}
        onChange={handleChange}
        options={selectOptions}
        placeholder="Select..."
        className="w-full h-full"
        renderTrigger={(selectedOption) => (
          <div
            className={`${selectClassName ?? "w-full h-full bg-transparent hover:bg-gray-50 rounded px-2 flex items-center justify-between cursor-pointer text-gray-700"}`}
          >
            <span className="truncate">{selectedOption?.label || value}</span>
            <svg className="w-3 h-3 ml-1 opacity-40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      />
    </div>
  );
};

import type { CellContext } from "@tanstack/react-table";
import type { Row } from "../../../../types";

type DropdownCellProps = CellContext<Row, unknown> & {
  options: string[];
  selectClassName?: string;
};

export const DropdownCell = ({ getValue, row, column, table, options, selectClassName }: DropdownCellProps) => {
  const value = String(getValue() ?? "");

  return (
    <select
      value={value}
      onChange={(event) => table.options.meta?.updateData(row.index, column.id as keyof Row, event.target.value, row.original.id)}
      className={selectClassName ?? "w-full h-full bg-transparent outline-none cursor-pointer"}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

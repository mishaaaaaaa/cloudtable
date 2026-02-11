import { useEffect, useState } from "react";
import type { CellContext } from "@tanstack/react-table";
import type { Row } from "../../../../types";

type BasicCellProps = CellContext<Row, unknown> & {
  inputClassName?: string;
  formatValue?: (value: unknown) => string;
  parseValue?: (value: string) => unknown;
};

const defaultFormat = (value: unknown) => String(value ?? "");
const defaultParse = (value: string) => value;

export const BasicCell = ({ getValue, row, column, table, inputClassName, formatValue = defaultFormat, parseValue = defaultParse }: BasicCellProps) => {
  const initialValue = formatValue(getValue());
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id as keyof Row, parseValue(value), row.original.id);
    }
  };

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={onBlur}
      className={inputClassName ?? "w-full h-full bg-transparent outline-none px-1 py-1 focus:ring-2 focus:ring-blue-500 rounded-sm -ml-1"}
    />
  );
};

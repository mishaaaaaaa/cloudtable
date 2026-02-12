import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CellContext } from "@tanstack/react-table";
import { FloatingEditor } from "./floating-editor";
import type { Row } from "@/features/table/types";

type BasicCellProps = CellContext<Row, unknown> & {
  inputClassName?: string;
  formatValue?: (value: unknown) => string;
  parseValue?: (value: string) => unknown;
  type?: "text" | "number";
};

const defaultFormat = (value: unknown) => String(value ?? "");
const defaultParse = (value: string) => value;

export const BasicCell = ({ getValue, row, column, table, formatValue = defaultFormat, parseValue = defaultParse, type = "text" }: BasicCellProps) => {
  const initialValue = formatValue(getValue());
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [editRect, setEditRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    setIsEditing(false);
    setEditRect(null);
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id as keyof Row, parseValue(value), row.original.id);
    }
  };

  const handleStartEdit = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      setEditRect(rect);
      setIsEditing(true);
    }
  };

  if (isEditing && editRect) {
    return (
      <>
        <div className="w-full h-full opacity-0 pointer-events-none">{value}</div>
        {createPortal(<FloatingEditor value={value} onChange={setValue} onBlur={onBlur} rect={editRect} type={type} />, document.body)}
      </>
    );
  }

  return (
    <div className="w-full h-full cursor-text flex items-center" onClick={handleStartEdit}>
      <span className="truncate w-full block">{value}</span>
    </div>
  );
};

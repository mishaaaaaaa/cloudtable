import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { CellContext } from "@tanstack/react-table";
import type { Row } from "../../../../types";

type BasicCellProps = CellContext<Row, unknown> & {
  inputClassName?: string;
  formatValue?: (value: unknown) => string;
  parseValue?: (value: string) => unknown;
};

const defaultFormat = (value: unknown) => String(value ?? "");
const defaultParse = (value: string) => value;

const FloatingEditor = ({ value, onChange, onBlur, rect }: { value: string; onChange: (val: string) => void; onBlur: () => void; rect: DOMRect | null }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textAreaRef.current && rect) {
      // Position strictly over the cell
      textAreaRef.current.style.top = `${rect.top - 1}px`; // -1 to cover border
      textAreaRef.current.style.left = `${rect.left - 1}px`;
      textAreaRef.current.style.width = `${rect.width + 2}px`; // +2 for border overlap
      textAreaRef.current.style.minHeight = `${rect.height + 2}px`; // match cell height minimum

      // Auto-focus and place cursor at end
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(value.length, value.length);

      // Auto-resize height
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [rect]); // Run once on mount when rect is available

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Auto-resize on type
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onBlur();
    }
    if (e.key === "Escape") {
      // Ideally revert value, but simplified for now
      onBlur();
    }
  };

  if (!rect) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent" onClick={onBlur}>
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="fixed z-[60] bg-white text-[13px] text-gray-900 border-2 border-blue-500 rounded-sm outline-none px-2 py-1.5 overflow-hidden resize-none shadow-lg"
        style={{
          lineHeight: "1.2", // Match table line height approximation
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export const BasicCell = ({ getValue, row, column, table, formatValue = defaultFormat, parseValue = defaultParse }: BasicCellProps) => {
  const initialValue = formatValue(getValue());
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id as keyof Row, parseValue(value), row.original.id);
    }
  };

  if (isEditing) {
    return (
      <>
        <div ref={cellRef} className="w-full h-full opacity-0 pointer-events-none">
          {value}
        </div>
        {createPortal(
          <FloatingEditor value={value} onChange={setValue} onBlur={onBlur} rect={cellRef.current?.parentElement?.getBoundingClientRect() ?? null} />,
          document.body,
        )}
      </>
    );
  }

  return (
    <div ref={cellRef} className="w-full h-full cursor-text flex items-center" onClick={() => setIsEditing(true)}>
      <span className="truncate w-full block">{value}</span>
    </div>
  );
};

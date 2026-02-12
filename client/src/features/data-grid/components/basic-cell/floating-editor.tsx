import React, { useRef, useLayoutEffect } from "react";

interface FloatingEditorProps {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  rect: DOMRect | null;
  type?: "text" | "number";
}

export const FloatingEditor = ({ value, onChange, onBlur, rect, type = "text" }: FloatingEditorProps) => {
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputRef.current && rect) {
      inputRef.current.style.top = `${rect.top - 1}px`;
      inputRef.current.style.left = `${rect.left - 1}px`;
      inputRef.current.style.width = `${rect.width + 2}px`;

      inputRef.current.focus();

      if (type === "text" && inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(value.length, value.length);
        inputRef.current.style.height = "35px";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      } else {
        inputRef.current.style.height = `${rect.height + 2}px`;
      }
    }
  }, [rect, value.length, type]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onBlur();
    }
    if (e.key === "Escape") {
      onBlur();
    }
  };

  if (!rect) return null;

  const commonClasses = "fixed z-[60] bg-white text-[13px] text-gray-900 border-2 border-blue-500 rounded-sm outline-none px-2 py-1.5 shadow-lg";

  return (
    <div className="fixed inset-0 z-50 bg-transparent" onClick={onBlur}>
      {type === "text" ? (
        <textarea
          name="editor"
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`${commonClasses} overflow-hidden resize-none`}
          style={{ lineHeight: "1.2" }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <input
          type="number"
          name="editor"
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={commonClasses}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

import React, { useRef, useLayoutEffect } from "react";

interface FloatingEditorProps {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  rect: DOMRect | null;
}

export const FloatingEditor = ({ value, onChange, onBlur, rect }: FloatingEditorProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textAreaRef.current && rect) {
      textAreaRef.current.style.top = `${rect.top - 1}px`;
      textAreaRef.current.style.left = `${rect.left - 1}px`;
      textAreaRef.current.style.width = `${rect.width + 2}px`;

      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(value.length, value.length);

      textAreaRef.current.style.height = "35px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [rect, value.length]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-transparent" onClick={onBlur}>
      <textarea
        name="editor"
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

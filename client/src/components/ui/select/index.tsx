import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  renderTrigger?: (selectedOption: SelectOption | undefined, isOpen: boolean) => React.ReactNode;
  placeholder?: string;
  className?: string; // wrapper className
  dropdownClassName?: string;
  itemClassName?: string;
  align?: "left" | "right";
}

// Hook to handle dropdown state, positioning, and outside interactions
const useDropdown = (align: "left" | "right") => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left?: number; right?: number }>({ top: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);

    const handleEvent = (event: Event) => {
      const target = event.target as Element;
      // Close if interactions are outside the trigger AND outside the dropdown portal
      if (!triggerRef.current?.contains(target as Node) && !target.closest(".select-dropdown-portal")) {
        close();
      }
    };

    document.addEventListener("mousedown", handleEvent as EventListener);
    window.addEventListener("scroll", handleEvent, true); // Close on scroll to keep UI simple

    return () => {
      document.removeEventListener("mousedown", handleEvent as EventListener);
      window.removeEventListener("scroll", handleEvent, true);
    };
  }, [isOpen]);

  const toggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: align === "left" ? rect.left : undefined,
        right: align === "right" ? window.innerWidth - rect.right : undefined,
      });
    }
    setIsOpen((prev) => !prev);
  };

  return { isOpen, setIsOpen, triggerRef, position, toggle };
};

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  renderTrigger,
  placeholder = "Select...",
  className = "relative h-full",
  dropdownClassName = "fixed mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50",
  itemClassName = "px-3 py-1.5 text-[13px] hover:bg-blue-50 cursor-pointer flex items-center justify-between",
  align = "right",
}) => {
  const { isOpen, setIsOpen, triggerRef, position, toggle } = useDropdown(align as "left" | "right");
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className} ref={triggerRef}>
      <div onClick={toggle} className="h-full">
        {renderTrigger ? (
          renderTrigger(selectedOption, isOpen)
        ) : (
          <div className="cursor-pointer text-[13px] h-full flex items-center px-1 w-full outline-none">{selectedOption?.label || value || placeholder}</div>
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            className={`select-dropdown-portal ${dropdownClassName}`}
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
            }}
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <div
                  key={option.value}
                  className={`${itemClassName} ${isSelected ? "text-blue-600 bg-blue-50/50" : "text-gray-700"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

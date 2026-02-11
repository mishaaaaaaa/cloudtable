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
  className?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  align?: "left" | "right";
}

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left?: number; right?: number }>({ top: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Logic changed: Since interactions happen in portal, simpler check might fail.
      // We rely on checking if target is NOT in containerRef (trigger).
      // But clicking inside the portal should also NOT close it.
      // However, selecting an option closes it, so clicking strictly inside portal is fine.
      // But "handleClickOutside" implies clicking totally outside.

      // Since portal is not inside containerRef, containerRef.contains() will be false for clicks in portal.
      // So we need to stop propagation on the dropdown content or check if click target is inside the dropdown.
      // But we don't have ref to dropdown node easily if using portal.

      // Simplification: We add close behavior to options click.
      // For clicking strictly outside:
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".select-dropdown-portal") // Add a class to portal content to identify it
      ) {
        setIsOpen(false);
      }
    };

    // Also close on scroll to avoid detached floating element
    const handleScroll = (event: Event) => {
      // Prevent closing if scrolling inside the dropdown itself (if it had overflow)
      if ((event.target as Element).closest?.(".select-dropdown-portal")) return;
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // Capture phase to catch all scrolls
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: align === "left" ? rect.left : undefined,
        right: align === "right" ? window.innerWidth - rect.right : undefined,
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className} ref={containerRef}>
      <div onClick={handleOpen} className="h-full">
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

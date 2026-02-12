import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { Icons } from "../icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  renderTrigger?: (option: SelectOption | undefined, isOpen: boolean) => React.ReactNode;
}

interface SelectOptionItemProps {
  option: SelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

const SelectOptionItem = ({ option, isSelected, onSelect }: SelectOptionItemProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(option.value);
      }}
      className={clsx(
        "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors",
        isSelected ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50",
      )}
    >
      <span>{option.label}</span>
      {isSelected && <Icons.Check className="h-4 w-4" />}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  renderTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => setIsOpen(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggle = useCallback(() => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={triggerRef} className={clsx("relative h-full", className)}>
      <div onClick={toggle} className="h-full cursor-pointer">
        {renderTrigger ? (
          renderTrigger(selectedOption, isOpen)
        ) : (
          <div className="flex h-full w-full items-center px-2 text-sm outline-none">
            <span className="truncate">{selectedOption?.label || value || placeholder}</span>
          </div>
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 flex flex-col rounded-lg border border-gray-200 bg-white py-1 shadow-lg min-w-[180px]"
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            {options.map((option) => (
              <SelectOptionItem
                key={option.value}
                option={option}
                isSelected={value === option.value}
                onSelect={handleSelect}
              />
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

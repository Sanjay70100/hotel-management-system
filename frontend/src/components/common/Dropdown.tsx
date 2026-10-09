import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import "./Dropdown.css";

export interface DropdownOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  icon?: ReactNode;
}

interface DropdownProps {
  trigger: ReactNode;
  options: DropdownOption[];
  align?: "left" | "right";
  className?: string;
}

const Dropdown = ({
  trigger,
  options,
  align = "right",
  className = "",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) {
      return;
    }

    option.onClick();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={dropdownRef}
      className={[
        "app-dropdown",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        ref={triggerRef}
        type="button"
        className="app-dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        {trigger}

        <span
          className={[
            "app-dropdown-arrow",
            isOpen ? "app-dropdown-arrow-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className={`app-dropdown-menu app-dropdown-${align}`}
          role="menu"
        >
          {options.map((option, index) => (
            <button
              key={`${option.label}-${index}`}
              type="button"
              role="menuitem"
              disabled={option.disabled}
              className={[
                "app-dropdown-item",
                option.danger ? "app-dropdown-item-danger" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleOptionClick(option)}
            >
              {option.icon && (
                <span
                  className="app-dropdown-item-icon"
                  aria-hidden="true"
                >
                  {option.icon}
                </span>
              )}

              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
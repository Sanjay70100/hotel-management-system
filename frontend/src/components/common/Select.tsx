import { useId, type SelectHTMLAttributes, type ChangeEvent } from "react";

import "./Select.css";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "onChange"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Select = ({
  label,
  options,
  error,
  helperText,
  placeholder = "Select an option",
  id,
  className = "",
  required,
  value,
  onChange,
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const describedBy =
    [
      helperText ? helperId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="form-select-group">
      {label && (
        <label
          htmlFor={selectId}
          className="form-select-label"
        >
          {label}

          {required && (
            <span className="form-select-required"> *</span>
          )}
        </label>
      )}

      <select
        {...props}
        id={selectId}
        value={value}
        onChange={handleChange}
        required={required}
        className={[
          "form-select",
          error ? "form-select-error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helperText && !error && (
        <p
          id={helperId}
          className="form-select-helper"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="form-select-error-text"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
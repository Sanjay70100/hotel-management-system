import { useId, type SelectHTMLAttributes } from "react";

import "./Select.css";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
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

  return (
    <div className="form-select-group">
      <label
        htmlFor={selectId}
        className="form-select-label"
      >
        {label}

        {required && (
          <span className="form-select-required"> *</span>
        )}
      </label>

      <select
        {...props}
        id={selectId}
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
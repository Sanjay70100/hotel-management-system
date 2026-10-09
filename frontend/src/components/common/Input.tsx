import {
  useId,
  type InputHTMLAttributes,
} from "react";

import "./Input.css";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input = ({
  label,
  error,
  helperText,
  id,
  className = "",
  required,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    helperText ? helperId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="form-input-group">
      <label
        className="form-input-label"
        htmlFor={inputId}
      >
        {label}

        {required && (
          <span className="form-input-required"> *</span>
        )}
      </label>

      <input
        {...props}
        id={inputId}
        required={required}
        className={[
          "form-input",
          error ? "form-input-error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />

      {helperText && !error && (
        <p
          className="form-input-helper"
          id={helperId}
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          className="form-input-error-text"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
import {
  useId,
  type TextareaHTMLAttributes,
} from "react";

import "./Textarea.css";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const Textarea = ({
  label,
  error,
  helperText,
  id,
  className = "",
  required,
  rows = 4,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const describedBy =
    [
      helperText ? helperId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="form-textarea-group">
      <label
        className="form-textarea-label"
        htmlFor={textareaId}
      >
        {label}

        {required && (
          <span className="form-textarea-required"> *</span>
        )}
      </label>

      <textarea
        {...props}
        id={textareaId}
        rows={rows}
        required={required}
        className={[
          "form-textarea",
          error ? "form-textarea-error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />

      {helperText && !error && (
        <p
          id={helperId}
          className="form-textarea-helper"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="form-textarea-error-text"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
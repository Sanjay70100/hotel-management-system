import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

type ButtonSize = "small" | "medium" | "large";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    "app-button",
    `app-button-${variant}`,
    `app-button-${size}`,
    fullWidth ? "app-button-full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && (
        <span
          className="app-button-spinner"
          aria-hidden="true"
        />
      )}

      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
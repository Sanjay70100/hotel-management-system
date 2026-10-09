import { useEffect } from "react";

import "./Alert.css";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  title?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const alertIcons: Record<AlertType, string> = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

const defaultTitles: Record<AlertType, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Information",
};

const Alert = ({
  type,
  message,
  title,
  onClose,
  autoClose = false,
  duration = 4000,
}: AlertProps) => {
  useEffect(() => {
    if (!autoClose || !onClose) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoClose, duration, onClose]);

  return (
    <div
      className={`app-alert app-alert-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span
        className="app-alert-icon"
        aria-hidden="true"
      >
        {alertIcons[type]}
      </span>

      <div className="app-alert-content">
        <strong className="app-alert-title">
          {title ?? defaultTitles[type]}
        </strong>

        <p className="app-alert-message">
          {message}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          className="app-alert-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
import "./ErrorMessage.css";
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage = ({
  message,
  onRetry,
  onDismiss,
}: ErrorMessageProps) => {
  return (
    <div
      className="error-message"
      role="alert"
      aria-live="assertive"
    >
      <div className="error-message-content">
        <span className="error-icon" aria-hidden="true">
          ⚠
        </span>

        <div className="error-text">
          <strong>Something went wrong</strong>
          <p>{message}</p>
        </div>
      </div>

      <div className="error-actions">
        {onRetry && (
          <button
            type="button"
            className="error-retry-button"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            className="error-dismiss-button"
            onClick={onDismiss}
            aria-label="Dismiss error message"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
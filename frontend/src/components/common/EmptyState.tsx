import "./EmptyState.css";

interface EmptyStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title = "No Data Found",
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        📂
      </div>

      <h2 className="empty-state-title">{title}</h2>

      <p className="empty-state-message">{message}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-state-button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
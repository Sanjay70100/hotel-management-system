import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PageHeader = ({
  title,
  description,
  actionLabel,
  onAction,
}: PageHeaderProps) => {
  return (
    <header className="page-header">
      <div className="page-header-content">
        <h1 className="page-header-title">{title}</h1>

        {description && (
          <p className="page-header-description">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="page-header-action"
          onClick={onAction}
        >
          <span aria-hidden="true">+</span>
          {actionLabel}
        </button>
      )}
    </header>
  );
};

export default PageHeader;
import type { ReactNode } from "react";

import "./Card.css";

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerAction?: ReactNode;
  padding?: "small" | "medium" | "large";
  onClick?: () => void;
}

const Card = ({
  children,
  title,
  description,
  className = "",
  headerAction,
  padding = "medium",
  onClick,
}: CardProps) => {
  const cardClasses = [
    "app-card",
    `app-card-padding-${padding}`,
    onClick ? "app-card-clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={cardClasses}
      onClick={onClick}
    >
      {(title || description || headerAction) && (
        <header className="app-card-header">
          <div className="app-card-heading">
            {title && (
              <h2 className="app-card-title">
                {title}
              </h2>
            )}

            {description && (
              <p className="app-card-description">
                {description}
              </p>
            )}
          </div>

          {headerAction && (
            <div className="app-card-header-action">
              {headerAction}
            </div>
          )}
        </header>
      )}

      <div className="app-card-body">
        {children}
      </div>
    </section>
  );
};

export default Card;
import type { ReactNode } from "react";

import "./StatCard.css";

type StatCardColor = "red" | "blue" | "green" | "orange" | "purple";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  color?: StatCardColor;
  trend?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  color = "red",
  trend,
  onClick,
}: StatCardProps) => {
  return (
    <article
      className={[
        "stat-card",
        `stat-card-${color}`,
        onClick ? "stat-card-clickable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="stat-card-top">
        <div className="stat-card-heading">
          <h3 className="stat-card-title">
            {title}
          </h3>

          <p className="stat-card-value">
            {value}
          </p>
        </div>

        <div className="stat-card-icon" aria-hidden="true">
          {icon}
        </div>
      </div>

      {(description || trend) && (
        <div className="stat-card-footer">
          {trend && (
            <span
              className={[
                "stat-card-trend",
                trend.positive === false
                  ? "stat-card-trend-negative"
                  : "stat-card-trend-positive",
              ].join(" ")}
            >
              {trend.positive === false ? "↓" : "↑"}{" "}
              {Math.abs(trend.value)}%
            </span>
          )}

          {description && (
            <p className="stat-card-description">
              {description}
            </p>
          )}

          {trend?.label && (
            <span className="stat-card-trend-label">
              {trend.label}
            </span>
          )}
        </div>
      )}

      {onClick && (
        <button
          type="button"
          className="stat-card-action"
          onClick={onClick}
          aria-label={`View ${title}`}
        >
          View details →
        </button>
      )}
    </article>
  );
};

export default StatCard;
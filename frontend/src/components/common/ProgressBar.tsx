import "./ProgressBar.css";

type ProgressBarSize = "small" | "medium" | "large";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: ProgressBarSize;
  color?: string;
  animated?: boolean;
}

const ProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "medium",
  color = "#dc2626",
  animated = false,
}: ProgressBarProps) => {
  const safeMax = max > 0 ? max : 100;

  const percentage = Math.min(
    100,
    Math.max(0, (value / safeMax) * 100)
  );

  const displayPercentage = Math.round(percentage);

  return (
    <div className="app-progress">
      {(label || showPercentage) && (
        <div className="app-progress-header">
          {label && (
            <span className="app-progress-label">
              {label}
            </span>
          )}

          {showPercentage && (
            <span className="app-progress-value">
              {displayPercentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={`app-progress-track app-progress-${size}`}
        role="progressbar"
        aria-label={label || "Progress"}
        aria-valuenow={displayPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={[
            "app-progress-fill",
            animated ? "app-progress-animated" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
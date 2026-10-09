import {
  useId,
  type ReactNode,
} from "react";

import "./Tooltip.css";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: TooltipPosition;
  disabled?: boolean;
}

const Tooltip = ({
  children,
  content,
  position = "top",
  disabled = false,
}: TooltipProps) => {
  const generatedId = useId();

  if (disabled || !content.trim()) {
    return <>{children}</>;
  }

  return (
    <span className="app-tooltip-wrapper">
      <span
        className="app-tooltip-trigger"
        aria-describedby={generatedId}
      >
        {children}
      </span>

      <span
        id={generatedId}
        className={`app-tooltip app-tooltip-${position}`}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
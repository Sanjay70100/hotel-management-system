import "./StatusBadge.css";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const statusClass = normalizedStatus.replace(
    /[^a-z0-9_]/g,
    ""
  );

  const displayStatus = normalizedStatus
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  return (
    <span
      className={`status-badge status-${statusClass}`}
      role="status"
    >
      {displayStatus}
    </span>
  );
};

export default StatusBadge;
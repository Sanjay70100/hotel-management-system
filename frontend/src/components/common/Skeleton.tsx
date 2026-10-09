import "./Skeleton.css";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
  count?: number;
  className?: string;
}

const Skeleton = ({
  width,
  height,
  variant = "rectangular",
  count = 1,
  className = "",
}: SkeletonProps) => {
  const skeletons = Array.from(
    { length: Math.max(1, count) },
    (_, index) => index
  );

  return (
    <>
      {skeletons.map((index) => (
        <span
          key={index}
          className={`skeleton skeleton-${variant} ${className}`}
          style={{
            width: width ?? (variant === "text" ? "100%" : 120),
            height:
              height ??
              (variant === "text"
                ? "1em"
                : variant === "circular"
                  ? width ?? 40
                  : 80),
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default Skeleton;
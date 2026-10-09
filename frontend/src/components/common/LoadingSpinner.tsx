import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  fullscreen?: boolean;
}

const LoadingSpinner = ({
  message = "Loading...",
  fullScreen = false,
  fullscreen = false,
}: LoadingSpinnerProps) => {
  const isFullScreen = fullScreen || fullscreen;

  return (
    <div
      className={`loading-container ${
        isFullScreen ? "loading-fullscreen" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner" aria-hidden="true" />

      <p className="loading-message">{message}</p>

      <span className="sr-only">Please wait</span>
    </div>
  );
};

export default LoadingSpinner;
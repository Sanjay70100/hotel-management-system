import { useEffect, type ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "small" | "medium" | "large";
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  size = "medium",
  closeOnOverlayClick = true,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          closeOnOverlayClick &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        className={`modal-content modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </header>

        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
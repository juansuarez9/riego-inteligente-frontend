import { createPortal } from "react-dom";

function FocusPortal({ title, onClose, children }) {
  return createPortal(
    <div
      className="focus-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="focus-overlay__content glass-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="focus-overlay__close"
          onClick={onClose}
          aria-label="Cerrar vista ampliada"
        >
          ×
        </button>
        {title && <h3 className="focus-overlay__title">{title}</h3>}
        <div className="focus-overlay__body">{children}</div>
        <p className="focus-overlay__hint">
          Clic fuera, botón × o tecla Esc para volver
        </p>
      </div>
    </div>,
    document.body
  );
}

export default FocusPortal;

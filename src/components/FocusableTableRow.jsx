import { useLongHover } from "../hooks/useLongHover";
import FocusPortal from "./FocusPortal";

const FIELD_LABELS = {
  fecha: "Fecha",
  hora: "Hora",
  soilMoisture: "Humedad suelo (%)",
  temperatureC: "Temperatura (°C)",
  airHumidity: "Humedad aire (%)",
  decision: "Estado",
};

function FocusableTableRow({ row, children }) {
  const {
    containerRef,
    isHovering,
    progress,
    focused,
    closeFocus,
    interactionHandlers,
  } = useLongHover();

  return (
    <>
      <tr
        ref={containerRef}
        className={`glass-hoverable-row focus-expandable ${isHovering ? "is-holding" : ""}`}
        style={{ "--hold-progress": `${progress}%` }}
        role="button"
        tabIndex={0}
        aria-label="Ver registro ampliado. Clic o mantener 5 segundos."
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            interactionHandlers.onClick(event);
          }
        }}
        {...interactionHandlers}
      >
        {children}
      </tr>

      {focused && (
        <FocusPortal title="Detalle del registro" onClose={closeFocus}>
          <dl className="row-focus-detail">
            {Object.entries(FIELD_LABELS).map(([key, label]) => (
              <div key={key} className="row-focus-detail__item">
                <dt>{label}</dt>
                <dd>{row[key] ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </FocusPortal>
      )}
    </>
  );
}

export default FocusableTableRow;

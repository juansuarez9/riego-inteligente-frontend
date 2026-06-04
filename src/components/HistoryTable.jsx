import { downloadTelemetryCsv } from "../utils/exportCsv";
import { formatDecision } from "../utils/formatDecision";
import GlassFocusWrap from "./GlassFocusWrap";
import FocusableTableRow from "./FocusableTableRow";

const TABLE_COLUMNS = [
  { key: "fecha", label: "Fecha" },
  { key: "hora", label: "Hora" },
  { key: "soilMoisture", label: "Humedad suelo (%)" },
  { key: "temperatureC", label: "Temperatura (°C)" },
  { key: "airHumidity", label: "Humedad aire (%)" },
  { key: "decision", label: "Estado" },
];

function HistoryTable({ history }) {
  const handleDownload = () => {
    downloadTelemetryCsv(history);
  };

  return (
    <GlassFocusWrap
      title="Historial de lecturas"
      className="panel table-panel glass-panel"
      focusClassName="focus-table"
    >
      <div className="table-toolbar">
        <h2>Historial de lecturas</h2>
        <button
          type="button"
          className="btn-download glass-btn"
          onClick={handleDownload}
          disabled={!history.length}
        >
          Descargar CSV
        </button>
      </div>

      {!history.length ? (
        <p className="section-empty">Los datos aparecerán aquí al recibir telemetría.</p>
      ) : (
        <div className="table-scroll glass-inset">
          <table className="data-table">
            <thead>
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((row, index) => (
                <FocusableTableRow key={`${row.fecha}-${row.hora}-${index}`} row={row}>
                  {TABLE_COLUMNS.map((col) => (
                    <td key={col.key}>
                      {col.key === "decision"
                        ? formatDecision(row[col.key])
                        : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </FocusableTableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {history.length > 0 && (
        <p className="table-footer">{history.length} registro(s) almacenados</p>
      )}
    </GlassFocusWrap>
  );
}

export default HistoryTable;

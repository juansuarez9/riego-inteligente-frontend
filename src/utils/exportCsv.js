import { formatDecision } from "./formatDecision";

const CSV_COLUMNS = [
  { key: "fecha", header: "Fecha" },
  { key: "hora", header: "Hora" },
  { key: "soilMoisture", header: "Humedad suelo (%)" },
  { key: "temperatureC", header: "Temperatura (°C)" },
  { key: "airHumidity", header: "Humedad aire (%)" },
  { key: "decision", header: "Estado" },
];

function escapeCsvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function downloadTelemetryCsv(rows, filename = "telemetria_riego.csv") {
  if (!rows.length) return;

  const headerLine = CSV_COLUMNS.map((c) => escapeCsvCell(c.header)).join(",");
  const bodyLines = rows.map((row) =>
    CSV_COLUMNS.map((c) =>
      escapeCsvCell(
        c.key === "decision" ? formatDecision(row[c.key]) : row[c.key]
      )
    ).join(",")
  );

  const csv = [headerLine, ...bodyLines].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export { CSV_COLUMNS };

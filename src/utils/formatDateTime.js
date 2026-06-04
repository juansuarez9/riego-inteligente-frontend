const TIME_ZONE = "America/Bogota";

function parseTimestamp(item) {
  if (!item?.timestamp) return null;
  const date = new Date(item.timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLastUpdate(item) {
  const date = parseTimestamp(item);
  if (date) {
    const fecha = date.toLocaleDateString("es-CO", { timeZone: TIME_ZONE });
    const hora = date.toLocaleTimeString("es-CO", {
      timeZone: TIME_ZONE,
      hour12: false,
    });
    return `${fecha} · ${hora}`;
  }
  if (item?.fecha && item?.hora) return `${item.fecha} · ${item.hora}`;
  return "—";
}

export function formatTimeLabel(item) {
  const date = parseTimestamp(item);
  if (date) {
    const fecha = date.toLocaleDateString("es-CO", { timeZone: TIME_ZONE });
    const hora = date.toLocaleTimeString("es-CO", {
      timeZone: TIME_ZONE,
      hour12: false,
    });
    return `${fecha} ${hora}`.trim();
  }
  return `${item?.fecha ?? ""} ${item?.hora ?? ""}`.trim();
}

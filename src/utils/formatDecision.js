const DECISION_LABELS = {
  riego_alto: "Riego alto",
  riego_medio: "Riego medio",
  riego_bajo: "Riego bajo",
  sin_riego: "Sin riego",
};

export function formatDecision(value) {
  if (value == null || value === "") return "—";

  const key = String(value).trim().toLowerCase();
  if (DECISION_LABELS[key]) return DECISION_LABELS[key];

  return key
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

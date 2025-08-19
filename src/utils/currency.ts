export function formatCLP(
  value: number,
  display: "symbol" | "code" = "code"
): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    currencyDisplay: display,
    maximumFractionDigits: 0,
  }).format(value);
}

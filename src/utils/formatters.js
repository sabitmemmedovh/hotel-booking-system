export function formatCurrency(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

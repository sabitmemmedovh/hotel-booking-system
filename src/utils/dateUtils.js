export function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(iso) {
  if (typeof iso !== 'string') return null;
  const parts = iso.split('-');
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(p => Number(p));
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  const date = new Date(y, m - 1, d);
  if (formatDate(date) !== iso) return null;
  return date;
}

export function generateDateRange(startDate, numDays) {
  const start = parseDate(startDate);
  const days = Number(numDays);
  if (!start || !Number.isInteger(days) || days <= 0) return [];
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const iso = formatDate(d);
    if (iso) dates.push(iso);
  }
  return dates;
}

export function formatHumanDate(isoOrDate) {
  if (!isoOrDate) return '—';
  let d = null;
  if (typeof isoOrDate === 'string') {
    d = parseDate(isoOrDate);
  } else if (isoOrDate instanceof Date) {
    d = isoOrDate;
  } else {
    const t = new Date(isoOrDate);
    if (!Number.isNaN(t.getTime())) d = t;
  }
  if (!d) return isoOrDate || '—';
  return d.toLocaleDateString();
}

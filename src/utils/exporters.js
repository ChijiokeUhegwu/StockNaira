/**
 * Client-side CSV export helpers for the StockNaira reporting views.
 * Uses a Blob + object URL download so no server round-trip is required.
 */

function escapeCell(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsv(headers, rows) {
  const headerLine = headers.map(escapeCell).join(',');
  const bodyLines = rows.map((row) => row.map(escapeCell).join(','));
  return [headerLine, ...bodyLines].join('\r\n');
}

export function downloadCsv(filename, headers, rows) {
  const csv = buildCsv(headers, rows);
  // Prepend a BOM so Excel opens the Naira symbol and accented text correctly.
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

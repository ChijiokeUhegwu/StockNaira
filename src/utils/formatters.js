/**
 * Formats a number as Nigerian Naira (₦) currency string
 * e.g., 245800 -> "₦245,800" or "₦245,800.00"
 */
export function formatNaira(amount, includeDecimals = false) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  const parsed = Number(amount);
  return '₦' + parsed.toLocaleString('en-NG', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
}

/**
 * Formats a compact Naira string e.g. 245800 -> "₦245.8k"
 */
export function formatCompactNaira(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  const parsed = Number(amount);
  if (parsed >= 1000000) {
    return `₦${(parsed / 1000000).toFixed(1)}M`;
  }
  if (parsed >= 1000) {
    return `₦${(parsed / 1000).toFixed(1)}k`;
  }
  return `₦${parsed.toLocaleString('en-NG')}`;
}

/**
 * Formats date string into Nigerian friendly format
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats relative time or time of day
 */
export function formatTime(timeString) {
  return timeString;
}

/**
 * Generate a randomized realistic NIP transaction reference
 */
export function generateNIPRef() {
  const prefix = 'NIP';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}/${timestamp}/${random}`;
}

/**
 * Indian Rupee and financial formatters for FinLit MOMENT
 */

export const formatINR = (val: number, options?: { hideSymbol?: boolean; compact?: boolean }): string => {
  const symbol = options?.hideSymbol ? '' : '₹';

  if (options?.compact) {
    if (Math.abs(val) >= 10000000) {
      return `${symbol}${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (Math.abs(val) >= 100000) {
      return `${symbol}${(val / 100000).toFixed(1).replace(/\.0$/, '')}L`;
    }
    if (Math.abs(val) >= 1000) {
      return `${symbol}${(val / 1000).toFixed(0)}k`;
    }
  }

  // Indian number system formatting (e.g., 18,42,600)
  const isNegative = val < 0;
  const absVal = Math.abs(Math.round(val));
  const valStr = absVal.toString();

  let formatted = '';
  if (valStr.length > 3) {
    const lastThree = valStr.substring(valStr.length - 3);
    const otherNumbers = valStr.substring(0, valStr.length - 3);
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  } else {
    formatted = valStr;
  }

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
};

export const formatPercent = (val: number, options?: { includeSign?: boolean }): string => {
  const sign = options?.includeSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
};

export const formatYears = (years: number): string => {
  if (years === 1) return '1 year';
  return `${years} years`;
};

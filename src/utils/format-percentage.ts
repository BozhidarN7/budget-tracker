'use client';

interface FormatPercentageOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const DEFAULT_OPTIONS: Required<FormatPercentageOptions> = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
};

export default function formatPercentage(
  value: number,
  options: FormatPercentageOptions = {},
): string {
  if (Number.isFinite(value) === false) {
    return '0%';
  }

  const { minimumFractionDigits, maximumFractionDigits } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const normalizedMaximum = Math.max(
    maximumFractionDigits,
    minimumFractionDigits,
  );

  return new Intl.NumberFormat(undefined, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: normalizedMaximum,
  }).format(value);
}

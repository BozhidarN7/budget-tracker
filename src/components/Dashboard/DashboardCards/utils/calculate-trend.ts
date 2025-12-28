import type { TrendTone } from '@/utils/get-tone-color-class';

type TrendDirectionPreference = 'increase' | 'decrease';

type TrendSummary = {
  direction: 'up' | 'down';
  tone: TrendTone;
  label: string;
};

export default function calculateTrend(
  current: number,
  previous: number,
  positiveDirection: TrendDirectionPreference,
): TrendSummary {
  const safeCurrent = Number.isFinite(current) ? current : 0;
  const safePrevious = Number.isFinite(previous) ? previous : 0;
  const difference = safeCurrent - safePrevious;

  const rawPercent =
    safePrevious === 0
      ? safeCurrent === 0
        ? 0
        : 100 * Math.sign(difference || safeCurrent)
      : (difference / Math.abs(safePrevious)) * 100;

  const sanitizedPercent = Number.isFinite(rawPercent) ? rawPercent : 0;
  const roundedPercent = Math.round(sanitizedPercent * 10) / 10;
  const normalizedPercent = Object.is(roundedPercent, -0) ? 0 : roundedPercent;

  const label =
    normalizedPercent === 0
      ? '0.0% from last month'
      : `${normalizedPercent > 0 ? '+' : '-'}${Math.abs(normalizedPercent).toFixed(1)}% from last month`;

  const direction: TrendSummary['direction'] = difference >= 0 ? 'up' : 'down';
  const tone: TrendTone =
    difference === 0
      ? 'neutral'
      : positiveDirection === 'increase'
        ? difference > 0
          ? 'positive'
          : 'negative'
        : difference < 0
          ? 'positive'
          : 'negative';

  return {
    direction,
    tone,
    label,
  };
}

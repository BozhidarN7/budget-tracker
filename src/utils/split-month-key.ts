import getCurrentMonthKey from './get-current-month-key';

export default function splitMonthKey(monthKey: string) {
  const [year, month] = monthKey
    .split('-')
    .map((value) => Number.parseInt(value, 10));

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return splitMonthKey(getCurrentMonthKey());
  }

  return { year, month };
}

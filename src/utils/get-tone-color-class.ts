export type TrendTone = 'positive' | 'negative' | 'neutral';

export default function getToneColorClass(tone: TrendTone): string {
  switch (tone) {
    case 'positive':
      return 'text-emerald-500';
    case 'negative':
      return 'text-rose-500';
    default:
      return 'text-muted-foreground';
  }
}

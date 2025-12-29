import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
};

export type FeatureHighlight = {
  description: string;
  icon: LucideIcon;
  points: string[];
  title: string;
};

export type WorkflowBeat = {
  accent: string;
  description: string;
  href: string;
  title: string;
};

export type DeepLink = {
  description: string;
  href: string;
  label: string;
};

export type TrustSignal = {
  detail: string;
  icon: LucideIcon;
  label: string;
};

export const navLinks: NavLink[] = [
  { label: 'Product', href: '#features' },
  { label: 'Workflows', href: '#workflows' },
  { label: 'Security', href: '#trust' },
  { label: 'Sign in', href: '/login' },
];

export const featureHighlights: FeatureHighlight[] = [
  {
    title: 'Live cash-flow cockpit',
    description:
      'See income, expenses, and savings for the month in one place.',
    icon: BarChart3,
    points: ['Monthly balance trend', 'Category details', 'Goal progress'],
  },
  {
    title: 'Limit guardians',
    description:
      'Set monthly limits, compare plan vs. actuals, and adjust quickly.',
    icon: Wallet,
    points: [
      'Custom categories',
      'Clear variance labels',
      'Light & dark friendly',
    ],
  },
  {
    title: 'Always-on insights',
    description:
      'Charts refresh whenever your numbers change, even on slower connections.',
    icon: Sparkles,
    points: [
      'Latest totals only',
      'Mobile-ready layouts',
      'Offline fallback data',
    ],
  },
];

export const workflowBeats: WorkflowBeat[] = [
  {
    title: 'Plan the month',
    description:
      'Create goals, set limits, and outline how you want to spend this month.',
    accent: 'Foundations',
    href: '/dashboard/goals',
  },
  {
    title: 'Track the day',
    description:
      'Add transactions, filter by type, and review activity in seconds.',
    accent: 'Daily flow',
    href: '/dashboard/transactions',
  },
  {
    title: 'Review the story',
    description:
      'Open the statistics view to compare months, ratios, and category trends.',
    accent: 'Insights',
    href: '/dashboard/statistics',
  },
];

export const deepLinks: DeepLink[] = [
  {
    label: 'Transactions HQ',
    description: 'Search, filter, and edit without reloading the page.',
    href: '/dashboard/transactions',
  },
  {
    label: 'Goals view',
    description: 'Visualize target trajectories and update progress in-line.',
    href: '/dashboard/goals',
  },
  {
    label: 'Categories studio',
    description: 'Color-code spending, assign limits, and rebalance caps fast.',
    href: '/dashboard/categories',
  },
  {
    label: 'Calendar map',
    description: 'Spot recurring charges or streaks at a glance.',
    href: '/dashboard/calendar',
  },
];

export const trustSignals: TrustSignal[] = [
  {
    label: 'Server-first auth',
    detail: 'Every session is confirmed before we show personal numbers.',
    icon: ShieldCheck,
  },
  {
    label: 'Refreshing data layer',
    detail: 'Totals refresh quickly whenever you add or edit data.',
    icon: TrendingUp,
  },
  {
    label: 'Dark & light native',
    detail:
      'Light and dark themes stay in sync on the marketing page and in the app.',
    icon: CalendarDays,
  },
];

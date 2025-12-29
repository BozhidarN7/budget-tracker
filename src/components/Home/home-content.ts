export type InterfaceSlide = {
  caption: string;
  icon: 'calendar' | 'dashboard' | 'goal' | 'transactions';
  metric: string;
  metricLabel: string;
  pill: string;
  title: string;
};

export type BeforeAfterMeta = {
  label: string;
  tagline: string;
};

export type BeforeAfterStat = {
  after: string;
  before: string;
  label: string;
};

export type Testimonial = {
  name: string;
  quote: string;
  role: string;
};

export type PartnerLogo = {
  label: string;
};

export type FaqEntry = {
  answer: string;
  question: string;
};

export const heroTickerMessages = [
  'Plan monthly limits in under 2 minutes',
  'Get reminders before overspending hits',
  'Compare goals and spending in one place',
];

export const interfaceSlides: InterfaceSlide[] = [
  {
    title: 'Unified dashboard',
    caption: 'Monthly overview with income, expenses, and savings in view.',
    icon: 'dashboard',
    pill: 'Overview',
    metric: '+18%',
    metricLabel: 'Month-over-month savings',
  },
  {
    title: 'Transaction review',
    caption: 'Search, filter, and edit entries without losing context.',
    icon: 'transactions',
    pill: 'Transactions',
    metric: '12s',
    metricLabel: 'Avg. edit speed',
  },
  {
    title: 'Calendar heatmap',
    caption: 'Spot recurring charges and streaks by day.',
    icon: 'calendar',
    pill: 'Calendar',
    metric: '5x',
    metricLabel: 'Faster pattern spotting',
  },
  {
    title: 'Goal tracking',
    caption: 'Monitor savings targets and adjust plans instantly.',
    icon: 'goal',
    pill: 'Goals',
    metric: '€4,200',
    metricLabel: 'Average progress per goal',
  },
];

export const beforeAfterMeta: {
  before: BeforeAfterMeta;
  after: BeforeAfterMeta;
} = {
  before: {
    label: 'Before Financemore',
    tagline: 'Manual spreadsheets and late surprises.',
  },
  after: {
    label: 'With Financemore',
    tagline: 'Real-time clarity and confident decisions.',
  },
};

export const beforeAfterStats: BeforeAfterStat[] = [
  {
    label: 'Budget visibility',
    before: 'Scattered tabs',
    after: 'Single dashboard',
  },
  {
    label: 'Limit alerts',
    before: 'Reactive surprises',
    after: 'Proactive reminders',
  },
  {
    label: 'Goal tracking',
    before: 'Monthly check-ins',
    after: 'Live progress',
  },
];

export const partnerLogos: PartnerLogo[] = [
  { label: 'Northwind Bank' },
  { label: 'Apex Ledger' },
  { label: 'Brightstone' },
  { label: 'Nimbus Pay' },
  { label: 'Vista Homes' },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Lina Kostova',
    role: 'Finance Lead, Arcadia Labs',
    quote:
      'Financemore is the first tool that helped our family see limits, goals, and daily spending without spreadsheets.',
  },
  {
    name: 'Marcus Reed',
    role: 'Product Manager, Northwind',
    quote:
      'The dashboard tells me exactly what changed this week. Limits and goals live in one place, finally.',
  },
  {
    name: 'Sara Ivanova',
    role: 'Founder, Bloom & Co',
    quote:
      'Calendar heatmaps expose recurring fees instantly. It saved us from duplicate subscriptions in the first month.',
  },
];

export const SHOW_TESTIMONIALS = false;

export const faqs: FaqEntry[] = [
  {
    question: 'Do I need to install anything?',
    answer:
      'No. Financemore runs in the browser, and updates appear automatically when you sign in.',
  },
  {
    question: 'How is my data secured?',
    answer:
      'Sessions are verified on the server before any dashboard data loads, and tokens stay inside HttpOnly cookies.',
  },
  {
    question: 'Is there a trial?',
    answer:
      'You can explore demo data immediately and connect your real account when you are ready.',
  },
];

export const ctaChecklist = [
  'Unlimited categories and goals',
  'Live sync across devices',
  'Offline-friendly mock data',
];

export const footerLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Status', href: '/status' },
  { label: 'Docs', href: '/docs' },
];

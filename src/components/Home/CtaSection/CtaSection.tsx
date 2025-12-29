import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import ThemePreviewButtons from './ThemePreviewButtons';
import { ctaChecklist } from '@/components/Home';

export default function CtaSection() {
  return (
    <section className="border-primary/30 from-primary/20 shadow-primary/20 dark:from-primary/30 rounded-3xl border bg-gradient-to-r via-transparent to-emerald-200/40 p-8 shadow-xl dark:to-emerald-400/30">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
              Ready when you are
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Step into the dashboard or drop directly into sign-in.
            </h2>
            <p className="text-muted-foreground">
              Returning members can jump straight to the dashboard. New visitors
              authenticate securely and reach the same experience instantly.
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            {ctaChecklist.map((item) => (
              <li
                key={item}
                className="text-muted-foreground flex items-center gap-2"
              >
                <span className="bg-primary h-2 w-2 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
            No credit card required.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground shadow-primary/40 ring-primary/30 hover:bg-primary/90 inline-flex min-w-[180px] flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold shadow-lg ring-1 transition hover:translate-y-0.5 dark:ring-white/15"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="border-foreground/30 text-foreground hover:border-primary hover:text-primary inline-flex min-w-[180px] flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3 text-base font-semibold transition"
            >
              Direct sign-in
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </div>
          <ThemePreviewButtons />
        </div>
      </div>
    </section>
  );
}

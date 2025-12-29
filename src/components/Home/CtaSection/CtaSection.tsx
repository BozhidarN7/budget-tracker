import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="border-primary/30 from-primary/20 shadow-primary/20 dark:from-primary/30 rounded-3xl border bg-gradient-to-r via-transparent to-emerald-200/40 p-8 shadow-xl dark:to-emerald-400/30">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            Ready when you are
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Step into the dashboard or drop directly into sign-in.
          </h2>
          <p className="text-muted-foreground">
            Returning members can jump straight to the dashboard. New visitors
            can authenticate securely and be routed to the same experience
            instantly.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="bg-primary text-primary-foreground shadow-primary/40 ring-primary/30 hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold shadow-lg ring-1 transition hover:translate-y-0.5 dark:ring-white/15"
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="border-foreground/30 text-foreground hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-6 py-3 text-base font-semibold transition"
          >
            Direct sign-in
            <ShieldCheck className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

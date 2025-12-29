import Link from 'next/link';
import { ArrowRight, Goal, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  const stats = [
    { label: 'Income', value: '€28,400', delta: '+18%' },
    { label: 'Expenses', value: '€15,920', delta: '-6%' },
  ];

  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-10">
        <div className="space-y-6">
          <p className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium">
            <span className="bg-primary inline-flex h-2 w-2 animate-pulse rounded-full" />
            Real-time budgeting cockpit
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Spend with confidence and understand what is left for the goals that
            matter.
          </h1>
          <p className="text-muted-foreground text-lg">
            Financemore keeps income, spending, and savings targets organized so
            you always know where money is going.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="group bg-primary text-primary-foreground shadow-primary/30 ring-primary/30 hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold shadow-lg ring-1 transition hover:translate-y-0.5 dark:ring-white/15"
          >
            Launch dashboard
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="border-foreground/20 text-foreground hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-6 py-3 text-base font-semibold transition"
          >
            Sign in securely
            <ShieldCheck className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition"
          >
            Explore features
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="from-primary/20 dark:from-primary/40 absolute inset-0 rounded-3xl bg-gradient-to-br via-transparent to-emerald-200/40 blur-2xl dark:to-emerald-400/20" />
        <div className="relative rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/5 dark:bg-black/60">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Live snapshot
            </p>
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              Synced
            </span>
          </div>
          <p className="mt-6 text-5xl font-semibold tracking-tight">€12,480</p>
          <p className="text-muted-foreground text-sm">
            Net balance • Nov 2025
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/30 bg-gradient-to-br from-white/40 to-white/10 p-4 shadow-inner shadow-white/10 transition hover:-translate-y-1 dark:from-white/5 dark:to-white/0"
              >
                <p className="text-muted-foreground text-sm">{item.label}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-primary text-xs font-medium">
                  {item.delta} vs last month
                </p>
              </div>
            ))}
          </div>

          <div className="border-primary/30 mt-8 flex items-center justify-between rounded-2xl border border-dashed px-4 py-3 text-sm">
            <div>
              <p className="font-semibold">Savings goal</p>
              <p className="text-muted-foreground">
                Home deposit • 64% complete
              </p>
            </div>
            <Goal className="text-primary h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

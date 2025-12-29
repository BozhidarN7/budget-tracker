import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TrustSignal } from '@/components/Home/home-data';
import { faqs } from '@/components/Home';

type TrustSectionProps = {
  signals: TrustSignal[];
};

export default function TrustSection({ signals }: TrustSectionProps) {
  return (
    <section id="trust" className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-3">
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            Peace of mind
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Financemore keeps private data private.
          </h2>
          <p className="text-muted-foreground">
            You sign in before seeing any numbers, changes sync quickly, and the
            interface respects your preferred theme everywhere.
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="border-foreground/20 hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition"
        >
          Open settings view
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {signals.map((signal) => {
          const Icon = signal.icon;
          return (
            <div
              key={signal.label}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/60 to-white/10 p-6 shadow-lg shadow-black/5 dark:from-white/5 dark:to-white/0"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{signal.label}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {signal.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-white/10 bg-white/70 p-4 shadow dark:bg-white/5"
          >
            <summary className="text-foreground cursor-pointer text-base font-semibold">
              {faq.question}
            </summary>
            <p className="text-muted-foreground mt-2 text-sm">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

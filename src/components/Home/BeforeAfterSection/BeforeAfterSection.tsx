'use client';

import { useState } from 'react';
import type { BeforeAfterMeta, BeforeAfterStat } from '@/components/Home';

type BeforeAfterSectionProps = {
  meta: {
    after: BeforeAfterMeta;
    before: BeforeAfterMeta;
  };
  stats: BeforeAfterStat[];
};

export default function BeforeAfterSection({
  meta,
  stats,
}: BeforeAfterSectionProps) {
  const [view, setView] = useState<'before' | 'after'>('after');
  const activeMeta = meta[view];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/90 p-8 shadow-xl shadow-black/5 backdrop-blur-xl dark:bg-black/60">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            Before vs after
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            See the clarity boost Financemore adds.
          </h2>
          <p className="text-muted-foreground">
            Switch views to compare how planning feels before and after
            onboarding.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/20 bg-white/60 p-1 text-sm font-semibold shadow-inner shadow-black/5 dark:bg-white/10">
          {(['before', 'after'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`min-w-[120px] flex-1 rounded-xl px-4 py-2 text-center transition ${
                view === key
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:bg-white/70 dark:hover:bg-white/5'
              }`}
            >
              {meta[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="border-primary/30 bg-primary/5 rounded-2xl border border-dashed p-6">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Current view
          </p>
          <p className="mt-2 text-2xl font-semibold">{activeMeta.label}</p>
          <p className="text-muted-foreground">{activeMeta.tagline}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/70 p-6 shadow-sm dark:bg-white/5">
          <p className="text-sm font-semibold">Confidence score</p>
          <p className="text-3xl font-semibold">
            {view === 'after' ? '92%' : '54%'}
          </p>
          <p className="text-muted-foreground text-xs">
            Based on goal progress and limit adherence.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/70 p-4 shadow-sm dark:bg-white/5"
          >
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">
              {view === 'after' ? stat.after : stat.before}
            </p>
            <p className="text-muted-foreground text-xs">
              {view === 'after' ? 'Financemore experience' : 'Manual process'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

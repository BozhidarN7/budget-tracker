'use client';

import { useState } from 'react';
import {
  CalendarClock,
  LayoutDashboard,
  ListChecks,
  Target,
} from 'lucide-react';
import type { InterfaceSlide } from '@/components/Home';

type InterfaceTourSectionProps = {
  slides: InterfaceSlide[];
};

const ICON_MAP = {
  calendar: CalendarClock,
  dashboard: LayoutDashboard,
  goal: Target,
  transactions: ListChecks,
} as const;

export default function InterfaceTourSection({
  slides,
}: InterfaceTourSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];
  if (!activeSlide) {
    return null;
  }
  const SlideIcon = ICON_MAP[activeSlide.icon] ?? LayoutDashboard;

  return (
    <section className="space-y-8 rounded-3xl border border-white/10 bg-white/80 p-8 shadow-xl shadow-black/5 backdrop-blur-xl dark:bg-black/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            Interface tour
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Preview the core surfaces in seconds.
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md text-sm">
          Tap through the sections to see how Financemore keeps dashboards,
          transactions, calendar, and goals aligned.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.55fr_1fr]">
        <div className="space-y-3">
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:border-primary/40 border-white/20 bg-transparent'
                }`}
              >
                <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                  {slide.pill}
                </p>
                <p className="text-lg font-semibold">{slide.title}</p>
                <p className="text-sm">{slide.caption}</p>
              </button>
            );
          })}
        </div>

        <div className="from-primary/10 dark:from-primary/20 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br via-transparent to-emerald-200/30 p-6 shadow-lg shadow-black/5 dark:to-emerald-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-primary rounded-full bg-white/70 p-2 shadow-sm dark:bg-white/10">
                <SlideIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                  {activeSlide.pill}
                </p>
                <p className="text-xl font-semibold">{activeSlide.title}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">{activeSlide.metric}</p>
              <p className="text-muted-foreground text-sm">
                {activeSlide.metricLabel}
              </p>
            </div>
          </div>

          <div className="border-primary/40 bg-background/70 shadow-primary/10 mt-6 rounded-2xl border border-dashed p-6 text-sm shadow-inner">
            <p className="text-muted-foreground font-medium">
              {activeSlide.caption}
            </p>
            <div className="text-muted-foreground mt-4 grid gap-3 text-xs sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/40 px-3 py-2 dark:bg-white/10">
                <p className="text-foreground font-semibold">Filters</p>
                <p>Type • Category • Range</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/40 px-3 py-2 dark:bg-white/10">
                <p className="text-foreground font-semibold">Actions</p>
                <p>Add • Edit • Duplicate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

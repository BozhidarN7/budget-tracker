'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import type { PartnerLogo, Testimonial } from '@/components/Home';

type TestimonialsSectionProps = {
  logos: PartnerLogo[];
  testimonials: Testimonial[];
};

const ROTATION_DELAY = 5000;

export default function TestimonialsSection({
  logos,
  testimonials,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex] ?? testimonials[0];

  useEffect(() => {
    if (testimonials.length <= 1) {
      return undefined;
    }

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, ROTATION_DELAY);

    return () => {
      clearInterval(id);
    };
  }, [testimonials.length]);

  return (
    <section className="space-y-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/90 to-white/60 p-8 shadow-xl shadow-black/5 dark:from-black/40 dark:to-black/60">
      <div className="flex flex-col gap-2">
        <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
          Feedback
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Teams already rely on Financemore.
        </h2>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-xs tracking-[0.3em] uppercase">
        {logos.map((logo) => (
          <span
            key={logo.label}
            className="rounded-full border border-white/30 px-3 py-1"
          >
            {logo.label}
          </span>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/80 p-8 shadow-lg shadow-black/5 dark:bg-white/5">
          <Quote className="text-primary h-10 w-10" />
          <p className="mt-6 text-lg leading-relaxed">“{active.quote}”</p>
          <div className="mt-6">
            <p className="text-base font-semibold">{active.name}</p>
            <p className="text-muted-foreground text-sm">{active.role}</p>
          </div>
        </div>

        <div className="space-y-3">
          {testimonials.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${item.name}-${item.role}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-primary/30 border-white/20'
                }`}
              >
                <p className="text-base font-semibold">{item.name}</p>
                <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
                  {item.role}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

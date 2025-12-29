import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { FeatureHighlight } from '@/components/Home/home-data';

type FeaturesSectionProps = {
  features: FeatureHighlight[];
};

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section id="features" className="space-y-10">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            Feature suite
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            A quick look at what Financemore helps you manage.
          </h2>
          <p className="text-muted-foreground">
            Each highlight reflects a screen inside the app, so you know exactly
            what you will work with after signing in.
          </p>
        </div>
        <Link
          href="/login"
          className="border-primary/40 text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition"
        >
          Jump to secure sign-in
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group hover:border-primary/30 rounded-3xl border border-white/10 bg-gradient-to-br from-white/70 to-white/20 p-6 shadow-lg shadow-black/5 transition hover:-translate-y-1 dark:from-white/5 dark:to-white/0"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {feature.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="text-muted-foreground flex items-center gap-2"
                  >
                    <span className="bg-primary/70 h-1.5 w-1.5 rounded-full" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

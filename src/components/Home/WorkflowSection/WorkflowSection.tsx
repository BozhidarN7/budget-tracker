import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { DeepLink, WorkflowBeat } from '@/components/Home/home-data';

type WorkflowSectionProps = {
  beats: WorkflowBeat[];
  links: DeepLink[];
};

export default function WorkflowSection({
  beats,
  links,
}: WorkflowSectionProps) {
  return (
    <section id="workflows" className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="from-primary/10 dark:from-primary/20 space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br via-transparent to-emerald-200/30 p-8 shadow-xl shadow-black/5 dark:to-emerald-400/20">
        <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
          Workflow map
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Choose where to start once you are signed in.
        </h2>
        <div className="space-y-6">
          {beats.map((beat) => (
            <Link
              key={beat.title}
              href={beat.href}
              className="group hover:border-primary/40 block rounded-2xl border border-white/20 bg-white/70 p-5 transition hover:-translate-y-1 hover:bg-white dark:bg-black/40"
            >
              <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold tracking-widest uppercase">
                <span>{beat.accent}</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
              <h3 className="mt-3 text-xl font-semibold">{beat.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {beat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-white/10 bg-white/90 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl dark:bg-black/60">
        <h2 className="text-2xl font-semibold">
          Quick links inside Financemore
        </h2>
        <div className="grid gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group hover:border-primary/40 flex flex-col rounded-2xl border border-white/30 px-4 py-3 transition"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{link.label}</p>
                <ArrowRight className="text-muted-foreground h-4 w-4 transition group-hover:translate-x-1" />
              </div>
              <p className="text-muted-foreground text-sm">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

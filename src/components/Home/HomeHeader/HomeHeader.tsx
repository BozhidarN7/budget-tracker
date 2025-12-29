import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import logo from '../../../../public/financemore.svg';
import type { NavLink } from '@/components/Home/home-data';
import ModeToggle from '@/components/ModeToggle/ModeToggle';

type HomeHeaderProps = {
  links: NavLink[];
};

export default function HomeHeader({ links }: HomeHeaderProps) {
  return (
    <header className="hover:border-primary/30 hover:shadow-primary/10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/70 px-6 py-4 shadow-xl shadow-black/5 backdrop-blur-xl transition dark:bg-black/40">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Financemore home"
        >
          <Image
            src={logo}
            alt="Financemore"
            className="h-auto w-full"
            fetchPriority="high"
          />{' '}
        </Link>
        <p className="text-muted-foreground text-sm">
          Personal budgeting companion.
        </p>
      </div>
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm font-medium">
        <nav className="flex flex-wrap items-center gap-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-primary/10 hover:text-foreground inline-flex items-center gap-1 rounded-full px-4 py-1.5 transition"
            >
              {item.label}
              {item.href.startsWith('#') ? null : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </Link>
          ))}
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}

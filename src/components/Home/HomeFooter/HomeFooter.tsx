import Link from 'next/link';
import { footerLinks } from '@/components/Home';

export default function HomeFooter() {
  return (
    <footer className="text-muted-foreground mt-12 rounded-3xl border border-white/10 bg-white/80 p-6 text-sm shadow-inner shadow-black/5 dark:bg-black/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Financemore. Built for clarity.</p>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  Menu,
  PieChart,
  Settings,
  Target,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Categories', href: '/categories', icon: PieChart },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div
        className={cn(
          'bg-background/80 fixed inset-0 z-30 backdrop-blur-sm transition-all md:hidden',
          isOpen ? 'block' : 'hidden',
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          'bg-background fixed inset-y-0 left-0 z-30 w-64 border-r transition-transform md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <PieChart className="h-6 w-6" />
            <span>Budget Tracker</span>
          </Link>
        </div>

        <div className="space-y-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

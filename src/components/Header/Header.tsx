'use client';

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ModeToggle from '@/components/ModeToggle';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="outline" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <div className={`${isSearchOpen ? 'flex' : 'hidden'} flex-1 md:flex`}>
          <form className="relative w-full md:max-w-sm">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="bg-background w-full pl-8 md:w-[300px]"
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

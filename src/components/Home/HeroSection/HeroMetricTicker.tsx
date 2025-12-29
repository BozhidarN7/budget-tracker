'use client';

import { useEffect, useMemo, useState } from 'react';
import { heroTickerMessages } from '@/components/Home';

const ROTATION_MS = 3500;

export default function HeroMetricTicker() {
  const messages = useMemo(() => heroTickerMessages, []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) {
      return undefined;
    }

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, ROTATION_MS);

    return () => {
      clearInterval(id);
    };
  }, [messages]);

  const content = messages[index] ?? '';

  return (
    <div className="border-primary/20 bg-primary/5 text-primary shadow-primary/20 relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium shadow-inner">
      <div className="grid h-5 place-items-start">
        <span
          className="block animate-[fadeSlide_0.35s_ease] text-left"
          key={content}
        >
          {content}
        </span>
      </div>
    </div>
  );
}

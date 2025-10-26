'use client';
import { useEffect, useEffectEvent, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  const onMounted = useEffectEvent(() => {
    setMounted(true);
  });
  // Only show he UI after hydration to prevent hydration mismatch
  useEffect(() => {
    onMounted();
  }, []);

  // If not mounted yet, render a placeholder with the same structure
  // to avoid layout shifts, but without any theme-specific styling
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

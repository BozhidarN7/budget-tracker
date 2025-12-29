'use client';

import { useTheme } from 'next-themes';

export default function ThemePreviewButtons() {
  const { setTheme } = useTheme();

  return (
    <div className="rounded-2xl border border-white/20 bg-white/60 p-3 text-sm shadow-inner shadow-black/5 dark:bg-white/10">
      <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
        Theme preview
      </p>
      <div className="mt-2 flex gap-2">
        {['light', 'dark'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setTheme(mode)}
            className="hover:border-primary hover:text-primary flex-1 rounded-full border border-white/40 px-3 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition"
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}

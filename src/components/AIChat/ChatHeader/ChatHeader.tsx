import { Bot, Plus, Sparkles } from 'lucide-react';

export default function ChatHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <div className="bg-background/80 border-border/60 inline-flex h-11 items-center gap-3 rounded-xl border px-4 text-sm shadow-sm backdrop-blur-sm">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 text-white">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold">Hybrid assistant</p>
          <p className="text-muted-foreground text-xs">Chat and actions</p>
        </div>
      </div>

      <div className="text-muted-foreground inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 px-3 py-2 text-xs font-medium">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Tool activity appears inline
      </div>

      <div className="text-muted-foreground inline-flex items-center gap-2 rounded-xl border border-dashed px-3 py-2 text-xs font-medium">
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        New chat clears the thread
      </div>
    </div>
  );
}

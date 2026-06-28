import {
  Bot,
  ChartColumnIncreasing,
  CircleDollarSign,
  Sparkles,
} from 'lucide-react';

type EmptyStateProps = {
  onSelectSuggestion: (prompt: string, action: 'prefill' | 'send') => void;
};

const EMPTY_STATE_SUGGESTIONS = [
  {
    label: 'Understand spending',
    prompt: 'Explain my current spending patterns in simple terms.',
    action: 'send' as const,
  },
  {
    label: 'Review category limits',
    prompt: 'Review my category limits and point out risk areas.',
    action: 'send' as const,
  },
  {
    label: 'Summarize savings progress',
    prompt: 'Summarize my savings progress and where I am falling behind.',
    action: 'send' as const,
  },
  {
    label: 'Add a transaction',
    prompt:
      'Help me add a transaction. Ask me for the amount, category, date, and description.',
    action: 'prefill' as const,
  },
];

export default function EmptyState({ onSelectSuggestion }: EmptyStateProps) {
  return (
    <div className="border-border/70 bg-muted/20 rounded-3xl border border-dashed p-6 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-sm">
            <Bot className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Budget-aware assistant
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Start with a finance question or an action request
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
              The assistant can help explain spending, review category pressure,
              summarize savings progress, and prepare budgeting actions with
              explicit inline execution updates.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="bg-background/80 rounded-2xl border p-4 shadow-sm">
            <ChartColumnIncreasing className="text-primary mb-3 h-5 w-5" />
            <p className="text-sm font-semibold">Analyze spending</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Ask what changed this month and which categories are driving it.
            </p>
          </div>

          <div className="bg-background/80 rounded-2xl border p-4 shadow-sm">
            <CircleDollarSign className="text-primary mb-3 h-5 w-5" />
            <p className="text-sm font-semibold">Check budget limits</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Review categories that are close to or over their monthly caps.
            </p>
          </div>

          <div className="bg-background/80 rounded-2xl border p-4 shadow-sm">
            <Bot className="text-primary mb-3 h-5 w-5" />
            <p className="text-sm font-semibold">Prepare actions</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Prefill guided prompts for tasks like adding a new transaction.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {EMPTY_STATE_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="bg-background hover:bg-accent hover:text-accent-foreground rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              onClick={() => onSelectSuggestion(item.prompt, item.action)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

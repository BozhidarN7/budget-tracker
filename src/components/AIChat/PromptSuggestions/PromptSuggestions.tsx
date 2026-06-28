import { Button } from '@/components/ui/button';

type PromptSuggestion = {
  label: string;
  prompt: string;
  action: 'prefill' | 'send';
};

type PromptSuggestionsProps = {
  items: PromptSuggestion[];
  onSelect: (prompt: string, action: 'prefill' | 'send') => void;
};

export default function PromptSuggestions({
  items,
  onSelect,
}: PromptSuggestionsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => (
        <Button
          key={item.label}
          type="button"
          variant="outline"
          size="sm"
          className="bg-background/80 border-border/70 shrink-0 rounded-full"
          onClick={() => onSelect(item.prompt, item.action)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

'use client';

import { ArrowUp, LoaderCircle, Square } from 'lucide-react';
import { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ComposerProps = {
  input: string;
  isStreaming: boolean;
  onChange: (value: string) => void;
  onStop: () => void;
  onSubmit: () => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
};

export default function Composer({
  input,
  isStreaming,
  onChange,
  onStop,
  onSubmit,
  status,
}: ComposerProps) {
  const isSubmitDisabled = input.trim().length === 0 || isStreaming;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      if (isSubmitDisabled === false) {
        onSubmit();
      }
    }
  };

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (isSubmitDisabled === false) {
          onSubmit();
        }
      }}
    >
      <label htmlFor="ai-chat-composer" className="sr-only">
        Ask about your budget, spending, goals, or request an action
      </label>

      <div className="bg-card border-border/70 relative flex-1 rounded-3xl border shadow-sm">
        <Textarea
          id="ai-chat-composer"
          value={input}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your budget, spending, goals, or request an action..."
          className="max-h-48 min-h-20 resize-none border-0 bg-transparent px-4 py-4 pr-14 text-sm shadow-none focus-visible:ring-0"
        />

        <Button
          type="submit"
          size="icon"
          className="absolute right-3 bottom-3 rounded-full"
          disabled={isSubmitDisabled}
          aria-label="Send message"
        >
          {status === 'submitted' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isStreaming ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onStop}
          aria-label="Stop response"
          className="mb-1 rounded-full"
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : null}
    </form>
  );
}

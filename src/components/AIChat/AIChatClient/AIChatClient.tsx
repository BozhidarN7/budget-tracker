'use client';

import { Bot, LoaderCircle, MessageSquarePlus } from 'lucide-react';
import Composer from '../Composer';
import EmptyState from '../EmptyState';
import MessageList from '../MessageList';
import PromptSuggestions from '../PromptSuggestions';
import { useAiChatClient } from './hooks';
import { Button } from '@/components/ui/button';

const PROMPT_SUGGESTIONS = [
  {
    label: 'Summarize this month',
    prompt: 'Summarize my spending this month and highlight the main drivers.',
    action: 'send' as const,
  },
  {
    label: 'Review category limits',
    prompt:
      'Review my category limits and tell me where I am close to overspending.',
    action: 'send' as const,
  },
  {
    label: 'Add expense',
    prompt:
      'Help me add an expense transaction with amount, category, date, and description.',
    action: 'prefill' as const,
  },
  {
    label: 'Check savings goal',
    prompt: 'Check my savings goal progress and explain what changed recently.',
    action: 'send' as const,
  },
  {
    label: 'Show unusual spending',
    prompt:
      'Show unusual spending patterns and explain which categories stand out.',
    action: 'send' as const,
  },
];

export default function AIChatClient() {
  const {
    confirmingMessageId,
    error,
    handleCancelPendingTransaction,
    handleConfirmPendingTransaction,
    handleNewChat,
    handleSubmit,
    handleSuggestion,
    input,
    isStreaming,
    normalizedMessages,
    scrollContainerRef,
    setInput,
    status,
    stop,
  } = useAiChatClient();

  return (
    <section
      aria-label="AI assistant conversation"
      className="bg-card flex h-[clamp(36rem,calc(100vh-22rem),52rem)] min-h-0 w-full flex-col"
    >
      <div className="flex flex-col gap-4 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Conversation</p>
            <p className="text-muted-foreground text-sm">
              Inline tool results and streaming responses stay visible in the
              transcript.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            aria-live="polite"
            className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium"
          >
            {isStreaming ? (
              <>
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Assistant is responding
              </>
            ) : (
              'Ready for a new request'
            )}
          </div>

          <Button variant="outline" size="sm" onClick={handleNewChat}>
            <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
            New chat
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        >
          {normalizedMessages.length === 0 ? (
            <div className="mx-auto w-full max-w-4xl space-y-6">
              <EmptyState onSelectSuggestion={handleSuggestion} />
              <PromptSuggestions
                items={PROMPT_SUGGESTIONS}
                onSelect={handleSuggestion}
              />
            </div>
          ) : (
            <MessageList
              confirmingMessageId={confirmingMessageId}
              messages={normalizedMessages}
              onCancelPendingTransaction={handleCancelPendingTransaction}
              onConfirmPendingTransaction={handleConfirmPendingTransaction}
              errorMessage={error?.message}
              isStreaming={isStreaming}
            />
          )}
        </div>

        <div className="bg-background/95 supports-backdrop-filter:bg-background/80 border-t px-4 py-4 backdrop-blur sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-3">
              <PromptSuggestions
                items={PROMPT_SUGGESTIONS}
                onSelect={handleSuggestion}
              />
            </div>

            <Composer
              input={input}
              isStreaming={isStreaming}
              onChange={setInput}
              onStop={stop}
              onSubmit={handleSubmit}
              status={status}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

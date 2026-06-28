import { Bot, User } from 'lucide-react';
import ToolEventCard from '../ToolEventCard';
import type {
  DisplayMessage,
  DisplayMessagePart,
} from '../utils/normalize-message';
import { cn } from '@/lib/utils';

type MessageItemProps = {
  message: DisplayMessage;
};

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <article
      aria-label={`${message.label} message`}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {isUser ? null : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-sm">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[min(100%,46rem)] space-y-3',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'rounded-2xl border px-4 py-3 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground border-primary/60 rounded-tr-md'
              : 'bg-muted/35 border-border/70 rounded-tl-md',
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-medium opacity-80">
            {isUser ? (
              <User className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {message.label}
          </div>

          <div className="space-y-3">
            {message.parts.map((part, index) => (
              <MessagePartRenderer key={`${message.id}-${index}`} part={part} />
            ))}
          </div>
        </div>
      </div>

      {isUser ? (
        <div className="bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
      ) : null}
    </article>
  );
}

function MessagePartRenderer({ part }: { part: DisplayMessagePart }) {
  if (part.kind === 'text') {
    return <p className="text-sm leading-6 whitespace-pre-wrap">{part.text}</p>;
  }

  if (part.kind === 'tool') {
    return <ToolEventCard part={part} />;
  }

  return (
    <div className="text-muted-foreground rounded-xl border border-dashed px-3 py-2 text-sm">
      {part.label}
    </div>
  );
}

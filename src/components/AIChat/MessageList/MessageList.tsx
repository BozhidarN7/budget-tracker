import { AlertCircle, LoaderCircle } from 'lucide-react';
import MessageItem from '../MessageItem';
import type { DisplayMessage } from '../utils/normalize-message';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type MessageListProps = {
  messages: DisplayMessage[];
  errorMessage?: string;
  isStreaming: boolean;
};

export default function MessageList({
  messages,
  errorMessage,
  isStreaming,
}: MessageListProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isStreaming ? (
        <div className="text-muted-foreground inline-flex items-center gap-2 px-1 text-sm">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Streaming latest response...
        </div>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive" className="border-destructive/40">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to complete the request</AlertTitle>
          <AlertDescription>
            <p>{errorMessage}</p>
            <p>
              Check the local chat runtime and try sending the request again.
            </p>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

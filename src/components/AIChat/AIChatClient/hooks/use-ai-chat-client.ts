import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DisplayMessage } from '../../utils/normalize-message';
import { normalizeMessages } from '../../utils/normalize-message';
import {
  type ChatMessage,
  type PendingTransactionPartUpdate,
  isNearBottom,
  isPendingCandidatePart,
  isUnresolvedStatus,
} from './use-ai-chat-client-helpers';
import { useBudgetContext } from '@/contexts/budget-context';

export function useAiChatClient() {
  const { messages, sendMessage, setMessages, status, stop, error } =
    useChat<ChatMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat',
      }),
    });
  const { addTransaction } = useBudgetContext();
  const [confirmingMessageId, setConfirmingMessageId] = useState<string | null>(
    null,
  );
  const [input, setInput] = useState('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const processedActionIdsRef = useRef<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const normalizedMessages = useMemo<DisplayMessage[]>(() => {
    return normalizeMessages(messages as UIMessage[]);
  }, [messages]);
  const isStreaming = status === 'submitted' || status === 'streaming';

  const latestPendingMessage = useMemo(() => {
    return [...normalizedMessages].reverse().find((message) => {
      return message.parts.some((part) => {
        return (
          part.kind === 'pending_transaction' && isUnresolvedStatus(part.status)
        );
      });
    });
  }, [normalizedMessages]);

  const updatePendingTransactionPart = useCallback(
    (messageId: string, update: PendingTransactionPartUpdate) => {
      setMessages((previousMessages) => {
        return previousMessages.map((message) => {
          if (message.id !== messageId) {
            return message;
          }

          return {
            ...message,
            parts: message.parts.map((part) => {
              if (!isPendingCandidatePart(part)) {
                return part;
              }

              return {
                ...part,
                data: {
                  ...part.data,
                  status: update.status,
                  ...(update.errorMessage
                    ? { errorMessage: update.errorMessage }
                    : { errorMessage: undefined }),
                },
              };
            }),
          };
        });
      });
    },
    [setMessages],
  );

  const appendAssistantMessage = useCallback(
    (text: string) => {
      setMessages((previousMessages) => {
        return [
          ...previousMessages,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text,
              },
            ],
          },
        ];
      });
    },
    [setMessages],
  );

  const handleCancelPendingTransaction = useCallback(
    (targetMessageId?: string, options?: { skipServerSync?: boolean }) => {
      const resolvedMessageId =
        targetMessageId ?? latestPendingMessage?.id ?? confirmingMessageId;

      if (!resolvedMessageId) {
        return;
      }

      if (!options?.skipServerSync) {
        sendMessage({ text: 'cancel' });

        return;
      }

      updatePendingTransactionPart(resolvedMessageId, {
        status: 'cancelled',
      });
      appendAssistantMessage('The pending transaction was cancelled.');
    },
    [
      appendAssistantMessage,
      confirmingMessageId,
      latestPendingMessage?.id,
      sendMessage,
      updatePendingTransactionPart,
    ],
  );

  const handleConfirmPendingTransaction = useCallback(
    async (messageId: string) => {
      if (confirmingMessageId === messageId) {
        return;
      }

      const pendingMessage = normalizedMessages.find(
        (message) => message.id === messageId,
      );
      const pendingPart = pendingMessage?.parts.find(
        (part) =>
          part.kind === 'pending_transaction' &&
          isUnresolvedStatus(part.status),
      );

      if (!pendingPart || pendingPart.kind !== 'pending_transaction') {
        return;
      }

      setConfirmingMessageId(messageId);

      try {
        await addTransaction(pendingPart.candidate);

        updatePendingTransactionPart(messageId, {
          status: 'confirmed',
        });
        appendAssistantMessage(
          `Transaction saved: ${pendingPart.candidate.description} for ${pendingPart.candidate.amount.toFixed(2)} ${pendingPart.candidate.currency} in ${pendingPart.candidate.category} on ${pendingPart.candidate.date}.`,
        );
      } catch (confirmError) {
        const message =
          confirmError instanceof Error
            ? confirmError.message
            : 'Failed to confirm transaction';

        updatePendingTransactionPart(messageId, {
          status: 'failed',
          errorMessage: message,
        });
        appendAssistantMessage(
          `The transaction could not be saved: ${message}`,
        );
      } finally {
        setConfirmingMessageId(null);
      }
    },
    [
      appendAssistantMessage,
      addTransaction,
      confirmingMessageId,
      normalizedMessages,
      updatePendingTransactionPart,
    ],
  );

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      setShouldAutoScroll(isNearBottom(scrollContainer));
    };

    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !shouldAutoScroll) {
      return;
    }

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    });
  }, [normalizedMessages, shouldAutoScroll]);

  useEffect(() => {
    const pendingActions = normalizedMessages.flatMap((message) => {
      return message.parts.flatMap((part) => {
        if (part.kind !== 'pending_transaction_action') {
          return [];
        }

        return [part];
      });
    });

    for (const action of pendingActions) {
      if (processedActionIdsRef.current.has(action.actionId)) {
        continue;
      }

      processedActionIdsRef.current.add(action.actionId);

      if (action.action === 'confirm') {
        void handleConfirmPendingTransaction(action.targetMessageId);
        continue;
      }

      handleCancelPendingTransaction(action.targetMessageId, {
        skipServerSync: true,
      });
    }
  }, [
    handleCancelPendingTransaction,
    handleConfirmPendingTransaction,
    normalizedMessages,
  ]);

  const handleSubmit = useCallback(() => {
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
      return;
    }

    setShouldAutoScroll(true);
    sendMessage({ text: trimmedInput });
    setInput('');
  }, [input, sendMessage]);

  const handleSuggestion = useCallback(
    (prompt: string, action: 'prefill' | 'send') => {
      if (action === 'prefill') {
        setInput(prompt);
        return;
      }

      setShouldAutoScroll(true);
      sendMessage({ text: prompt });
    },
    [sendMessage],
  );

  const handleNewChat = useCallback(() => {
    stop();
    setMessages([]);
    setInput('');
    setConfirmingMessageId(null);
    processedActionIdsRef.current.clear();
  }, [setMessages, stop]);

  return {
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
  };
}

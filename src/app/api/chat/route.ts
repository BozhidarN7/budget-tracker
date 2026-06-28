import { UIMessage, convertToModelMessages, streamText, tool } from 'ai';
import { ollama } from 'ai-sdk-ollama';
import z from 'zod';
import { createTransaction } from '@/api/budget-tracker-api/transactions';
import { API_BASE_URL } from '@/constants/api';
import { getTokensFromCookies } from '@/server/auth';

async function buildAuthHeaders() {
  const tokens = await getTokensFromCookies();
  if (!tokens?.idToken) {
    return null;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokens.idToken}`,
  };
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const tools = {
  addTransaction: tool({
    description:
      'Add new transaction. Use this tool when the user wants to add/create a new transaction',
    inputSchema: z.object({
      type: z.enum(['income', 'expense']),
      amount: z.number(),
      category: z
        .string()
        .describe('The category to which the transaction should belong'),
      date: z
        .string()
        .describe(
          'The date that the transaction occuer. Format is MMM d, yyyy',
        ),
      description: z
        .string()
        .describe('More information about the transaction'),
      currency: z.enum(['EUR', 'BGN', 'USD', 'GBP']),
    }),
    inputExamples: [
      {
        input: {
          type: 'expense',
          amount: 20,
          category: 'Food',
          date: 'Jun 16, 2026',
          description: 'Lidl',
          currency: 'EUR',
        },
      },
    ],
    execute: async (transaction) => {
      const headers = await buildAuthHeaders();
      if (!headers) {
        throw new Error('Unauthenticated');
      }

      try {
        const res = await fetch(`${API_BASE_URL}/transactions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(transaction),
        });

        const newTransaction = await res.json();
        return newTransaction;
      } catch (err) {
        throw err;
      }
    },
  }),
};

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: ollama('gemma4:e4b'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools,
  });

  return result.toUIMessageStreamResponse();
}

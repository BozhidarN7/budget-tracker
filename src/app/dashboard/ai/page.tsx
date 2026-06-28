import AIChatPage from '@/components/AIChat';
import ViewTransitionPage from '@/components/ViewTransitionPage';

export default function AIPage() {
  return (
    <ViewTransitionPage>
      <div className="flex min-h-0 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Ask about spending, budgets, goals, or let the assistant help with
            actions directly from your dashboard.
          </p>
        </div>

        <div className="min-h-0 flex-1">
          <AIChatPage />
        </div>
      </div>
    </ViewTransitionPage>
  );
}

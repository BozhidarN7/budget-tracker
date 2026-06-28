import AIChatClient from '../AIChatClient';
import ChatHeader from '../ChatHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIChatPage() {
  return (
    <Card className="border-border/70 flex h-full min-h-0 flex-1 flex-col overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-linear-to-r from-blue-500/8 via-cyan-500/5 to-transparent pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold">
              Assistant workspace
            </CardTitle>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Review spending patterns, inspect limits, and prepare actions with
              explicit inline execution feedback.
            </p>
          </div>

          <ChatHeader />
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 p-0">
        <AIChatClient />
      </CardContent>
    </Card>
  );
}

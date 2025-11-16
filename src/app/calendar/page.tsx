import { redirect } from 'next/navigation';
import ProtectedAppLayout from '@/components/ProtectedAppLayout';
import { getCurrentUser } from '@/utils/server-auth';
import CalendarView from '@/components/Calendar/CalendarView';

export default async function CalendarPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user, tokens } = result;

  return (
    <ProtectedAppLayout user={user} tokens={tokens}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          View your transactions by date to track your spending patterns over
          time.
        </p>
        <CalendarView />
      </div>
    </ProtectedAppLayout>
  );
}

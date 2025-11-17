import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/utils/server-auth';
import CalendarView from '@/components/Calendar/CalendarView';

export default async function CalendarPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <p className="text-muted-foreground">
        View your transactions by date to track your spending patterns over
        time.
      </p>
      <CalendarView />
    </div>
  );
}

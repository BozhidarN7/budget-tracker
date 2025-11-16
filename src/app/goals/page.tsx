import { redirect } from 'next/navigation';
import ProtectedAppLayout from '@/components/ProtectedAppLayout';
import { getCurrentUser } from '@/utils/server-auth';
import SavingsGoalCard from '@/components/Goals/SavingsGoalCard';
import AddGoalButton from '@/components/Goals/AddGoalButton';
import GoalsList from '@/components/Goals/GoalsList';

export default async function GoalsPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user, tokens } = result;

  return (
    <ProtectedAppLayout user={user} tokens={tokens}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <AddGoalButton />
        </div>

        <SavingsGoalCard />
        <GoalsList />
      </div>
    </ProtectedAppLayout>
  );
}

import SavingsGoalCard from '@/components/Goals/SavingsGoalCard';
import AddGoalButton from '@/components/Goals/AddGoalButton';
import GoalsList from '@/components/Goals/GoalsList';
import ViewTransitionPage from '@/components/ViewTransitionPage';

export default async function GoalsPage() {
  return (
    <ViewTransitionPage>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <AddGoalButton />
        </div>

        <SavingsGoalCard />
        <GoalsList />
      </div>
    </ViewTransitionPage>
  );
}

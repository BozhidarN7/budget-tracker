import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo } from 'react';
import {
  findMonthlyGoalForMonth,
  getGoalMonthKey,
  isMonthlyGoal,
} from './utils';
import type { Goal } from '@/types/budget';
import {
  formatMonthKeyToReadable,
  getCurrentMonthKey,
  getPreviousMonthKey,
} from '@/utils';

type MonthlyGoalsInput = {
  goals: Goal[];
  isLoading: boolean;
  selectedMonth: string;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
};

export const useMonthlyGoals = ({
  goals,
  isLoading,
  selectedMonth,
  addGoal,
}: MonthlyGoalsInput) => {
  const isUsingMockGoals = goals.length === 0;
  const actualMonthlyGoals = useMemo(() => {
    return goals.filter(isMonthlyGoal);
  }, [goals]);

  const monthlyGoalsForView = useMemo(() => {
    return goals.filter(isMonthlyGoal);
  }, [goals]);

  const monthlyGoalForSelectedMonth = useMemo(() => {
    return findMonthlyGoalForMonth(monthlyGoalsForView, selectedMonth) ?? null;
  }, [monthlyGoalsForView, selectedMonth]);

  const existingMonthlyGoalForSelectedMonth = useMemo(() => {
    return findMonthlyGoalForMonth(actualMonthlyGoals, selectedMonth) ?? null;
  }, [actualMonthlyGoals, selectedMonth]);

  const primaryGoal = monthlyGoalForSelectedMonth;
  const derivedTarget = primaryGoal
    ? (primaryGoal.displayTarget ?? primaryGoal.target ?? 0)
    : 0;
  const derivedCurrent = primaryGoal
    ? (primaryGoal.displayCurrent ?? primaryGoal.current ?? 0)
    : 0;
  const savingsProgress =
    derivedTarget > 0 ? (derivedCurrent / derivedTarget) * 100 : 0;

  const autoCreationPlan = useMemo(() => {
    const currentMonthKey = getCurrentMonthKey();

    if (
      isUsingMockGoals ||
      isLoading ||
      selectedMonth !== currentMonthKey ||
      existingMonthlyGoalForSelectedMonth
    ) {
      return null;
    }

    const previousMonthKey = getPreviousMonthKey(selectedMonth);
    const exactPreviousGoal = findMonthlyGoalForMonth(
      actualMonthlyGoals,
      previousMonthKey,
    );

    const fallbackPreviousGoal = actualMonthlyGoals
      .filter((goal) => getGoalMonthKey(goal) < selectedMonth)
      .sort((a, b) => getGoalMonthKey(b).localeCompare(getGoalMonthKey(a)))[0];

    const sourceGoal = exactPreviousGoal ?? fallbackPreviousGoal;

    if (!sourceGoal) {
      return null;
    }

    const targetAmount = sourceGoal.displayTarget ?? sourceGoal.target ?? 0;
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = Number.parseInt(yearStr, 10);
    const month = Number.parseInt(monthStr, 10);
    const targetDateLabel = format(new Date(year, month, 0), 'MMM d, yyyy');

    const goalPayload: Omit<Goal, 'id'> = {
      name: `Monthly Savings Goal - ${formatMonthKeyToReadable(selectedMonth)}`,
      target: targetAmount,
      current: 0,
      targetDate: targetDateLabel,
      description: sourceGoal.description ?? 'Monthly savings goal',
    };

    return {
      monthKey: selectedMonth,
      goal: goalPayload,
    };
  }, [
    actualMonthlyGoals,
    existingMonthlyGoalForSelectedMonth,
    isLoading,
    isUsingMockGoals,
    selectedMonth,
  ]);

  useQuery({
    queryKey: ['goals', 'auto-monthly', autoCreationPlan?.monthKey ?? 'idle'],
    queryFn: async () => {
      if (!autoCreationPlan) {
        return null;
      }
      await addGoal(autoCreationPlan.goal);
      return null;
    },
    enabled: Boolean(autoCreationPlan),
    retry: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    actualMonthlyGoals,
    derivedCurrent,
    derivedTarget,
    existingMonthlyGoalForSelectedMonth,
    monthlyGoalForSelectedMonth,
    monthlyGoalsForView,
    primaryGoal,
    savingsProgress,
  };
};

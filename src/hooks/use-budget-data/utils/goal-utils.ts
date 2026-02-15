import type { Goal } from '@/types/budget';
import { formatMonthKey, parseDate } from '@/utils';

const MONTHLY_GOAL_TOKEN = 'monthly';

export const isMonthlyGoal = (goal: Goal): boolean => {
  return goal.name.toLowerCase().includes(MONTHLY_GOAL_TOKEN);
};

export const getGoalMonthKey = (goal: Goal): string => {
  return formatMonthKey(parseDate(goal.targetDate));
};

export const findMonthlyGoalForMonth = (
  goals: Goal[],
  monthKey: string,
): Goal | undefined => {
  return goals.find((goal) => getGoalMonthKey(goal) === monthKey);
};

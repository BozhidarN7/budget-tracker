import type React from 'react';
import type { Goal } from '@/types/budget';
import {
  updateGoal as apiUpdateGoal,
  createGoal,
  deleteGoal,
} from '@/api/budget-tracker-api/goals';

// Create goal operations factory
export const createGoalOperations = (
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
  setError: (value: string | null) => void,
) => {
  // Add goal
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const newGoal = await createGoal(goal);
      setGoals((prev) => [...prev, newGoal]);
    } catch (err) {
      setError('Failed to add goal');
      throw err;
    }
  };

  // Update goal
  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    try {
      const updatedGoal = await apiUpdateGoal(id, goal);
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updatedGoal } : g)),
      );
    } catch (err) {
      setError('Failed to update goal');
      throw err;
    }
  };

  // Remove goal
  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError('Failed to delete goal');
      throw err;
    }
  };

  return {
    addGoal,
    updateGoal,
    removeGoal,
  };
};

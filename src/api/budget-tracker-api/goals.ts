import { Goal } from '@/types/budget';

export async function fetchGoals(): Promise<Goal[]> {
  try {
    const res = await fetch('/api/goals', {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('Error fetching goals:', await res.text());
      return [];
    }

    return (await res.json()) as Goal[];
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  try {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });

    if (!res.ok) {
      throw new Error(`Error creating goal: ${res.statusText}`);
    }

    return (await res.json()) as Goal;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
}

export async function updateGoal(
  id: string,
  goal: Partial<Goal>,
): Promise<Goal> {
  try {
    const res = await fetch(`/api/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });

    if (!res.ok) {
      throw new Error(`Error updating goal: ${res.statusText}`);
    }

    return (await res.json()) as Goal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
}

export async function deleteGoal(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/goals/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Error deleting goal: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

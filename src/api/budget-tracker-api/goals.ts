import { API_BASE_URL } from '@/constants/api';
import { Goal } from '@/types/budget';

export async function fetchGoals() {
  try {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch goals: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function createGoal(goal: Omit<Goal, 'id'>) {
  try {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create goal: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
}

export async function updateGoal(id: string, goal: Partial<Goal>) {
  try {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update goal: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
}

export async function deleteGoal(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete goal: ${response.status}`,
      );
    }

    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

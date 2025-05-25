import { makeAuthenticatedRequest } from './utils';
import { Goal } from '@/types/budget';
import { API_BASE_URL } from '@/constants/api';

export async function fetchGoals() {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/goals`);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function createGoal(goal: Omit<Goal, 'id'>) {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/goals`, {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
}

export async function updateGoal(id: string, goal: Partial<Goal>) {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
}

export async function deleteGoal(id: string) {
  try {
    await makeAuthenticatedRequest(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

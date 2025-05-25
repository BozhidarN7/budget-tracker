import { makeAuthenticatedRequest } from './utils';
import { Category } from '@/types/budget';
import { API_BASE_URL } from '@/constants/api';

export async function fetchCategories() {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/categorys`);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(category: Omit<Category, 'id'>) {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/categorys`, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, category: Partial<Category>) {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/categorys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    await makeAuthenticatedRequest(`${API_BASE_URL}/categorys/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

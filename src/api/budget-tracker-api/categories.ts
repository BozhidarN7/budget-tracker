import { API_BASE_URL } from '@/constants/api';
import { Category } from '@/types/budget';

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categorys`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch categories: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(category: Omit<Category, 'id'>) {
  try {
    const response = await fetch(`${API_BASE_URL}/categorys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create category: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, category: Partial<Category>) {
  try {
    const response = await fetch(`${API_BASE_URL}/categorys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update category: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/categorys/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete category: ${response.status}`,
      );
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

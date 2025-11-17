import { Category } from '@/types/budget';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('Error fetching categories:', await res.text());
      return [];
    }

    return (await res.json()) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(
  category: Omit<Category, 'id'>,
): Promise<Category> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!res.ok) {
      throw new Error(`Error creating category: ${res.statusText}`);
    }

    return (await res.json()) as Category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  category: Partial<Category>,
): Promise<Category> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!res.ok) {
      throw new Error(`Error updating category: ${res.statusText}`);
    }

    return (await res.json()) as Category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Error deleting category: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

import type React from 'react';
import type { Category } from '@/types/budget';
import {
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory,
} from '@/api/budget-tracker-api/categories';
import { getCurrentMonthKey } from '@/utils';

// Create category operations factory
export const createCategoryOperations = (
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
  setError: (value: string | null) => void,
  selectedMonth: string,
) => {
  // Add category
  const addCategory = async (
    category: Omit<Category, 'id' | 'monthlyData'> & { limit?: number },
  ) => {
    try {
      const currentMonth = getCurrentMonthKey();
      const monthlyData = {
        [currentMonth]: {
          limit: category.limit || 0,
          spent: 0,
        },
      };

      const newCategory = await apiCreateCategory({
        name: category.name,
        color: category.color,
        type: category.type,
        monthlyData,
      });

      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      setError('Failed to add category');
      throw err;
    }
  };

  // Update category
  const updateCategory = async (
    id: string,
    category: Partial<Omit<Category, 'monthlyData'>> & { limit?: number },
  ) => {
    try {
      const existingCategory = categories.find((c) => c.id === id);
      if (!existingCategory) {
        throw new Error('Category not found');
      }

      const updatedData: Partial<Category & { limit?: number }> = {
        ...category,
      };

      // If limit is provided, update only the current month's limit
      if (category.limit !== undefined) {
        const currentMonth = selectedMonth;
        const monthlyData = { ...existingCategory.monthlyData };

        // Initialize month data if it doesn't exist
        if (!monthlyData[currentMonth]) {
          monthlyData[currentMonth] = {
            limit: 0,
            spent: 0,
          };
        }

        monthlyData[currentMonth] = {
          ...monthlyData[currentMonth],
          limit: category.limit,
        };

        updatedData.monthlyData = monthlyData;
        delete updatedData.limit; // Remove limit from the update object
      }

      const updatedCategory = await apiUpdateCategory(id, updatedData);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
      );
    } catch (err) {
      setError('Failed to update category');
      throw err;
    }
  };

  // Remove category
  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      throw err;
    }
  };

  return {
    addCategory,
    updateCategory,
    removeCategory,
  };
};

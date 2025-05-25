import { makeAuthenticatedRequest } from './utils';
import { API_BASE_URL } from '@/constants/api';

// User profile API functions (optional)
export async function fetchUserProfile() {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/user/profile`);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(profile: Record<string, unknown>) {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Health check function (useful for testing API connectivity)
export async function healthCheck() {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/health`);
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}

// Utility function to check if API is available
export async function isApiAvailable(): Promise<boolean> {
  try {
    await healthCheck();
    return true;
  } catch (_error) {
    return false;
  }
}

export const getPasswordStrength = (password: string) => {
  let strength = 0;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  ];

  strength = checks.filter(Boolean).length;

  if (strength <= 2)
    return { level: 'weak', color: 'text-red-500', bg: 'bg-red-500' };
  if (strength <= 3)
    return { level: 'fair', color: 'text-yellow-500', bg: 'bg-yellow-500' };
  if (strength <= 4)
    return { level: 'good', color: 'text-blue-500', bg: 'bg-blue-500' };
  return { level: 'strong', color: 'text-green-500', bg: 'bg-green-500' };
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  return null;
};

export const getUserFriendlyPasswordError = (errorMessage: string): string => {
  if (
    errorMessage.includes('Password does not meet requirements') ||
    errorMessage.includes('InvalidPasswordException')
  ) {
    return "Your password doesn't meet the security requirements. Please ensure it has at least 8 characters, including uppercase, lowercase, numbers, and special characters.";
  }

  if (
    errorMessage.includes('Invalid password format') ||
    errorMessage.includes('InvalidParameterException')
  ) {
    return 'Invalid password format. Please check the password requirements below.';
  }

  if (
    errorMessage.includes('Invalid session') ||
    errorMessage.includes('CodeMismatchException')
  ) {
    return 'Your session has expired. Please go back and sign in again.';
  }

  if (
    errorMessage.includes('Session expired') ||
    errorMessage.includes('ExpiredCodeException')
  ) {
    return 'Your session has expired. Please go back and sign in again.';
  }

  // Default fallback for unknown errors
  return 'Failed to set new password. Please try again or contact support if the problem persists.';
};

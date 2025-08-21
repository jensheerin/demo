/**
 * Customer data validation utilities
 */

export interface CustomerData {
  name?: string;
  email?: string;
  age?: number;
}

/**
 * Validates customer data and returns an array of validation errors
 * @param data The customer data to validate
 * @returns Array of validation error messages, empty if valid
 */
export const validateCustomerData = (data: CustomerData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email must be a valid email address');
  }
  
  if (data.age !== undefined && (typeof data.age !== 'number' || data.age < 0 || data.age > 150)) {
    errors.push('Age must be a valid number between 0 and 150');
  }
  
  return errors;
};
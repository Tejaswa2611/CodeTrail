// Error handling utilities for consistent error management across the app

export interface ErrorInfo {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

export class AppError extends Error {
  public readonly code?: string;
  public readonly field?: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    field?: string,
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.field = field;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, field);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode || 0);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
  }
}

// Error parsing utilities
export const parseError = (error: unknown): ErrorInfo => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      field: error.field,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

// Toast error helper
export const getErrorToastConfig = (error: unknown) => {
  const errorInfo = parseError(error);
  
  return {
    variant: "destructive" as const,
    title: getErrorTitle(errorInfo),
    description: errorInfo.message,
    duration: getErrorDuration(errorInfo),
  };
};

const getErrorTitle = (errorInfo: ErrorInfo): string => {
  switch (errorInfo.code) {
    case 'VALIDATION_ERROR':
      return 'Validation Error';
    case 'NETWORK_ERROR':
      return 'Network Error';
    case 'AUTH_ERROR':
      return 'Authentication Error';
    case 'AUTHORIZATION_ERROR':
      return 'Permission Error';
    case 'NOT_FOUND_ERROR':
      return 'Not Found';
    case 'SERVER_ERROR':
      return 'Server Error';
    default:
      return 'Error';
  }
};

const getErrorDuration = (errorInfo: ErrorInfo): number => {
  // Show critical errors longer
  if (errorInfo.statusCode && errorInfo.statusCode >= 500) {
    return 10000; // 10 seconds
  }
  
  if (errorInfo.code === 'NETWORK_ERROR') {
    return 8000; // 8 seconds
  }
  
  return 5000; // 5 seconds default
};

// Retry logic helper
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation or auth errors
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError || 
          error instanceof AuthorizationError) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Safe async operation wrapper
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  onError?: (error: unknown) => void
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.warn('Safe async operation failed:', error);
    onError?.(error);
    return fallback;
  }
};

// Environment-aware error logging
export const logError = (error: unknown, context?: string) => {
  const errorInfo = parseError(error);
  const logData = {
    ...errorInfo,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData);
  }

  // In production, you would send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to monitoring service
    // sendToMonitoring(logData);
  }

  // Store recent errors in localStorage for debugging
  try {
    const recentErrors = JSON.parse(localStorage.getItem('recentErrors') || '[]');
    recentErrors.push(logData);
    // Keep only last 20 errors
    const trimmedErrors = recentErrors.slice(-20);
    localStorage.setItem('recentErrors', JSON.stringify(trimmedErrors));
  } catch (storageError) {
    console.warn('Failed to store error in localStorage:', storageError);
  }
};

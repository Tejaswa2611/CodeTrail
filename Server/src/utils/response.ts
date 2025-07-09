import { ApiResponse } from '../types';

export class ResponseUtils {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }

  static validationError(errors: string[]): ApiResponse {
    return {
      success: false,
      message: 'Validation failed',
      error: errors.join(', '),
    };
  }
}

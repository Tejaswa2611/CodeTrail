import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest {
  user?: {
    userId: string;
    email: string;
  };
  body: any;
  cookies: any;
  headers: any;
  params: any;
  query: any;
  method: any;
  url: any;
  path: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

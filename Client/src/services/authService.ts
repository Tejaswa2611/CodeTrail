const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
    };
    error?: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

class AuthService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // This is the key - includes cookies automatically
            ...options,
        };

        try {
            console.log('Making API request to:', url);
            console.log('Request config:', config);
            console.log('Document cookies:', document.cookie); // Debug: Check if cookies exist
            
            const response = await fetch(url, config);
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);

            // Handle token expiration - server will handle this with cookies
            if (response.status === 401) {
                throw new Error('Authentication required. Please login again.');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse['data']>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        // No need to handle tokens - cookies are set automatically by the server
        return response as AuthResponse;
    }

    async login(credentials: LoginData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse['data']>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // No need to handle tokens - cookies are set automatically by the server
        return response as AuthResponse;
    }

    async logout(): Promise<void> {
        try {
            await this.request('/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        // Cookies are cleared by the server, no need to manage tokens
    }

    async getProfile(): Promise<ApiResponse<{ user: User }>> {
        console.log('🔍 Getting user profile...');
        try {
            const result = await this.request<{ user: User }>('/auth/profile');
            console.log('✅ Profile request successful:', result);
            return result;
        } catch (error) {
            console.log('❌ Profile request failed:', error);
            throw error;
        }
    }

    // Check authentication by trying to get profile
    // This works because cookies are automatically sent
    async isAuthenticated(): Promise<boolean> {
        try {
            const response = await this.getProfile();
            return response.success;
        } catch (error) {
            return false;
        }
    }
}

export const authService = new AuthService();

const API_BASE_URL = 'http://localhost:3000/api';

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
        accessToken: string;
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
    private accessToken: string | null = null;

    constructor() {
        // Load token from localStorage on initialization
        this.accessToken = localStorage.getItem('accessToken');
    }

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
            credentials: 'include', // Include cookies for refresh token
            ...options,
        };

        // Add authorization header if token exists
        if (this.accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${this.accessToken}`,
            };
        }

        try {
            console.log('Making API request to:', url);
            console.log('Request config:', config);
            
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

            // Handle token expiration
            if (response.status === 401 && data.message === 'Token expired') {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${this.accessToken}`,
                    };
                    const retryResponse = await fetch(url, config);
                    return retryResponse.json();
                } else {
                    // Refresh failed, logout user
                    this.logout();
                    throw new Error('Session expired. Please login again.');
                }
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

        if (response.success && response.data) {
            this.setAccessToken(response.data.accessToken);
        }

        return response as AuthResponse;
    }

    async login(credentials: LoginData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse['data']>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success && response.data) {
            this.setAccessToken(response.data.accessToken);
        }

        return response as AuthResponse;
    }

    async logout(): Promise<void> {
        try {
            await this.request('/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    }

    async refreshToken(): Promise<boolean> {
        try {
            const response = await this.request<{ accessToken: string }>('/auth/refresh-token', {
                method: 'POST',
            });

            if (response.success && response.data) {
                this.setAccessToken(response.data.accessToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        return false;
    }

    async getProfile(): Promise<ApiResponse<{ user: User }>> {
        return this.request<{ user: User }>('/auth/profile');
    }

    private setAccessToken(token: string): void {
        this.accessToken = token;
        localStorage.setItem('accessToken', token);
    }

    private clearTokens(): void {
        this.accessToken = null;
        localStorage.removeItem('accessToken');
    }

    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }
}

export const authService = new AuthService();

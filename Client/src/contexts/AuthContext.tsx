import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true so we don't redirect before checking auth
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const checkAuth = async () => {
      console.log('🔍 AuthContext: Checking authentication on app start...');
      dispatch({ type: 'AUTH_START' });
      try {
        // Since we're using cookies, try to get the profile directly
        console.log('🔍 AuthContext: Calling authService.getProfile()...');
        const response = await authService.getProfile();
        console.log('🔍 AuthContext: Profile response:', response);
        
        if (response.success && response.data) {
          console.log('✅ AuthContext: Authentication successful, user found:', response.data.user);
          dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        } else {
          console.log('❌ AuthContext: Authentication failed - no user data');
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.log('❌ AuthContext: Authentication error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName?: string
  ): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.register({ email, password, firstName, lastName });
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error || 'Registration failed' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

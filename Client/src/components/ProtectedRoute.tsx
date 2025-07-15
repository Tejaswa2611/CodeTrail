import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ ProtectedRoute: Authentication check timed out');
        setHasTimedOut(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Show loading state
  if (isLoading && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
          <p className="text-xs text-muted-foreground mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // If timed out or not authenticated, redirect to login
  if (hasTimedOut || !isAuthenticated) {
    console.log('🔄 ProtectedRoute: Redirecting to login', { hasTimedOut, isAuthenticated });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

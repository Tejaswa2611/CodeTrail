import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsLoader, AICoachLoader, SettingsLoader, DashboardLoader } from './MatrixPageLoader';

interface LoadingWrapperProps {
  children: React.ReactNode;
  loadingDuration?: number; // Duration in milliseconds
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ 
  children, 
  loadingDuration = 2000 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Reset loading state when location changes
    setIsLoading(true);
    setProgress(0);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15 + 5; // Random increment between 5-20
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 100);

    // Complete loading after specified duration
    const loadingTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        clearInterval(progressInterval);
      }, 300); // Brief delay to show 100% completion
    }, loadingDuration);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(progressInterval);
    };
  }, [location.pathname, loadingDuration]);

  // Get appropriate loader based on current path
  const getLoader = () => {
    const path = location.pathname;
    
    if (path.includes('/analytics')) {
      return <AnalyticsLoader progress={progress} />;
    } else if (path.includes('/ai-coach')) {
      return <AICoachLoader progress={progress} />;
    } else if (path.includes('/settings')) {
      return <SettingsLoader progress={progress} />;
    } else if (path.includes('/dashboard')) {
      return <DashboardLoader progress={progress} />;
    }
    
    // Default loader for other routes
    return <DashboardLoader progress={progress} />;
  };

  if (isLoading) {
    return getLoader();
  }

  return <>{children}</>;
};

export default LoadingWrapper;

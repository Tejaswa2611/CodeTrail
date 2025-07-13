import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  AnalyticsContentLoader, 
  AICoachContentLoader, 
  SettingsContentLoader, 
  DashboardContentLoader 
} from './MatrixContentLoader';
import { usePageContentLoading } from '@/hooks/useContentLoading';

interface ContentLoadingWrapperProps {
  children: React.ReactNode;
  loadingKey?: string;
  customLoader?: React.ComponentType<{ progress?: number; size?: 'sm' | 'md' | 'lg' }>;
  size?: 'sm' | 'md' | 'lg';
  autoTrigger?: boolean;
}

const ContentLoadingWrapper: React.FC<ContentLoadingWrapperProps> = ({
  children,
  loadingKey,
  customLoader: CustomLoader,
  size = 'md',
  autoTrigger = true
}) => {
  const location = useLocation();
  const { setPageLoading, isPageLoading, getPageProgress } = usePageContentLoading();

  // Determine the loading key and appropriate loader
  const getLoadingInfo = () => {
    const key = loadingKey || location.pathname;
    
    if (CustomLoader) {
      return { key, LoaderComponent: CustomLoader };
    }

    // Map paths to specific loaders
    if (key.includes('/analytics')) {
      return { key, LoaderComponent: AnalyticsContentLoader };
    } else if (key.includes('/ai-coach')) {
      return { key, LoaderComponent: AICoachContentLoader };
    } else if (key.includes('/settings')) {
      return { key, LoaderComponent: SettingsContentLoader };
    } else if (key.includes('/dashboard')) {
      return { key, LoaderComponent: DashboardContentLoader };
    } else {
      return { key, LoaderComponent: DashboardContentLoader }; // Default
    }
  };

  const { key, LoaderComponent } = getLoadingInfo();
  const isLoading = isPageLoading(key);
  const progress = getPageProgress(key);

  // Auto-trigger loading on route change
  useEffect(() => {
    if (autoTrigger) {
      setPageLoading(key, true);
    }
  }, [key, autoTrigger, setPageLoading]);

  // Manual trigger function that can be exposed
  const triggerLoading = () => setPageLoading(key, true);

  // If we want to expose the trigger function, we can use a ref or context
  // For now, we'll use auto-trigger on route changes

  if (isLoading) {
    return <LoaderComponent progress={progress} size={size} />;
  }

  return <>{children}</>;
};

export default ContentLoadingWrapper;

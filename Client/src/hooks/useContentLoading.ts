import { useState, useEffect } from 'react';

interface UseContentLoadingOptions {
  duration?: number;
  showProgress?: boolean;
  initialDelay?: number;
}

interface ContentLoadingState {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  stopLoading: () => void;
  setLoading: (loading: boolean) => void;
}

export const useContentLoading = (options: UseContentLoadingOptions = {}): ContentLoadingState => {
  const { duration = 2000, showProgress = true, initialDelay = 0 } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);

    if (showProgress) {
      // Simulate progress with realistic loading stages
      const progressSteps = [
        { progress: 15, delay: 200 },   // Initial connection
        { progress: 35, delay: 400 },   // Authentication
        { progress: 55, delay: 600 },   // Fetching data
        { progress: 75, delay: 800 },   // Processing
        { progress: 90, delay: 1200 },  // Finalizing
        { progress: 100, delay: duration }  // Complete
      ];

      progressSteps.forEach(({ progress: targetProgress, delay }) => {
        setTimeout(() => {
          setProgress(targetProgress);
          if (targetProgress === 100) {
            setTimeout(() => setIsLoading(false), 300);
          }
        }, delay + initialDelay);
      });
    } else {
      setTimeout(() => setIsLoading(false), duration + initialDelay);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(0);
  };

  const setLoading = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
    setLoading
  };
};

// Hook specifically for page navigation loading
export const usePageContentLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [progressStates, setProgressStates] = useState<Record<string, number>>({});

  const setPageLoading = (page: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [page]: loading }));
    
    if (loading) {
      setProgressStates(prev => ({ ...prev, [page]: 0 }));
      
      // Simulate progress for the specific page
      const progressSteps = [
        { progress: 20, delay: 200 },
        { progress: 45, delay: 500 },
        { progress: 70, delay: 800 },
        { progress: 95, delay: 1300 },
        { progress: 100, delay: 1800 }
      ];

      progressSteps.forEach(({ progress, delay }) => {
        setTimeout(() => {
          setProgressStates(prev => ({ ...prev, [page]: progress }));
          if (progress === 100) {
            setTimeout(() => {
              setLoadingStates(prev => ({ ...prev, [page]: false }));
            }, 200);
          }
        }, delay);
      });
    } else {
      setProgressStates(prev => ({ ...prev, [page]: 0 }));
    }
  };

  const isPageLoading = (page: string) => loadingStates[page] || false;
  const getPageProgress = (page: string) => progressStates[page] || 0;

  return {
    setPageLoading,
    isPageLoading,
    getPageProgress
  };
};

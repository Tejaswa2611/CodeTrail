import { useState, useCallback } from 'react';

interface UseMatrixLoadingOptions {
  duration?: number;
  onComplete?: () => void;
}

export const useMatrixLoading = (options: UseMatrixLoadingOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { duration = 2000, onComplete } = options;

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);

    // Simulate progressive loading
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 100);

    // Complete loading
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        clearInterval(progressInterval);
        if (onComplete) onComplete();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(0);
  }, []);

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading
  };
};

export default useMatrixLoading;

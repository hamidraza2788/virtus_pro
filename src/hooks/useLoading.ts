import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export const useLoading = (initialMessage?: string) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: initialMessage,
  });

  const startLoading = useCallback((message?: string) => {
    setLoadingState({
      isLoading: true,
      message: message || 'Loading...',
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
    });
  }, []);

  const setLoadingMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message,
    }));
  }, []);

  return {
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    startLoading,
    stopLoading,
    setLoadingMessage,
  };
};

export default useLoading;

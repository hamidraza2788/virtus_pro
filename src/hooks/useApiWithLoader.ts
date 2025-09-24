import { useCallback } from 'react';
import { useGlobalLoader } from '../contexts/LoaderContext';

interface ApiCallOptions {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const useApiWithLoader = () => {
  const { showLoader, hideLoader, setLoaderMessage } = useGlobalLoader();

  const executeApiCall = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      options: ApiCallOptions = {}
    ): Promise<T> => {
      const {
        loadingMessage = 'Loading...',
        successMessage,
        errorMessage = 'An error occurred',
      } = options;

      try {
        showLoader(loadingMessage);
        const result = await apiCall();
        
        if (successMessage) {
          setLoaderMessage(successMessage);
          // Keep loader visible for a moment to show success message
          setTimeout(() => {
            hideLoader();
          }, 1000);
        } else {
          hideLoader();
        }
        
        return result;
      } catch (error) {
        hideLoader();
        throw error;
      }
    },
    [showLoader, hideLoader, setLoaderMessage]
  );

  return {
    executeApiCall,
    showLoader,
    hideLoader,
    setLoaderMessage,
  };
};

export default useApiWithLoader;

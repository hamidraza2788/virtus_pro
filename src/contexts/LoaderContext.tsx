import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  setLoaderMessage: (message: string) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoader = (customMessage?: string) => {
    if (customMessage) {
      setMessage(customMessage);
    }
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const setLoaderMessage = (newMessage: string) => {
    setMessage(newMessage);
  };

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        message,
        showLoader,
        hideLoader,
        setLoaderMessage,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a LoaderProvider');
  }
  return context;
};

export default LoaderContext;

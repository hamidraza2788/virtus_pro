import React from 'react';
import { useGlobalLoader } from '../contexts/LoaderContext';
import Loader from './Loader';

const GlobalLoader: React.FC = () => {
  const { isLoading, message } = useGlobalLoader();

  return (
    <Loader
      visible={isLoading}
      message={message}
      overlay={true}
    />
  );
};

export default GlobalLoader;

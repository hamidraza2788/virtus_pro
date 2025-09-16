import React, { useEffect } from 'react';
import { useLanguageSync } from '../hooks/useLanguageSync';
import i18n from '../i18n';

// This component ensures i18n language is synced with Redux state on app startup
const LanguageSync: React.FC = () => {
  const currentLanguage = useLanguageSync();

  // Also sync when the language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('i18n language changed to:', lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default LanguageSync;

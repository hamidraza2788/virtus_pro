import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import i18n from '../i18n';

// Custom hook to sync i18n language with Redux state
export const useLanguageSync = () => {
  const { currentLanguage } = useAppSelector((state) => state.language);

  useEffect(() => {
    // Sync i18n language with Redux state
    if (currentLanguage && i18n.language !== currentLanguage.code) {
      console.log('Syncing i18n language to:', currentLanguage.code);
      i18n.changeLanguage(currentLanguage.code);
    }
  }, [currentLanguage]);

  return currentLanguage;
};

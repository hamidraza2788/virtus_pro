import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import it from './locales/it.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

// Language resources
const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
  de: {
    translation: de,
  },
  fr: {
    translation: fr,
  },
  pt: {
    translation: pt,
  },
  es: {
    translation: es,
  },
};

// Available languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // React Native specific options
    react: {
      useSuspense: false,
    },
  });

export default i18n;

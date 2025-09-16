import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '../../i18n';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageState {
  currentLanguage: Language;
  availableLanguages: Language[];
}

const initialState: LanguageState = {
  currentLanguage: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  availableLanguages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ],
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      // Change i18n language
      i18n.changeLanguage(action.payload.code);
    },
    setLanguageByCode: (state, action: PayloadAction<string>) => {
      const language = state.availableLanguages.find(
        lang => lang.code === action.payload
      );
      if (language) {
        state.currentLanguage = language;
        // Change i18n language
        i18n.changeLanguage(action.payload);
      }
    },
  },
});

export const { setLanguage, setLanguageByCode } = languageSlice.actions;
export default languageSlice.reducer;

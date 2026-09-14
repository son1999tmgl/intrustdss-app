import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';

export const defaultNS = 'common';
export const resources = {
  vi: { translation: vi },
  en: { translation: en },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'vi', // Ngôn ngữ mặc định
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
  });
}

export const changeLanguage = (lang: 'vi' | 'en'): Promise<any> => {
  return i18n.changeLanguage(lang);
};

export const getCurrentLanguage = (): string => {
  return i18n.language || 'vi';
};

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json';
import es from './locales/es/common.json';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: en },
        es: { common: es },
      },
      lng: 'es',
      fallbackLng: 'es',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
    });
}

export default i18n;

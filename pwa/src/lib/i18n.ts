import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from '../../public/locales/pl/translation.json';
import en from '../../public/locales/en/translation.json';

// Initialize with simple resources for now since we haven't created the JSON files yet
// Ideally we would use backend loader, but for PWA static checks, importing JSONs is safe.

i18n
    .use(initReactI18next)
    .init({
        resources: {
            pl: { translation: pl },
            en: { translation: en }
        },
        lng: 'pl', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

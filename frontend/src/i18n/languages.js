import en from './locales/en.json';
import kn from './locales/kn.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import gu from './locales/gu.json';
import ur from './locales/ur.json';

export const translations = {
  en,
  kn,
  hi,
  ta,
  te,
  ml,
  mr,
  bn,
  gu,
  ur
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', label: 'Urdu', native: 'اردو' }
];

export function getTranslation(lang, key) {
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  // Fallback to English dictionary
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  return key;
}

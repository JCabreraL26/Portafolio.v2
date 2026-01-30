import es from './es.json';
import en from './en.json';

const translations = {
  es,
  en
};

export type Locale = 'es' | 'en';

export function getTranslations(locale: Locale = 'es') {
  return translations[locale] || translations.es;
}

export function t(key: string, locale: Locale = 'es') {
  const keys = key.split('.');
  let value: any = getTranslations(locale);
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

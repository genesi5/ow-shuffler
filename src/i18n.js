import { createI18n } from 'vue-i18n/index'
// can't implement fucking lazyload, doesn't work. 
import { default as de } from './locales/de.json'
import { default as en } from './locales/en.json'
import { default as es } from './locales/es.json'
import { default as fr } from './locales/fr.json'
import { default as it } from './locales/it.json'
import { default as pl } from './locales/pl.json'
import { default as pt } from './locales/pt.json'
import { default as ru } from './locales/ru.json'

const messages = { de: de, en: en, es: es, fr: fr, it: it, pl: pl, pt: pt, ru: ru }

export const SUPPORT_LOCALES = ['de', 'en', 'es', 'fr', 'it', 'pl', 'pt', 'ru']

export default new function setupI18n(options = {
  locale: navigator.language.trim().split(/-|_/)[0],
  fallbackLocale: {
    'uk': ['ru'],
    'be': ['ru'],
    'default': ["en"]
  },
  legacy: true,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  messages
}) {
  const i18n = new createI18n(options)
  setI18nLanguage(i18n, options.locale)
  return i18n
}

export function setI18nLanguage(i18n, locale) {
  i18n.global.locale = locale
  document.querySelector('html').setAttribute('lang', locale)
}
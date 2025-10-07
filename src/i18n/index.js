/**
 * i18n/index.js - Configuración de internacionalización para NeuroZen
 * Maneja la carga asíncrona de traducciones y configuración de Vue i18n
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { createI18n } from 'vue-i18n';

/**
 * Carga los archivos de traducción desde la carpeta public
 * @async
 * @function loadLocaleMessages
 * @returns {Promise<Object>} Objeto con todas las traducciones por idioma
 */
async function loadLocaleMessages() {
  const locales = ['es', 'en'];
  const messages = {};
  
  for (const locale of locales) {
    try {
      const response = await fetch(`/${locale}.json`);
      messages[locale] = await response.json();
    } catch (error) {
      console.error(`Error loading locale ${locale}:`, error);
    }
  }
  
  return messages;
}

/**
 * Determina el idioma por defecto de la aplicación
 * Prioriza localStorage, luego el navegador, con fallback a español
 * @function getDefaultLocale
 * @returns {string} Código del idioma por defecto ('es' o 'en')
 */
function getDefaultLocale() {
  // Intentar obtener del localStorage primero
  const saved = localStorage.getItem('neurozen-locale');
  if (saved) return saved;
  
  // Luego del navegador
  const browserLang = navigator.language.split('-')[0];
  return ['es', 'en'].includes(browserLang) ? browserLang : 'es';
}

/**
 * Crea e inicializa la instancia de Vue i18n
 * @async
 * @function createI18nInstance
 * @returns {Promise<Object>} Instancia configurada de Vue i18n
 */
export async function createI18nInstance() {
  const messages = await loadLocaleMessages();
  const locale = getDefaultLocale();
  
  return createI18n({
    legacy: true,
    locale,
    fallbackLocale: 'es',
    messages,
    globalInjection: true
  });
}

/**
 * Cambia el idioma de la aplicación
 * Actualiza i18n, localStorage y el atributo lang del documento
 * @function setLocale
 * @param {Object} i18n - Instancia de Vue i18n
 * @param {string} locale - Código del nuevo idioma ('es' o 'en')
 */
export function setLocale(i18n, locale) {
  try {
    // Múltiples métodos para asegurar compatibilidad
    if (i18n.global?.locale?.value) {
      i18n.global.locale.value = locale;
    } else if (i18n.locale?.value) {
      i18n.locale.value = locale;
    } else if (i18n.global?.locale) {
      i18n.global.locale = locale;
    } else if (i18n.locale) {
      i18n.locale = locale;
    }
    
    // Persistir en localStorage
    localStorage.setItem('neurozen-locale', locale);
    
    // Actualizar atributo lang del documento
    document.documentElement.lang = locale;
    
    console.log('Locale set to:', locale);
    console.log('i18n instance:', i18n);
    
  } catch (error) {
    console.error('Error setting locale:', error);
  }
}

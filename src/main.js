/**
 * main.js - Punto de entrada principal de la aplicación NeuroZen
 * Configura Vue 3, Vue Router y Vue i18n antes de montar la aplicación
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/index.js'
import { createI18nInstance } from './i18n/index.js'

/**
 * Inicializa la aplicación Vue con todas sus dependencias
 * Configura i18n para internacionalización y router para navegación
 * @async
 * @function initApp
 * @throws {Error} Error si falla la inicialización de algún módulo
 */
async function initApp() {
  const app = createApp(App)
  
  // Configurar i18n
  const i18n = await createI18nInstance()
  app.use(i18n)
  
  // Configurar router
  app.use(router)
  
  // Montar la aplicación
  app.mount('#app')
}

// Inicializar la aplicación
initApp().catch(console.error)

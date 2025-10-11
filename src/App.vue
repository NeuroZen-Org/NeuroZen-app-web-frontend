<template>
  <div id="app">
    <!-- Header Global -->
    <HeaderComponent v-if="shouldShowHeader" />
    
    <!-- Contenido Principal -->
    <main class="main-content" :class="{ 'with-header': shouldShowHeader, 'with-footer': shouldShowFooter }">
      <router-view />
    </main>
    
    <!-- Footer Global -->
    <FooterComponent v-if="shouldShowFooter" />
  </div>
</template>

<script>
/**
 * App.vue - Componente raíz de la aplicación NeuroZen
 * Maneja la estructura global y controla la visibilidad del header y footer
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent
  },
  computed: {
    /**
     * Determina si debe mostrar el header basado en la ruta actual
     * Oculta el header en páginas de autenticación y onboarding
     * @returns {boolean} true si debe mostrar el header
     */
    shouldShowHeader() {
      // Ocultar header en páginas de autenticación y onboarding
      const hideHeaderRoutes = ['/login', '/register', '/onboarding']
      return !hideHeaderRoutes.some(route => this.$route.path.startsWith(route))
    },
    
    /**
     * Determina si debe mostrar el footer basado en la ruta actual
     * Oculta el footer en páginas de autenticación y onboarding
     * @returns {boolean} true si debe mostrar el footer
     */
    shouldShowFooter() {
      // Ocultar footer en páginas de autenticación y onboarding
      const hideFooterRoutes = ['/login', '/register', '/onboarding']
      return !hideFooterRoutes.some(route => this.$route.path.startsWith(route))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content.with-header {
  padding-top: 0; /* El header es sticky, no necesita padding */
}

.main-content.with-footer {
  min-height: calc(100vh - 70px); /* Altura header */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #fcf9f8;
}

/* Estilos globales para Font Awesome */
.fas, .fab, .far {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
}

/* Estilos para transiciones de ruta */
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Variables CSS globales */
:root {
  --primary-color: #1b7520;
  --primary-dark: #4338ca;
  --secondary-color: #667eea;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #3b82f6;
  --light-color: #f8fafc;
  --dark-color: #1e293b;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Utilidades globales */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Clases de utilidad para espaciado */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-5 { padding: 1.25rem; }
.p-6 { padding: 1.5rem; }

.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 0.75rem; }
.m-4 { margin: 1rem; }
.m-5 { margin: 1.25rem; }
.m-6 { margin: 1.5rem; }

.mt-auto { margin-top: auto; }
.mb-auto { margin-bottom: auto; }
.ml-auto { margin-left: auto; }
.mr-auto { margin-right: auto; }

/* Clases de utilidad para texto */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--secondary-color); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
.text-danger { color: var(--danger-color); }
.text-info { color: var(--info-color); }
.text-muted { color: var(--gray-500); }

/* Clases de utilidad para flexbox */
.d-flex { display: flex; }
.d-block { display: block; }
.d-none { display: none; }

.flex-column { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.justify-content-start { justify-content: flex-start; }
.justify-content-end { justify-content: flex-end; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }
.justify-content-around { justify-content: space-around; }

.align-items-start { align-items: flex-start; }
.align-items-end { align-items: flex-end; }
.align-items-center { align-items: center; }
.align-items-stretch { align-items: stretch; }

/* Responsive utilities */
@media (max-width: 768px) {
  .d-md-none { display: none; }
  .d-md-block { display: block; }
  .d-md-flex { display: flex; }
}

@media (max-width: 576px) {
  .d-sm-none { display: none; }
  .d-sm-block { display: block; }
  .d-sm-flex { display: flex; }
}
</style>

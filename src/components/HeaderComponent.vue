<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo y Nombre -->
      <div class="header-brand">
        <router-link to="/dashboard" class="brand-link">
          <div class="logo">
            <img src="/neurozen1_logo.png" alt="NeuroZen Logo" />
          </div>
          <span class="brand-name">{{ $t('app.name') }}</span>
        </router-link>
      </div>

      <!-- Navegación Principal -->
      <nav class="header-nav" v-if="isAuthenticated">
        <router-link 
          to="/dashboard" 
          class="nav-link"
          :class="{ active: $route.path === '/dashboard' }"
        >
          <i class="fas fa-home"></i>
          {{ $t('navigation.dashboard') }}
        </router-link>
        
        <div class="nav-dropdown">
          <button class="nav-link dropdown-toggle" @click="toggleStressDropdown">
            <i class="fas fa-brain"></i>
            {{ $t('navigation.stress') }}
            <i class="fas fa-chevron-down dropdown-icon" :class="{ rotated: showStressDropdown }"></i>
          </button>
          <div class="dropdown-menu" v-show="showStressDropdown">
            <router-link to="/stress/triggers" class="dropdown-item">
              <i class="fas fa-exclamation-triangle"></i>
              {{ $t('stress.management.triggers') }}
            </router-link>
            <router-link to="/stress/active-breaks" class="dropdown-item">
              <i class="fas fa-pause"></i>
              {{ $t('stress.management.activeBreaks') }}
            </router-link>
            <router-link to="/stress/breathing" class="dropdown-item">
              <i class="fas fa-wind"></i>
              {{ $t('stress.management.breathing') }}
            </router-link>
            <router-link to="/stress/resources" class="dropdown-item">
              <i class="fas fa-book"></i>
              {{ $t('stress.management.resources') }}
            </router-link>
          </div>
        </div>

        <router-link 
          to="/book-session" 
          class="nav-link"
          :class="{ active: $route.path.includes('/book-session') || $route.path.includes('/professionals') }"
        >
          <i class="fas fa-user-md"></i>
          {{ $t('navigation.professionals') }}
        </router-link>

        <router-link 
          to="/subscriptions" 
          class="nav-link"
          :class="{ active: $route.path.includes('/subscriptions') }"
        >
          <i class="fas fa-credit-card"></i>
          {{ $t('navigation.subscriptions') }}
        </router-link>
      </nav>

      <!-- Acciones del Usuario -->
      <div class="header-actions">
        <!-- Selector de Idioma -->
        <LanguageSelectorComponent 
          @dropdown-toggled="handleDropdownToggle"
          @language-changed="handleLanguageChange"
        />

        <!-- Usuario Autenticado -->
        <div class="user-menu" v-if="isAuthenticated">
          <!-- Notificaciones -->
          <button class="action-btn notifications-btn" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
          </button>

          <!-- Menú Usuario -->
          <div class="user-dropdown">
            <button class="user-avatar" @click="toggleUserDropdown">
              <img 
                :src="userAvatar" 
                :alt="userName"
                class="avatar-image"
              />
              <span class="user-name">{{ userName }}</span>
              <i class="fas fa-chevron-down dropdown-icon" :class="{ rotated: showUserDropdown }"></i>
            </button>
            <div class="dropdown-menu user-dropdown-menu" v-show="showUserDropdown">
              <router-link to="/profile" class="dropdown-item">
                <i class="fas fa-user"></i>
                {{ $t('header.profile') }}
              </router-link>
              <router-link to="/settings" class="dropdown-item">
                <i class="fas fa-cog"></i>
                {{ $t('header.settings') }}
              </router-link>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-btn" @click="logout">
                <i class="fas fa-sign-out-alt"></i>
                {{ $t('header.logout') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Usuario No Autenticado -->
        <div class="auth-buttons" v-else>
          <router-link to="/login" class="btn btn-outline">
            {{ $t('navigation.login') }}
          </router-link>
          <router-link to="/register" class="btn btn-primary">
            {{ $t('navigation.register') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Panel de Notificaciones -->
    <div class="notifications-panel" v-show="showNotifications" @click.self="closeNotifications">
      <div class="panel-content">
        <div class="panel-header">
          <h3>{{ $t('header.notifications') }}</h3>
          <button class="close-btn" @click="closeNotifications">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notifications-list">
          <div class="notification-item" v-for="notification in notifications" :key="notification.id">
            <div class="notification-icon">
              <i :class="notification.icon"></i>
            </div>
            <div class="notification-content">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
          <div class="no-notifications" v-if="notifications.length === 0">
            <i class="fas fa-bell-slash"></i>
            <p>No hay notificaciones</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
/**
 * HeaderComponent - Componente de cabecera principal de NeuroZen
 * Maneja navegación, autenticación, notificaciones y selector de idioma
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import LanguageSelectorComponent from './LanguageSelectorComponent.vue';

export default {
  name: 'HeaderComponent',
  components: {
    LanguageSelectorComponent
  },
  data() {
    return {
      showStressDropdown: false,
      showUserDropdown: false,
      showNotifications: false,
      notifications: [
        {
          id: 1,
          title: 'Sesión programada',
          message: 'Tu sesión con Dr. María González es mañana a las 15:00',
          time: 'Hace 2 horas',
          icon: 'fas fa-calendar-check text-blue-500'
        },
        {
          id: 2,
          title: 'Ejercicio completado',
          message: 'Has completado tu ejercicio de respiración diario',
          time: 'Hace 4 horas',
          icon: 'fas fa-check-circle text-green-500'
        }
      ]
    };
  },
  computed: {
    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} true si hay un token de autenticación
     */
    isAuthenticated() {
      return !!localStorage.getItem('authToken');
    },
    
    /**
     * Obtiene el nombre del usuario actual
     * @returns {string} Nombre del usuario o 'Usuario' por defecto
     */
    userName() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Priorizar fullName, luego name, y finalmente 'Usuario' como fallback
      return user.fullName || user.name || 'Usuario';
    },
    
    /**
     * Obtiene la URL del avatar del usuario
     * @returns {string} URL del avatar del usuario o avatar generado
     */
    userAvatar() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName)}&background=4F46E5&color=fff`;
    },
    
    /**
     * Obtiene el número de notificaciones no leídas
     * @returns {number} Cantidad de notificaciones
     */
    notificationCount() {
      return this.notifications.length;
    }
  },
  methods: {
    /**
     * Alterna la visibilidad del dropdown de gestión de estrés
     */
    toggleStressDropdown() {
      this.showStressDropdown = !this.showStressDropdown;
      this.closeOtherDropdowns('stress');
    },
    
    /**
     * Alterna la visibilidad del dropdown del usuario
     */
    toggleUserDropdown() {
      this.showUserDropdown = !this.showUserDropdown;
      this.closeOtherDropdowns('user');
    },
    
    /**
     * Alterna la visibilidad del panel de notificaciones
     */
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      this.closeOtherDropdowns('notifications');
    },
    
    /**
     * Cierra el panel de notificaciones
     */
    closeNotifications() {
      this.showNotifications = false;
    },
    
    /**
     * Cierra todos los dropdowns excepto el especificado
     * @param {string} except - Tipo de dropdown que no se debe cerrar
     */
    closeOtherDropdowns(except) {
      if (except !== 'stress') this.showStressDropdown = false;
      if (except !== 'user') this.showUserDropdown = false;
      if (except !== 'notifications') this.showNotifications = false;
    },
    
    /**
     * Cierra todos los dropdowns
     */
    closeAllDropdowns() {
      this.closeOtherDropdowns('');
    },
    
    /**
     * Maneja el evento de toggle del selector de idioma
     * @param {string} type - Tipo de dropdown toggled
     */
    handleDropdownToggle(type) {
      // Cerrar otros dropdowns cuando el selector de idioma se abre
      if (type === 'language') {
        this.closeOtherDropdowns('language');
      }
    },
    
    /**
     * Maneja el cambio de idioma
     * @param {string} locale - Nuevo locale seleccionado
     */
    handleLanguageChange(locale) {
      // Forzar re-renderizado del componente para reflejar cambios
      this.$forceUpdate();
      console.log('Language changed in header:', locale);
    },
    
    /**
     * Cierra la sesión del usuario y redirige al login
     */
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.$router.push('/login');
      this.showUserDropdown = false;
    }
  },
  mounted() {
    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });
  }
};
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #08611b 0%, #08611b 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90px;
}

/* Logo y Marca */
.header-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 200px;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: opacity 0.3s ease;
}

.brand-link:hover {
  opacity: 0.9;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: .5rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.logo img {
  padding-top: 5px;
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.brand-link:hover .logo {
  transform: rotate(10deg) scale(1.05);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: -0.025em;
}

/* Navegación */
.header-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-right: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
}

.nav-dropdown {
  position: relative;
}

.dropdown-toggle .dropdown-icon {
  transition: transform 0.3s ease;
  margin-left: 0.25rem;
}

.dropdown-toggle .dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #18630e;
}

.dropdown-item i {
  width: 16px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

/* Acciones del Header */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Usuario */
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notifications-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dd4343;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-dropdown {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(206, 142, 24, 0.1);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.2);
}

.avatar-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.user-dropdown-menu {
  right: 0;
  left: auto;
  min-width: 180px;
}

.logout-btn {
  color: #dc2626 !important;
}

.logout-btn:hover {
  background: #fef2f2 !important;
}

/* Botones de Autenticación */
.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Panel de Notificaciones */
.notifications-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-top: 70px;
  padding-right: 1rem;
}

.panel-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 350px;
  max-height: 500px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
  margin: 0;
  color: #374151;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.3s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-icon {
  margin-right: 0.75rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.notification-message {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.no-notifications {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.no-notifications i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 0 0.75rem;
    height: 70px;
  }

  .header-brand {
    min-width: auto;
    flex-shrink: 1;
  }
  
  .logo img {
  padding-top: 6px;
    width: 40px;
    height: 40px;
  }

  .logo {
    margin-right: 0.5rem;
  }
  
  .brand-name {
    font-size: 1.1rem;
  }

  /* Ocultar navegación en móvil */
  .header-nav {
    display: none;
  }

  /* Simplificar acciones del header */
  .header-actions {
    gap: 0.5rem;
  }

  /* Ocultar nombre de usuario en móvil */
  .user-name {
    display: none;
  }

  /* Hacer avatar más pequeño */
  .avatar-image {
    width: 35px;
    height: 35px;
  }

  /* Ajustar botones de acción */
  .action-btn {
    padding: 0.4rem;
    font-size: 0.85rem;
  }
  
  /* Panel de notificaciones */
  .notifications-panel {
    padding-top: 70px;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
  
  .panel-content {
    width: calc(100vw - 1rem);
    max-width: 350px;
  }

  /* Dropdown de usuario más pequeño */
  .user-dropdown-menu {
    right: 0;
    left: auto;
    min-width: 180px;
  }

  .dropdown-item {
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
  .header-container {
    padding: 0 0.5rem;
    height: 60px;
  }

  .logo img {
    width: 35px;
    height: 35px;
  }

  .brand-name {
    font-size: 1rem;
  }

  .header-actions {
    gap: 0.25rem;
  }

  .action-btn {
    padding: 0.3rem;
  }

  .avatar-image {
    width: 32px;
    height: 32px;
  }

  .notifications-panel {
    padding: 0.25rem;
    padding-top: 60px;
  }

  .panel-content {
    width: calc(100vw - 0.5rem);
  }
}
</style>

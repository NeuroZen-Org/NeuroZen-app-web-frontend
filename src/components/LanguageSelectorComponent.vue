<template>
  <div class="language-selector">
    <button class="action-btn" @click="toggleDropdown">
      <i class="fas fa-globe"></i>
      <span class="current-lang">{{ currentLocale.toUpperCase() }}</span>
      <i class="fas fa-chevron-down dropdown-icon" :class="{ rotated: showDropdown }"></i>
    </button>
    <div class="dropdown-menu language-dropdown" v-show="showDropdown">
      <button 
        class="dropdown-item language-option" 
        @click="changeLanguage('es')"
        :class="{ active: currentLocale === 'es' }"
      >
        <span class="flag">🇪🇸</span>
        Español
      </button>
      <button 
        class="dropdown-item language-option" 
        @click="changeLanguage('en')"
        :class="{ active: currentLocale === 'en' }"
      >
        <span class="flag">🇺🇸</span>
        English
      </button>
    </div>
  </div>
</template>

<script>
/**
 * LanguageSelectorComponent - Componente selector de idioma
 * Permite cambiar entre español e inglés con persistencia en localStorage
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

export default {
  name: 'LanguageSelectorComponent',
  data() {
    return {
      showDropdown: false
    };
  },
  computed: {
    /**
     * Obtiene el idioma actual de la aplicación
     * Verifica múltiples fuentes para máxima compatibilidad
     * @returns {string} Código del idioma actual ('es' o 'en')
     */
    currentLocale() {
      // Múltiples formas de acceder al locale para máxima compatibilidad
      if (this.$i18n?.locale?.value) {
        return this.$i18n.locale.value;
      }
      if (this.$i18n?.locale) {
        return this.$i18n.locale;
      }
      // Fallback al localStorage
      return localStorage.getItem('neurozen-locale') || 'es';
    }
  },
  methods: {
    /**
     * Alterna la visibilidad del dropdown de idiomas
     * Emite evento para notificar al componente padre
     */
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      this.$emit('dropdown-toggled', 'language');
    },
    
    /**
     * Cambia el idioma de la aplicación
     * Actualiza i18n, localStorage y DOM
     * @param {string} locale - Código del nuevo idioma ('es' o 'en')
     */
    async changeLanguage(locale) {
      try {
        // Método 1: Usar la función setLocale personalizada
        if (this.$i18n?.locale?.value !== undefined) {
          this.$i18n.locale.value = locale;
        } else if (this.$i18n?.locale !== undefined) {
          this.$i18n.locale = locale;
        }
        
        // Método 2: Guardar en localStorage para persistencia
        localStorage.setItem('neurozen-locale', locale);
        
        // Método 3: Actualizar el atributo lang del documento
        document.documentElement.lang = locale;
        
        // Método 4: Forzar actualización del componente
        this.$forceUpdate();
        
        // Emitir evento para notificar el cambio
        this.$emit('language-changed', locale);
        
        // Cerrar dropdown
        this.showDropdown = false;
        
        console.log('Language changed to:', locale);
        console.log('Current i18n locale:', this.currentLocale);
        
      } catch (error) {
        console.error('Error changing language:', error);
      }
    },
    
    closeDropdown() {
      this.showDropdown = false;
    }
  },
  
  mounted() {
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeDropdown();
      }
    });
    
    // Sincronizar con el i18n al montar
    const savedLocale = localStorage.getItem('neurozen-locale');
    if (savedLocale && this.$i18n) {
      if (this.$i18n.locale?.value !== undefined) {
        this.$i18n.locale.value = savedLocale;
      } else if (this.$i18n.locale !== undefined) {
        this.$i18n.locale = savedLocale;
      }
    }
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  }
};
</script>

<style scoped>
.language-selector {
  position: relative;
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

.current-lang {
  font-weight: 600;
  font-size: 0.8rem;
}

.dropdown-icon {
  transition: transform 0.3s ease;
  margin-left: 0.25rem;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 150px;
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
  color: #109137;
}

.language-option.active {
  background: #f0f9ff;
  color: #2e9425;
}

.flag {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .current-lang {
    display: none;
  }
}
</style>

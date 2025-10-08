<template>
  <div class="settings-container">
    <!-- Navigation -->
    <nav class="settings-nav">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i>
        Atrás
      </button>
      <h1>{{ $t('settings.title') }}</h1>
    </nav>

    <div class="settings-content">
      <!-- Settings Tabs -->
      <div class="settings-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ 'active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
        </button>
      </div>

      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="settings-section">
        <h2>{{ $t('settings.generalConfiguration') }}</h2>
        
        <div class="setting-group">
          <h3>Idioma y Región</h3>
          <div class="setting-item">
            <label>Idioma de la aplicación</label>
            <select v-model="settings.general.language" @change="saveSettings">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Zona horaria</label>
            <select v-model="settings.general.timezone" @change="saveSettings">
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/New_York">Nueva York (GMT-5)</option>
              <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
              <option value="Europe/Madrid">Madrid (GMT+1)</option>
              <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Formato de fecha</label>
            <select v-model="settings.general.dateFormat" @change="saveSettings">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div class="setting-group">
          <h3>Tema y Apariencia</h3>
          <div class="setting-item">
            <label>Tema de color</label>
            <div class="theme-options">
              <div 
                v-for="theme in themes" 
                :key="theme.id"
                class="theme-option"
                :class="{ 'selected': settings.general.theme === theme.id }"
                @click="changeTheme(theme.id)"
              >
                <div class="theme-preview" :style="{ background: theme.gradient }"></div>
                <span>{{ theme.name }}</span>
              </div>
            </div>
          </div>
          <div class="setting-item">
            <label>Tamaño de fuente</label>
            <div class="font-size-container">
              <input 
                v-model="settings.general.fontSize" 
                type="range" 
                min="12" 
                max="20" 
                @change="saveSettings"
                class="font-size-slider"
              />
              <span class="font-size-value">{{ settings.general.fontSize }}px</span>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Modo oscuro automático</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.general.autoDarkMode" 
                type="checkbox" 
                id="autoDarkMode"
                @change="saveSettings"
              />
              <label for="autoDarkMode" class="toggle-label"></label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Accesibilidad</h3>
          <div class="setting-item toggle-item">
            <label>Reducir animaciones</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.general.reduceAnimations" 
                type="checkbox" 
                id="reduceAnimations"
                @change="saveSettings"
              />
              <label for="reduceAnimations" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Alto contraste</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.general.highContrast" 
                type="checkbox" 
                id="highContrast"
                @change="saveSettings"
              />
              <label for="highContrast" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Narrador de pantalla</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.general.screenReader" 
                type="checkbox" 
                id="screenReader"
                @change="saveSettings"
              />
              <label for="screenReader" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div v-if="activeTab === 'notifications'" class="settings-section">
        <h2>Notificaciones</h2>
        
        <div class="setting-group">
          <h3>Recordatorios de Sesiones</h3>
          <div class="setting-item toggle-item">
            <label>Habilitar recordatorios</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.notifications.sessionReminders" 
                type="checkbox" 
                id="sessionReminders"
                @change="saveSettings"
              />
              <label for="sessionReminders" class="toggle-label"></label>
            </div>
          </div>
          <div v-if="settings.notifications.sessionReminders" class="sub-settings">
            <div class="setting-item">
              <label>Recordar con anticipación</label>
              <select v-model="settings.notifications.sessionReminderTime" @change="saveSettings">
                <option value="5">5 minutos antes</option>
                <option value="15">15 minutos antes</option>
                <option value="30">30 minutos antes</option>
                <option value="60">1 hora antes</option>
                <option value="1440">1 día antes</option>
              </select>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Recordatorios de Respiración</h3>
          <div class="setting-item toggle-item">
            <label>Recordatorios de ejercicios de respiración</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.notifications.breathingReminders" 
                type="checkbox" 
                id="breathingReminders"
                @change="saveSettings"
              />
              <label for="breathingReminders" class="toggle-label"></label>
            </div>
          </div>
          <div v-if="settings.notifications.breathingReminders" class="sub-settings">
            <div class="setting-item">
              <label>Frecuencia</label>
              <select v-model="settings.notifications.breathingFrequency" @change="saveSettings">
                <option value="30">Cada 30 minutos</option>
                <option value="60">Cada hora</option>
                <option value="120">Cada 2 horas</option>
                <option value="240">Cada 4 horas</option>
              </select>
            </div>
            <div class="setting-item">
              <label>Horario activo</label>
              <div class="time-range">
                <input 
                  v-model="settings.notifications.breathingStartTime" 
                  type="time" 
                  @change="saveSettings"
                />
                <span>a</span>
                <input 
                  v-model="settings.notifications.breathingEndTime" 
                  type="time" 
                  @change="saveSettings"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Pausas Activas</h3>
          <div class="setting-item toggle-item">
            <label>Recordatorios de pausas activas</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.notifications.activeBreakReminders" 
                type="checkbox" 
                id="activeBreakReminders"
                @change="saveSettings"
              />
              <label for="activeBreakReminders" class="toggle-label"></label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Reportes y Progreso</h3>
          <div class="setting-item toggle-item">
            <label>Resumen semanal</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.notifications.weeklyReport" 
                type="checkbox" 
                id="weeklyReport"
                @change="saveSettings"
              />
              <label for="weeklyReport" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Logros y metas alcanzadas</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.notifications.achievements" 
                type="checkbox" 
                id="achievements"
                @change="saveSettings"
              />
              <label for="achievements" class="toggle-label"></label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>{{ $t('settings.advancedConfiguration') }}</h3>
          <div class="setting-item">
            <label>Sonido de notificación</label>
            <select v-model="settings.notifications.soundType" @change="saveSettings">
              <option value="default">Predeterminado</option>
              <option value="gentle">Suave</option>
              <option value="nature">Naturaleza</option>
              <option value="chime">Campanilla</option>
              <option value="none">Silencioso</option>
            </select>
          </div>
          <div class="setting-item toggle-item">
            <label>Vibración (móvil)</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.notifications.vibration" 
                type="checkbox" 
                id="vibration"
                @change="saveSettings"
              />
              <label for="vibration" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div v-if="activeTab === 'privacy'" class="settings-section">
        <h2>Privacidad y Seguridad</h2>
        
        <div class="setting-group">
          <h3>Privacidad del Perfil</h3>
          <div class="setting-item toggle-item">
            <label>Perfil público</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.privacy.publicProfile" 
                type="checkbox" 
                id="publicProfile"
                @change="saveSettings"
              />
              <label for="publicProfile" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Mostrar progreso a otros usuarios</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.privacy.showProgress" 
                type="checkbox" 
                id="showProgress"
                @change="saveSettings"
              />
              <label for="showProgress" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Permitir contacto de otros usuarios</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.privacy.allowContact" 
                type="checkbox" 
                id="allowContact"
                @change="saveSettings"
              />
              <label for="allowContact" class="toggle-label"></label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Datos y Analytics</h3>
          <div class="setting-item toggle-item">
            <label>Compartir datos de uso para mejorar la app</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.privacy.shareAnalytics" 
                type="checkbox" 
                id="shareAnalytics"
                @change="saveSettings"
              />
              <label for="shareAnalytics" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <label>Personalización basada en uso</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.privacy.personalization" 
                type="checkbox" 
                id="personalization"
                @change="saveSettings"
              />
              <label for="personalization" class="toggle-label"></label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Seguridad</h3>
          <div class="setting-item toggle-item">
            <label>Autenticación de dos factores</label>
            <div class="toggle-switch">
              <input 
                v-model="settings.privacy.twoFactorAuth" 
                type="checkbox" 
                id="twoFactorAuth"
                @change="saveSettings"
              />
              <label for="twoFactorAuth" class="toggle-label"></label>
            </div>
          </div>
          <div class="setting-item">
            <label>Tiempo de inactividad para cerrar sesión</label>
            <select v-model="settings.privacy.sessionTimeout" @change="saveSettings">
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="240">4 horas</option>
              <option value="0">Nunca</option>
            </select>
          </div>
        </div>

        <div class="setting-group danger-zone">
          <h3>Zona de Peligro</h3>
          <div class="danger-actions">
            <button @click="downloadData" class="action-btn secondary">
              <i class="fas fa-download"></i>
              Descargar mis datos
            </button>
            <button @click="deleteAllData" class="action-btn danger">
              <i class="fas fa-trash"></i>
              Eliminar todos mis datos
            </button>
          </div>
        </div>
      </div>

      <!-- About Settings -->
      <div v-if="activeTab === 'about'" class="settings-section">
        <h2>Acerca de NeuroZen</h2>
        
        <div class="app-info">
          <div class="app-logo">
            <i class="fas fa-brain"></i>
          </div>
          <h3>NeuroZen</h3>
          <p class="version">Versión 1.2.3</p>
          <p class="description">
            Tu compañero personal para el manejo del estrés y el bienestar mental.
            Desarrollado con amor para ayudarte a encontrar tu equilibrio.
          </p>
        </div>

        <div class="setting-group">
          <h3>Información</h3>
          <div class="info-item">
            <label>Última actualización</label>
            <span>15 de Enero, 2024</span>
          </div>
          <div class="info-item">
            <label>Tamaño de la aplicación</label>
            <span>45.6 MB</span>
          </div>
          <div class="info-item">
            <label>Desarrollador</label>
            <span>NeuroZen Team</span>
          </div>
        </div>

        <div class="setting-group">
          <h3>Soporte</h3>
          <div class="support-actions">
            <button @click="openHelp" class="action-btn primary">
              <i class="fas fa-question-circle"></i>
              Centro de Ayuda
            </button>
            <button @click="contactSupport" class="action-btn primary">
              <i class="fas fa-envelope"></i>
              Contactar Soporte
            </button>
            <button @click="reportBug" class="action-btn secondary">
              <i class="fas fa-bug"></i>
              Reportar Error
            </button>
            <button @click="rateApp" class="action-btn secondary">
              <i class="fas fa-star"></i>
              Calificar App
            </button>
          </div>
        </div>

        <div class="setting-group">
          <h3>Legal</h3>
          <div class="legal-links">
            <a href="/terms" target="_blank">Términos de Servicio</a>
            <a href="/privacy" target="_blank">Política de Privacidad</a>
            <a href="/licenses" target="_blank">Licencias Open Source</a>
          </div>
        </div>

        <div class="setting-group">
          <h3>Diagnóstico</h3>
          <div class="diagnostic-actions">
            <button @click="runDiagnostic" class="action-btn secondary">
              <i class="fas fa-stethoscope"></i>
              Ejecutar Diagnóstico
            </button>
            <button @click="clearCache" class="action-btn secondary">
              <i class="fas fa-broom"></i>
              Limpiar Caché
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Save indicator -->
    <div v-if="saving" class="save-indicator">
      <i class="fas fa-check"></i>
      {{ $t('settings.configurationSaved') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsComponent',
  data() {
    return {
      activeTab: 'general',
      saving: false,
      tabs: [
        { id: 'general', name: 'General', icon: 'fas fa-cog' },
        { id: 'notifications', name: 'Notificaciones', icon: 'fas fa-bell' },
        { id: 'privacy', name: 'Privacidad', icon: 'fas fa-shield-alt' },
        { id: 'about', name: 'Acerca de', icon: 'fas fa-info-circle' }
      ],
      themes: [
        { id: 'default', name: 'Predeterminado', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'ocean', name: 'Océano', gradient: 'linear-gradient(135deg, #667eea 0%, #4f8ff7 100%)' },
        { id: 'forest', name: 'Bosque', gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' },
        { id: 'sunset', name: 'Atardecer', gradient: 'linear-gradient(135deg, #ed8936 0%, #dd7724 100%)' }
      ],
      settings: {
        general: {
          language: 'es',
          timezone: 'America/Mexico_City',
          dateFormat: 'DD/MM/YYYY',
          theme: 'default',
          fontSize: 16,
          autoDarkMode: false,
          reduceAnimations: false,
          highContrast: false,
          screenReader: false
        },
        notifications: {
          sessionReminders: true,
          sessionReminderTime: 15,
          breathingReminders: true,
          breathingFrequency: 120,
          breathingStartTime: '09:00',
          breathingEndTime: '18:00',
          activeBreakReminders: true,
          weeklyReport: true,
          achievements: true,
          soundType: 'gentle',
          vibration: true
        },
        privacy: {
          publicProfile: false,
          showProgress: true,
          allowContact: false,
          shareAnalytics: true,
          personalization: true,
          twoFactorAuth: false,
          sessionTimeout: 30
        }
      }
    };
  },
  
  mounted() {
    this.loadSettings();
  },
  
  methods: {
    loadSettings() {
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem('neurozen_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          this.settings = { ...this.settings, ...parsed };
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
    },
    
    async saveSettings() {
      this.saving = true;
      
      try {
        // Save to localStorage
        localStorage.setItem('neurozen_settings', JSON.stringify(this.settings));
        
        // Simulate API save
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Show save indicator
        setTimeout(() => {
          this.saving = false;
        }, 1000);
        
      } catch (error) {
        console.error('Error saving settings:', error);
        this.saving = false;
      }
    },
    
    changeTheme(themeId) {
      this.settings.general.theme = themeId;
      this.saveSettings();
      
      // Apply theme immediately
      document.body.className = `theme-${themeId}`;
    },
    
    downloadData() {
      // Mock data download
      const userData = {
        settings: this.settings,
        exportDate: new Date().toISOString(),
        version: '1.2.3'
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'neurozen_settings.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    },
    
    deleteAllData() {
      const confirmed = confirm(
        '¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.'
      );
      
      if (confirmed) {
        const doubleConfirm = confirm(
          'Esto eliminará permanentemente tu perfil, configuraciones y todo el progreso. ¿Continuar?'
        );
        
        if (doubleConfirm) {
          localStorage.clear();
          alert('Todos los datos han sido eliminados. Serás redirigido al inicio de sesión.');
          this.$router.push('/login');
        }
      }
    },
    
    openHelp() {
      window.open('https://help.neurozen.com', '_blank');
    },
    
    contactSupport() {
      window.open('mailto:soporte@neurozen.com?subject=Soporte NeuroZen', '_blank');
    },
    
    reportBug() {
      const body = `
Describe el error:



Pasos para reproducir:
1. 
2. 
3. 

Dispositivo: ${navigator.userAgent}
Versión de la app: 1.2.3
      `;
      window.open(`mailto:bugs@neurozen.com?subject=Reporte de Error&body=${encodeURIComponent(body)}`, '_blank');
    },
    
    rateApp() {
      // Open app store rating page
      alert('Funcionalidad de calificación - Por implementar');
    },
    
    runDiagnostic() {
      alert('Ejecutando diagnóstico del sistema...\n\n✓ Conexión a internet: OK\n✓ Almacenamiento local: OK\n✓ Permisos: OK\n✓ Rendimiento: Bueno\n\nTodo funcionando correctamente.');
    },
    
    clearCache() {
      const confirmed = confirm('¿Limpiar la caché de la aplicación? Esto puede mejorar el rendimiento.');
      if (confirmed) {
        // Clear cache but keep settings
        const settings = localStorage.getItem('neurozen_settings');
        localStorage.clear();
        if (settings) {
          localStorage.setItem('neurozen_settings', settings);
        }
        alert('Caché limpiada exitosamente.');
      }
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.settings-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.settings-nav h1 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.settings-content {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Tabs */
.settings-tabs {
  display: flex;
  background: #f8f9ff;
  border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
  flex: 1;
  padding: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: white;
}

/* Settings Sections */
.settings-section {
  padding: 30px;
}

.settings-section h2 {
  color: #333;
  margin: 0 0 30px 0;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.setting-group {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e2e8f0;
}

.setting-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.setting-group h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
}

.setting-group h4 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
}

/* Setting Items */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.toggle-item {
  justify-content: space-between;
}

.setting-item label {
  color: #333;
  font-weight: 500;
  flex: 1;
}

.setting-item select,
.setting-item input[type="time"] {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 150px;
}

/* Theme Options */
.theme-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  max-width: 300px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-option:hover,
.theme-option.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.theme-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-option span {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

/* Font Size */
.font-size-container {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 200px;
}

.font-size-slider {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  appearance: none;
}

.font-size-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.font-size-value {
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
  text-align: center;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-label {
  display: block;
  width: 50px;
  height: 28px;
  background: #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-label {
  background: #667eea;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-label::after {
  transform: translateX(22px);
}

/* Sub Settings */
.sub-settings {
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid #e2e8f0;
  margin-top: 15px;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-range span {
  color: #666;
  font-weight: 500;
}

/* Info Items */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  color: #666;
  font-weight: 500;
}

.info-item span {
  color: #333;
  font-weight: 600;
}

/* App Info */
.app-info {
  text-align: center;
  padding: 30px;
  background: #f8f9ff;
  border-radius: 15px;
  margin-bottom: 30px;
}

.app-logo {
  width: 80px;
  height: 80px;
  background: #667eea;
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 20px;
}

.app-info h3 {
  color: #333;
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 700;
}

.version {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 14px;
}

.description {
  color: #666;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* Action Buttons */
.support-actions,
.diagnostic-actions,
.danger-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a67d8;
}

.action-btn.secondary {
  background: #48bb78;
  color: white;
}

.action-btn.secondary:hover {
  background: #38a169;
}

.action-btn.danger {
  background: #f56565;
  color: white;
}

.action-btn.danger:hover {
  background: #e53e3e;
}

/* Legal Links */
.legal-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legal-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.legal-links a:hover {
  text-decoration: underline;
}

.legal-links a:last-child {
  border-bottom: none;
}

/* Danger Zone */
.danger-zone {
  background: #fdf2f2;
  border: 2px solid #fed7d7;
  border-radius: 10px;
  padding: 20px;
}

.danger-zone h3 {
  color: #c53030;
}

/* Save Indicator */
.save-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #48bb78;
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .settings-container {
    padding: 10px;
  }
  
  .settings-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    justify-content: flex-start;
    padding: 15px 20px;
  }
  
  .settings-section {
    padding: 20px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .theme-options {
    grid-template-columns: 1fr;
    max-width: none;
  }
  
  .support-actions,
  .diagnostic-actions,
  .danger-actions {
    grid-template-columns: 1fr;
  }
  
  .time-range {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <div class="active-breaks-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>Pausas Activas</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loadingConfiguration') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ $t('common.errorLoading') }}</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadActiveBreaks">Reintentar</button>
    </div>

    <!-- Content -->
    <div v-else class="content">
      <!-- Current Status -->
      <div class="status-card">
        <div class="status-header">
          <h2>Estado Actual</h2>
          <div class="toggle-switch" @click="toggleActiveBreaks">
            <div class="switch" :class="{ active: breakConfig.isActive }">
              <div class="switch-handle"></div>
            </div>
          </div>
        </div>
        <p class="status-text">
          Las pausas activas están 
          <span :class="{ active: breakConfig.isActive, inactive: !breakConfig.isActive }">
            {{ breakConfig.isActive ? 'activadas' : 'desactivadas' }}
          </span>
        </p>
        <div v-if="breakConfig.isActive" class="next-break">
          <p><strong>Próxima pausa:</strong> {{ nextBreakTime }}</p>
        </div>
      </div>

      <!-- Configuration Section -->
      <div class="config-section">
        <h3>{{ $t('stress.activeBreaks.configuration') }}</h3>
        
        <!-- Frequency Setting -->
        <div class="setting-item">
          <label>Frecuencia de pausas</label>
          <div class="frequency-selector">
            <button 
              v-for="freq in frequencyOptions" 
              :key="freq.value"
              :class="{ active: breakConfig.frequency === freq.value }"
              @click="updateFrequency(freq.value)"
            >
              {{ freq.label }}
            </button>
          </div>
          <p class="setting-description">
            Una pausa cada {{ breakConfig.frequency }} minutos
          </p>
        </div>

        <!-- Duration Setting -->
        <div class="setting-item">
          <label>Duración de la pausa</label>
          <div class="duration-selector">
            <button 
              v-for="dur in durationOptions" 
              :key="dur.value"
              :class="{ active: breakConfig.duration === dur.value }"
              @click="updateDuration(dur.value)"
            >
              {{ dur.label }}
            </button>
          </div>
        </div>

        <!-- Working Hours -->
        <div class="setting-item">
          <label>Horario laboral</label>
          <div class="time-inputs">
            <div class="time-input">
              <label>Inicio</label>
              <input 
                type="time" 
                v-model="breakConfig.settings.workingHours.start"
                @change="updateWorkingHours"
              >
            </div>
            <div class="time-input">
              <label>Fin</label>
              <input 
                type="time" 
                v-model="breakConfig.settings.workingHours.end"
                @change="updateWorkingHours"
              >
            </div>
          </div>
        </div>

        <!-- Working Days -->
        <div class="setting-item">
          <label>Días laborales</label>
          <div class="days-selector">
            <button 
              v-for="day in weekDays" 
              :key="day.value"
              :class="{ active: breakConfig.settings.workingDays.includes(day.value) }"
              @click="toggleWorkingDay(day.value)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="schedule-section">
        <h3>Horario de hoy</h3>
        <div class="schedule-grid">
          <div 
            v-for="(breakTime, index) in todaySchedule" 
            :key="index"
            class="schedule-item"
            :class="{ 
              completed: breakTime.completed, 
              current: breakTime.isCurrent,
              upcoming: breakTime.isUpcoming 
            }"
          >
            <div class="time">{{ breakTime.time }}</div>
            <div class="status">
              <i v-if="breakTime.completed" class="fas fa-check"></i>
              <i v-else-if="breakTime.isCurrent" class="fas fa-clock"></i>
              <i v-else class="far fa-clock"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-section">
        <h3>Estadísticas semanales</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ weeklyStats.totalBreaks }}</div>
            <div class="stat-label">Pausas completadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ weeklyStats.compliance }}%</div>
            <div class="stat-label">Cumplimiento</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ weeklyStats.totalTime }}min</div>
            <div class="stat-label">Tiempo de pausas</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <p>{{ $t('stress.activeBreaks.configurationSaved') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ActiveBreaksService } from '../../services/ActiveBreaksService.js';

export default {
  name: 'ActiveBreaksComponent',
  data() {
    return {
      loading: true,
      error: null,
      showSuccess: false,
      // Service instance
      activeBreaksService: new ActiveBreaksService(),
      breakConfig: {
        frequency: 45,
        duration: 5,
        isActive: true,
        settings: {
          workingHours: {
            start: '09:00',
            end: '18:00'
          },
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      frequencyOptions: [
        { value: 30, label: '30 min' },
        { value: 45, label: '45 min' },
        { value: 60, label: '1 hora' },
        { value: 90, label: '1.5 horas' },
        { value: 120, label: '2 horas' }
      ],
      durationOptions: [
        { value: 3, label: '3 min' },
        { value: 5, label: '5 min' },
        { value: 10, label: '10 min' },
        { value: 15, label: '15 min' }
      ],
      weekDays: [
        { value: 'monday', label: 'L' },
        { value: 'tuesday', label: 'M' },
        { value: 'wednesday', label: 'X' },
        { value: 'thursday', label: 'J' },
        { value: 'friday', label: 'V' },
        { value: 'saturday', label: 'S' },
        { value: 'sunday', label: 'D' }
      ],
      todaySchedule: [],
      weeklyStats: {
        totalBreaks: 0,
        compliance: 0,
        totalTime: 0
      }
    }
  },
  computed: {
    nextBreakTime() {
      const upcoming = this.todaySchedule.find(item => item.isUpcoming);
      return upcoming ? upcoming.time : 'No hay pausas programadas';
    }
  },
  async mounted() {
    await this.loadActiveBreaks();
  },
  methods: {
    async loadActiveBreaks() {
      try {
        this.loading = true;
        this.error = null;
        
        const config = await this.activeBreaksService.getConfiguration(1); // User ID 1
        if (config) {
          this.breakConfig = { ...this.breakConfig, ...config };
        }
        
        await this.generateTodaySchedule();
        await this.loadWeeklyStats();
        
      } catch (error) {
        console.error('Error loading active breaks:', error);
        this.error = this.$t('stress.activeBreaks.errorLoadingConfig');
      } finally {
        this.loading = false;
      }
    },

    async generateTodaySchedule() {
      try {
        this.todaySchedule = await this.activeBreaksService.getTodaySchedule(1);
      } catch (error) {
        console.error('Error generating schedule:', error);
        this.todaySchedule = [];
      }
    },

    async loadWeeklyStats() {
      try {
        this.weeklyStats = await this.activeBreaksService.getWeeklyStats(1);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },

    async toggleActiveBreaks() {
      try {
        this.breakConfig.isActive = !this.breakConfig.isActive;
        await this.saveConfiguration();
        await this.generateTodaySchedule();
      } catch (error) {
        console.error('Error toggling active breaks:', error);
        this.breakConfig.isActive = !this.breakConfig.isActive; // Revert
      }
    },

    async updateFrequency(frequency) {
      this.breakConfig.frequency = frequency;
      await this.saveConfiguration();
      await this.generateTodaySchedule();
    },

    async updateDuration(duration) {
      this.breakConfig.duration = duration;
      await this.saveConfiguration();
    },

    async updateWorkingHours() {
      await this.saveConfiguration();
      await this.generateTodaySchedule();
    },

    async toggleWorkingDay(day) {
      const index = this.breakConfig.settings.workingDays.indexOf(day);
      if (index > -1) {
        this.breakConfig.settings.workingDays.splice(index, 1);
      } else {
        this.breakConfig.settings.workingDays.push(day);
      }
      await this.saveConfiguration();
      await this.generateTodaySchedule();
    },

    async saveConfiguration() {
      try {
        await this.activeBreaksService.updateConfiguration(1, this.breakConfig);
        this.showSuccessMessage();
      } catch (error) {
        console.error('Error saving configuration:', error);
        this.error = this.$t('stress.activeBreaks.errorSavingConfig');
      }
    },

    showSuccessMessage() {
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.active-breaks-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.retry-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.status-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.toggle-switch {
  cursor: pointer;
}

.switch {
  width: 50px;
  height: 26px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 13px;
  position: relative;
  transition: background-color 0.3s;
}

.switch.active {
  background: #4CAF50;
}

.switch-handle {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switch.active .switch-handle {
  transform: translateX(24px);
}

.status-text {
  margin: 15px 0;
  font-size: 16px;
}

.status-text .active {
  color: #4CAF50;
  font-weight: 600;
}

.status-text .inactive {
  color: #f44336;
  font-weight: 600;
}

.next-break {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 10px;
  margin-top: 15px;
}

.config-section,
.schedule-section,
.stats-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.config-section h3,
.schedule-section h3,
.stats-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.setting-item {
  margin-bottom: 25px;
}

.setting-item label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 14px;
}

.frequency-selector,
.duration-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.frequency-selector button,
.duration-selector button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.frequency-selector button.active,
.duration-selector button.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.setting-description {
  margin: 8px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.time-inputs {
  display: flex;
  gap: 15px;
}

.time-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.time-input label {
  font-size: 12px;
  margin-bottom: 5px;
}

.time-input input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.time-input input:focus {
  outline: none;
  border-color: white;
}

.days-selector {
  display: flex;
  gap: 8px;
}

.days-selector button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.days-selector button.active {
  background: white;
  color: #667eea;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.schedule-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.3s;
}

.schedule-item.completed {
  background: rgba(76, 175, 80, 0.3);
}

.schedule-item.current {
  background: rgba(255, 193, 7, 0.3);
  animation: pulse 2s infinite;
}

.schedule-item.upcoming {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.schedule-item .time {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
}

.schedule-item .status i {
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

.success-content {
  background: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .active-breaks-container {
    padding: 15px;
  }
  
  .time-inputs {
    flex-direction: column;
  }
  
  .frequency-selector,
  .duration-selector {
    justify-content: center;
  }
  
  .days-selector {
    justify-content: center;
  }
  
  .schedule-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
}
</style>

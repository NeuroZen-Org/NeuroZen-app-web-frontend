<template>
  <div class="active-breaks-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>{{ $t('stress.activeBreaks.title') }}</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Current Status -->
      <div class="status-card">
        <div class="status-header">
          <h2>{{ $t('stress.activeBreaks.currentStatus') }}</h2>
          <div class="toggle-switch" @click="toggleActiveBreaks">
            <div class="switch" :class="{ active: breakConfig.isActive }">
              <div class="switch-handle"></div>
            </div>
          </div>
        </div>
        <p class="status-text">
          {{ $t('stress.activeBreaks.activeBreaksAre') }}
          <span :class="{ active: breakConfig.isActive, inactive: !breakConfig.isActive }">
            {{ breakConfig.isActive ? $t('stress.activeBreaks.activated') : $t('stress.activeBreaks.deactivated') }}
          </span>
        </p>
        <div v-if="breakConfig.isActive" class="next-break">
          <p><strong>{{ $t('stress.activeBreaks.nextBreak') }}</strong> {{ nextBreakTime }}</p>
        </div>
      </div>

      <!-- Configuration Section -->
      <div class="config-section">
        <h3>{{ $t('stress.activeBreaks.configuration') }}</h3>
        
        <!-- Frequency Setting -->
        <div class="setting-item">
          <label>{{ $t('stress.activeBreaks.frequencyLabel') }}</label>
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
            {{ $t('stress.activeBreaks.frequencyDescription', { minutes: breakConfig.frequency }) }}
          </p>
        </div>

        <!-- Duration Setting -->
        <div class="setting-item">
          <label>{{ $t('stress.activeBreaks.durationLabel') }}</label>
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
          <label>{{ $t('stress.activeBreaks.workingHours') }}</label>
          <div class="time-inputs">
            <div class="time-input">
              <label>{{ $t('stress.activeBreaks.start') }}</label>
              <input 
                type="time" 
                v-model="breakConfig.settings.workingHours.start"
                @change="updateWorkingHours"
              >
            </div>
            <div class="time-input">
              <label>{{ $t('stress.activeBreaks.end') }}</label>
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
          <label>{{ $t('stress.activeBreaks.workingDays') }}</label>
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
        <h3>{{ $t('stress.activeBreaks.todaySchedule') }}</h3>
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
        <h3>{{ $t('stress.activeBreaks.weeklyStats') }}</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ weeklyStats.totalBreaks }}</div>
            <div class="stat-label">{{ $t('stress.activeBreaks.breaksCompleted') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ weeklyStats.compliance }}%</div>
            <div class="stat-label">{{ $t('stress.activeBreaks.compliance') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ weeklyStats.totalTime }}min</div>
            <div class="stat-label">{{ $t('stress.activeBreaks.breakTime') }}</div>
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
export default {
  name: 'ActiveBreaksComponent',
  data() {
    return {
      loading: false,
      error: null,
      showSuccess: false,
      // Configuración hardcoded (sin backend)
      breakConfig: {
        frequency: 45, // minutos
        duration: 5, // minutos
        isActive: true,
        settings: {
          workingHours: {
            start: '09:00',
            end: '18:00'
          },
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      // Horario del día generado localmente
      todaySchedule: [],
      // Estadísticas de la semana
      weeklyStats: {
        totalBreaks: 15,
        compliance: 75,
        totalTime: 75 // minutos
      }
    }
  },
  computed: {
    nextBreakTime() {
      const upcoming = this.todaySchedule.find(item => item.isUpcoming);
      return upcoming ? upcoming.time : this.$t('stress.activeBreaks.noScheduledBreaks');
    },
    frequencyOptions() {
      return [
        { value: 30, label: this.$t('stress.activeBreaks.frequencyOptions.30') },
        { value: 45, label: this.$t('stress.activeBreaks.frequencyOptions.45') },
        { value: 60, label: this.$t('stress.activeBreaks.frequencyOptions.60') },
        { value: 90, label: this.$t('stress.activeBreaks.frequencyOptions.90') },
        { value: 120, label: this.$t('stress.activeBreaks.frequencyOptions.120') }
      ];
    },
    durationOptions() {
      return [
        { value: 3, label: this.$t('stress.activeBreaks.durationOptions.3') },
        { value: 5, label: this.$t('stress.activeBreaks.durationOptions.5') },
        { value: 10, label: this.$t('stress.activeBreaks.durationOptions.10') },
        { value: 15, label: this.$t('stress.activeBreaks.durationOptions.15') }
      ];
    },
    weekDays() {
      return [
        { value: 'monday', label: this.$t('stress.activeBreaks.weekDays.monday') },
        { value: 'tuesday', label: this.$t('stress.activeBreaks.weekDays.tuesday') },
        { value: 'wednesday', label: this.$t('stress.activeBreaks.weekDays.wednesday') },
        { value: 'thursday', label: this.$t('stress.activeBreaks.weekDays.thursday') },
        { value: 'friday', label: this.$t('stress.activeBreaks.weekDays.friday') },
        { value: 'saturday', label: this.$t('stress.activeBreaks.weekDays.saturday') },
        { value: 'sunday', label: this.$t('stress.activeBreaks.weekDays.sunday') }
      ];
    }
  },
  mounted() {
    // Cargar configuración guardada del usuario
    this.loadFromLocalStorage();
    // Generar el horario del día localmente
    this.generateTodaySchedule();
  },
  methods: {
    generateTodaySchedule() {
      // Generar horario de pausas para hoy basado en la configuración
      const schedule = [];
      const startHour = parseInt(this.breakConfig.settings.workingHours.start.split(':')[0]);
      const endHour = parseInt(this.breakConfig.settings.workingHours.end.split(':')[0]);
      const frequencyMinutes = this.breakConfig.frequency;
      
      let currentTime = new Date();
      currentTime.setHours(startHour, 0, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, 0, 0, 0);
      
      const now = new Date();
      
      while (currentTime < endTime) {
        currentTime = new Date(currentTime.getTime() + frequencyMinutes * 60000);
        
        if (currentTime < endTime) {
          const timeString = currentTime.toTimeString().slice(0, 5);
          const isPast = currentTime < now;
          const isUpcoming = currentTime > now && !schedule.some(s => s.isUpcoming);
          
          schedule.push({
            time: timeString,
            isPast: isPast,
            isUpcoming: isUpcoming,
            completed: isPast && Math.random() > 0.3 // 70% compliance simulado
          });
        }
      }
      
      this.todaySchedule = schedule;
    },

    toggleActiveBreaks() {
      this.breakConfig.isActive = !this.breakConfig.isActive;
      this.saveToLocalStorage();
      this.generateTodaySchedule();
    },

    updateFrequency(frequency) {
      this.breakConfig.frequency = frequency;
      this.saveToLocalStorage();
      this.generateTodaySchedule();
    },

    updateDuration(duration) {
      this.breakConfig.duration = duration;
      this.saveToLocalStorage();
      this.showSuccessMessage();
    },

    updateWorkingHours() {
      this.saveToLocalStorage();
      this.generateTodaySchedule();
    },

    toggleWorkingDay(day) {
      const index = this.breakConfig.settings.workingDays.indexOf(day);
      if (index > -1) {
        this.breakConfig.settings.workingDays.splice(index, 1);
      } else {
        this.breakConfig.settings.workingDays.push(day);
      }
      this.saveToLocalStorage();
      this.generateTodaySchedule();
    },

    saveToLocalStorage() {
      // Guardar configuración en localStorage
      localStorage.setItem('neurozen_active_breaks_config', JSON.stringify(this.breakConfig));
      this.showSuccessMessage();
    },

    loadFromLocalStorage() {
      // Cargar configuración desde localStorage
      const saved = localStorage.getItem('neurozen_active_breaks_config');
      if (saved) {
        this.breakConfig = { ...this.breakConfig, ...JSON.parse(saved) };
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
  background: linear-gradient(135deg, #426339 0%, #307223 100%);
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
  color: #047213;
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
  color: #05630d;
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
  color: #077911;
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

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark">
    <div class="flex flex-col min-h-screen">
      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 md:p-8">
        <div class="max-w-4xl mx-auto">            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center min-h-96">
              <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
            
            <!-- Debug Login Button -->
            <div v-if="!stressData && !isLoading" class="text-center mb-8 p-4 bg-yellow-100 rounded-lg">
              <h3 class="text-lg font-bold mb-2">🐛 Modo Debug</h3>
              <p class="mb-4">No se encontraron datos de estrés. ¿Necesitas hacer login?</p>
              <button 
                @click="debugLogin"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Login Usuario Demo
              </button>
              <button 
                @click="loadStressData"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Recargar Datos
              </button>
            </div><!-- Error State -->
            <div v-else-if="errorMessage" class="text-center">
              <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ errorMessage }}
              </div>
              <button 
                @click="loadStressData"
                class="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90"
              >
                {{ $t('common.retry') }}
              </button>
            </div>

          <!-- Dashboard Content -->
          <div v-else>
            <!-- Welcome Section -->
            <div class="mb-8">
              <h1 class="text-3xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">
                {{ $t('dashboard.welcome') }}, {{ userName }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t('app.tagline') }}
              </p>
            </div>

            <!-- Quick Actions -->
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
                {{ $t('dashboard.quickActions.title') }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  @click="$router.push('/book-session')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-brain text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('dashboard.quickActions.bookSession') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('professionals.booking.title') }}</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="$router.push('/profile')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-user text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('dashboard.quickActions.viewProfile') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('profile.title') }}</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="$router.push('/settings')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-cog text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('dashboard.quickActions.settings') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('settings.title') }}</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="$router.push('/stress/breathing')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-wind text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('dashboard.quickActions.breathingExercise') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('stress.breathing.title') }}</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="$router.push('/stress/active-breaks')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-pause text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('dashboard.quickActions.activeBreaks') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('stress.activeBreaks.title') }}</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="$router.push('/stress/triggers')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-chart-line text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('dashboard.quickActions.stressLevel') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('stress.triggers.title') }}</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="$router.push('/subscriptions')"
                  class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                >
                  <div class="flex items-center gap-3">
                    <i class="fas fa-credit-card text-primary text-2xl"></i>
                    <div class="text-left">
                      <h3 class="font-semibold">{{ $t('navigation.subscriptions') }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('subscriptions.plans.title') }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <h2 class="text-3xl font-bold mb-6 text-foreground-light dark:text-foreground-dark">
              {{ $t('dashboard.stats.title') }}
            </h2>

            <!-- Period Toggle -->
            <div class="mb-6">
              <div class="flex bg-primary/10 dark:bg-primary/20 rounded-full p-1 relative">
                <!-- Loading indicator sin mensaje -->
                <div v-if="isChangingPeriod" class="absolute inset-0 bg-primary/5 rounded-full flex items-center justify-center z-10">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
                
                <label 
                  v-for="period in periods" 
                  :key="period.value"
                  class="flex-1 text-center cursor-pointer py-2 px-4 rounded-full transition-colors duration-300"
                  :class="[
                    selectedPeriod === period.value ? 'bg-primary text-white' : 'text-primary',
                    isChangingPeriod ? 'pointer-events-none opacity-50' : ''
                  ]"
                >
                  <span class="font-medium">{{ $t(`dashboard.periods.${period.value}`) }}</span>
                  <input 
                    v-model="selectedPeriod"
                    :value="period.value"
                    :disabled="isChangingPeriod"
                    class="sr-only" 
                    name="period" 
                    type="radio"
                  />
                </label>
              </div>
              
              <!-- Mensaje de estado -->
              <div v-if="isChangingPeriod" class="text-center mt-2">
                <p class="text-xs text-primary/80">
                  Actualizando datos... Disponible en 
                  <span class="font-bold">{{ Math.ceil(disableCountdown) }}</span> segundo{{ Math.ceil(disableCountdown) !== 1 ? 's' : '' }}
                </p>
                <!-- Barra de progreso -->
                <div class="w-24 h-1 bg-primary/20 rounded-full mx-auto mt-1 overflow-hidden">
                  <div 
                    class="h-full bg-primary rounded-full transition-all duration-100"
                    :style="{ width: `${(1 - disableCountdown) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Stress Level Chart -->
            <div class="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg mb-6">
              <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <p class="text-lg font-medium text-primary">{{ $t('dashboard.chart.stressLevel') }}</p>
                  <p class="text-5xl font-bold" :class="getStressLevelColor()">
                    {{ stressData?.currentLevel || 0 }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-sm text-primary/80 dark:text-primary/90">
                      {{ $t(`dashboard.periodTexts.${selectedPeriod}`) }}
                    </p>
                    <p class="text-sm font-medium flex items-center"
                       :class="(stressData?.weeklyChange || 0) < 0 ? 'text-green-600' : 'text-red-600'">
                      <i class="fas text-base mr-1"
                         :class="(stressData?.weeklyChange || 0) < 0 ? 'fa-arrow-down' : 'fa-arrow-up'"></i>
                      {{ Math.abs(stressData?.weeklyChange || 0) }}%
                    </p>
                  </div>
                  <!-- Stress Level Indicator -->
                  <div class="mt-3">
                    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-1000"
                        :class="getStressBarColor()"
                        :style="{ width: `${stressData?.currentLevel || 0}%` }"
                      ></div>
                    </div>
                    <p class="text-xs mt-1 font-medium" :class="getStressLevelColor()">
                      {{ getStressLevelText() }}
                    </p>
                  </div>
                </div>
                
<!-- Chart Area -->
<div class="w-full md:w-3/5">
                  <StressLevelChart
                    ref="stressChart"
                    :chart-data="chartData"
                    :period="selectedPeriod"
                    :average-stress="stressData?.average || 50"
                    :is-loading="false"
                    :error="errorMessage"
                    :chart-width="400"
                    :chart-height="150"
                  />
                  <canvas ref="stressChart" width="400" height="150" class="max-w-full"></canvas>
                  <div class="flex justify-between mt-2 text-xs font-bold text-primary/80 dark:text-primary/90">
                    <span v-for="dataPoint in stressData.weeklyData" :key="dataPoint.day">
                      {{ 
                        dataPoint.day.includes(":") ? dataPoint.day : $t(`common.days.${dataPoint.day}`)  
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg">
                <p class="text-lg font-medium text-primary">{{ $t('dashboard.chart.averageStress') }}</p>
                <p class="text-4xl font-bold mt-2 text-foreground-light dark:text-foreground-dark">
                  {{ stressData?.average || 0 }}
                </p>
              </div>
              <div class="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg">
                <p class="text-lg font-medium text-primary">{{ $t('dashboard.chart.peakStressHours') }}</p>
                <p class="text-4xl font-bold mt-2 text-foreground-light dark:text-foreground-dark">
                  {{ stressData?.peakHours || '--' }}
                </p>
              </div>
            </div>

            <!-- Insights -->
            <div class="mb-8">
              <p class="text-base leading-relaxed text-foreground-light/90 dark:text-foreground-dark/90">
                {{ getInsightText() }}
              </p>
            </div>

            <!-- Quick Actions -->
            <div class="mb-8">
              <h3 class="text-2xl font-bold mb-6 text-foreground-light dark:text-foreground-dark">
                {{ $t('dashboard.tools.title') }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Register Trigger -->
                <div 
                  @click="$router.push('/stress/triggers')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.registerTrigger.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.registerTrigger.description') }}
                    </p>
                  </div>
                </div>

                <!-- Active Breaks -->
                <div 
                  @click="$router.push('/stress/active-breaks')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-clock text-green-600 dark:text-green-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.activeBreaks.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.activeBreaks.description') }}
                    </p>
                  </div>
                </div>

                <!-- Breathing Session -->
                <div 
                  @click="$router.push('/stress/breathing')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-wind text-blue-600 dark:text-blue-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.breathingSession.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.breathingSession.description') }}
                    </p>
                  </div>
                </div>

                <!-- Resource Library -->
                <div 
                  @click="$router.push('/stress/resources')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-book text-purple-600 dark:text-purple-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.resourceLibrary.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.resourceLibrary.description') }}
                    </p>
                  </div>
                </div>

                <!-- Book Session -->
                <div 
                  @click="$router.push('/book-session')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-calendar-plus text-indigo-600 dark:text-indigo-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.bookSession.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.bookSession.description') }}
                    </p>
                  </div>
                </div>

                <!-- User Profile -->
                <div 
                  @click="$router.push('/profile')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-user text-teal-600 dark:text-teal-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.myProfile.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.myProfile.description') }}
                    </p>
                  </div>
                </div>

                <!-- Settings -->
                <div 
                  @click="$router.push('/settings')"
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/40"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <i class="fas fa-cog text-gray-600 dark:text-gray-400 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                      {{ $t('dashboard.tools.settings.title') }}
                    </h4>
                    <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                      {{ $t('dashboard.tools.settings.description') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
/**
 * DashboardComponent - Componente principal del dashboard de NeuroZen
 * Muestra estadísticas de estrés, acciones rápidas y gráficos interactivos
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { DashboardService } from '../../services/DashboardService.js';
import StressLevelChart from './StressLevelChart.vue';

export default {
  name: 'DashboardComponent',
  components: {
    StressLevelChart
  },
  data() {
    return {
      stressData: null,
      isLoading: true,
      errorMessage: '',
      dashboardService: null,
      selectedPeriod: 'week',
      periods: [
        { value: 'day' },
        { value: 'week' },
        { value: 'month' }
      ],
      refreshInterval: null, // Para actualizaciones automáticas
      periodChangeTimeout: null, // Para debounce de cambios de período
      isChangingPeriod: false, // Flag para evitar cambios concurrentes
      disableCountdown: 0 // Contador para mostrar segundos restantes
    };
  },
  computed: {
    /**
     * Obtiene el nombre del usuario actual desde localStorage
     * @returns {string} Nombre del usuario o 'Usuario' por defecto
     */
    userName() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.name || 'Usuario';
    },

    /**
     * Obtiene los datos del gráfico según el período seleccionado
     * @returns {Array} Datos formateados para el gráfico
     */
    chartData() {
      const data = this.stressData?.weeklyData || [];
      console.log('🔍 Chart data computed:', data, 'for period:', this.selectedPeriod);
      return data;
    }
  },

  watch: {
    /**
     * Observa cambios en el período seleccionado
     * Actualiza los datos cuando el usuario cambia el período
     */
    selectedPeriod: {
      handler(newPeriod, oldPeriod) {
        if (newPeriod !== oldPeriod && oldPeriod !== undefined) {
          console.log('🔄 Period change requested from', oldPeriod, 'to', newPeriod);
          
          // Si ya hay un cambio en progreso, ignorar completamente
          if (this.isChangingPeriod) {
            console.log('🚫 Period change blocked - already in progress');
            // Revertir el cambio en el UI
            this.$nextTick(() => {
              this.selectedPeriod = oldPeriod;
            });
            return;
          }
          
          // Cancelar cualquier cambio pendiente
          if (this.periodChangeTimeout) {
            clearTimeout(this.periodChangeTimeout);
            this.periodChangeTimeout = null;
          }
          
          // Ejecutar el cambio inmediatamente
          this.handlePeriodChange(newPeriod);
        }
      },
      immediate: false
    }
  },
  async created() {
    this.dashboardService = new DashboardService();
    await this.loadStressData();
    
    // Configurar actualización automática cada 5 minutos para datos realistas
    this.setupAutoRefresh();
  },
  beforeUnmount() {
    // Cleanup intervals and timeouts
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.periodChangeTimeout) {
      clearTimeout(this.periodChangeTimeout);
    }
  },
  methods: {
    /**
     * Carga los datos de estrés del usuario desde el servicio
     * Maneja estados de carga y errores
     */
    async loadStressData() {
      console.log('📊 Loading stress data...');
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        this.stressData = await this.dashboardService.getStressData();
        console.log('✅ Stress data loaded:', this.stressData);
      } catch (error) {
        console.error('❌ Error loading stress data:', error);
        this.errorMessage = this.$t('dashboard.errors.loadingData', { error: error.message });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Maneja el cambio de período en las estadísticas (método legacy)
     * Redirige al nuevo método con protecciones
     */
    async onPeriodChange() {
      return this.handlePeriodChange(this.selectedPeriod);
    },

    /**
     * Actualiza los datos de estrés sin mostrar estado de carga
     * Para actualizaciones automáticas en segundo plano
     */
    async refreshStressData() {
      try {
        const newData = await this.dashboardService.updateStressPeriod(this.selectedPeriod);
        
        // Solo actualizar si hay cambios significativos
        if (this.hasSignificantChange(newData)) {
          this.stressData = newData;
        }
      } catch (error) {
        console.warn('Error refreshing stress data:', error.message);
      }
    },

    /**
     * Configura la actualización automática de datos
     * Simula datos en tiempo real actualizando cada cierto tiempo
     */
    setupAutoRefresh() {
      // Actualizar datos cada 5 minutos solo para el período 'day'
      this.refreshInterval = setInterval(() => {
        if (this.selectedPeriod === 'day') {
          this.refreshStressData();
        }
      }, 300000); // 5 minutos
    },

    /**
     * Verifica si hay cambios significativos en los datos
     * @param {Object} newData - Nuevos datos para comparar
     * @returns {boolean} True si hay cambios significativos
     */
    hasSignificantChange(newData) {
      if (!this.stressData || !newData) return true;
      
      const threshold = 5; // Cambio mínimo del 5% para actualizar
      const currentAvg = this.stressData.average;
      const newAvg = newData.average;
      
      return Math.abs(currentAvg - newAvg) >= threshold;
    },

    getInsightText() {
      if (!this.stressData) return '';
      
      const change = this.stressData.weeklyChange;
      
      if (change < 0) {
        return this.$t('dashboard.insights.decreased', {
          percentage: Math.abs(change),
          peakHours: this.stressData.peakHours
        });
      } else {
        return this.$t('dashboard.insights.increased', {
          percentage: change,
          peakHours: this.stressData.peakHours
        });
      }
    },

    /**
     * Obtiene el color del texto según el nivel de estrés
     * @returns {string} Clases CSS para el color
     */
    getStressLevelColor() {
      if (!this.stressData || this.stressData.currentLevel == null) return 'text-foreground-light dark:text-foreground-dark';
      
      const level = this.stressData.currentLevel;
      
      if (level <= 40) {
        return 'text-green-600 dark:text-green-400';
      } else if (level <= 70) {
        return 'text-yellow-600 dark:text-yellow-400';
      } else {
        return 'text-red-600 dark:text-red-400';
      }
    },

    /**
     * Obtiene el color de la barra de progreso según el nivel de estrés
     * @returns {string} Clases CSS para el color de fondo
     */
    getStressBarColor() {
      if (!this.stressData || this.stressData.currentLevel == null) return 'bg-primary';
      
      const level = this.stressData.currentLevel;
      
      if (level <= 40) {
        return 'bg-green-500';
      } else if (level <= 70) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    },

    /**
     * Obtiene el texto descriptivo del nivel de estrés
     * @returns {string} Texto descriptivo
     */
    getStressLevelText() {
      if (!this.stressData || this.stressData.currentLevel == null) return '';
      
      const level = this.stressData.currentLevel;
      
      if (level <= 30) {
        return this.$t('dashboard.stressLevels.veryLow');
      } else if (level <= 50) {
        return this.$t('dashboard.stressLevels.low');
      } else if (level <= 70) {
        return this.$t('dashboard.stressLevels.moderate');
      } else if (level <= 85) {
        return this.$t('dashboard.stressLevels.high');
      } else {
        return this.$t('dashboard.stressLevels.veryHigh');
      }
    },

    /**
     * Login debug para testing
     */
    debugLogin() {
      const demoUser = {
        id: "2",
        name: "Usuario Demo",
        email: "user@example.com",
        role: "user"
      };
      
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('authToken', 'demo-token-456');
      
      console.log('🐛 Debug login successful:', demoUser);
      
      // Recargar datos
      this.loadStressData();
    },

    /**
     * Maneja el cambio de período con protección contra cambios rápidos
     */
    async handlePeriodChange(newPeriod) {
      // Verificar si ya hay un cambio en progreso
      if (this.isChangingPeriod) {
        console.log('🚫 Ignoring period change - already in progress');
        return;
      }
      
      // Marcar como en progreso y deshabilitar por 1 segundo
      this.isChangingPeriod = true;
      this.disableCountdown = 1;
      this.errorMessage = '';
      
      try {
        console.log('🔄 Starting period change to:', newPeriod);
        
        // Pequeña pausa para evitar conflictos
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const newData = await this.dashboardService.updateStressPeriod(newPeriod);
        
        // Verificar que el período no haya cambiado mientras esperábamos
        if (this.selectedPeriod === newPeriod) {
          this.stressData = newData;
          console.log('✅ Period successfully updated to:', newPeriod, 'Data:', newData);
        } else {
          console.log('⚠️ Period changed during update, discarding result');
        }
        
      } catch (error) {
        console.error('❌ Error updating period:', error);
        this.errorMessage = this.$t('dashboard.errors.updatingData', { error: error.message });
      } finally {
        // Contador descendente visual
        const countdown = setInterval(() => {
          this.disableCountdown--;
          if (this.disableCountdown <= 0) {
            clearInterval(countdown);
          }
        }, 100);
        
        // Mantener deshabilitado por 1 segundo completo
        setTimeout(() => {
          this.isChangingPeriod = false;
          this.disableCountdown = 0;
          console.log('✅ Period change re-enabled');
        }, 1000); // 1 segundo de disable
        
        // Limpiar el timeout
        if (this.periodChangeTimeout) {
          clearTimeout(this.periodChangeTimeout);
          this.periodChangeTimeout = null;
        }
      }
    },

    /**
     * Fuerza la inicialización del gráfico
     */
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Manrope', sans-serif;
}
</style>

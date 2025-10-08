<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark">
    <div class="flex flex-col min-h-screen">
      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 md:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center min-h-96">
            <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>            <!-- Error State -->
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
              </div>
            </div>

            <h2 class="text-3xl font-bold mb-6 text-foreground-light dark:text-foreground-dark">
              {{ $t('dashboard.stats.title') }}
            </h2>

            <!-- Period Toggle -->
            <div class="mb-6">
              <div class="flex bg-primary/10 dark:bg-primary/20 rounded-full p-1">
                <label 
                  v-for="period in periods" 
                  :key="period.value"
                  class="flex-1 text-center cursor-pointer py-2 px-4 rounded-full transition-colors duration-300"
                  :class="selectedPeriod === period.value ? 'bg-primary text-white' : 'text-primary'"
                >
                  <span class="font-medium">{{ $t(`dashboard.periods.${period.value}`) }}</span>
                  <input 
                    v-model="selectedPeriod"
                    :value="period.value"
                    @change="onPeriodChange"
                    class="sr-only" 
                    name="period" 
                    type="radio"
                  />
                </label>
              </div>
            </div>

            <!-- Stress Level Chart -->
            <div class="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg mb-6">
              <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <p class="text-lg font-medium text-primary">{{ $t('dashboard.chart.stressLevel') }}</p>
                  <p class="text-5xl font-bold text-foreground-light dark:text-foreground-dark">
                    {{ stressData.currentLevel }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-sm text-primary/80 dark:text-primary/90">
                      {{ $t(`dashboard.periodTexts.${selectedPeriod}`) }}
                    </p>
                    <p class="text-sm font-medium flex items-center"
                       :class="stressData.weeklyChange < 0 ? 'text-green-600' : 'text-red-600'">
                      <i class="fas text-base"
                         :class="stressData.weeklyChange < 0 ? 'fa-arrow-down' : 'fa-arrow-up'"></i>
                      {{ Math.abs(stressData.weeklyChange) }}%
                    </p>
                  </div>
                </div>
                
                <!-- Chart Area -->
                <div class="w-full md:w-3/5">
                  <canvas ref="stressChart" width="400" height="150" class="max-w-full"></canvas>
                  <div class="flex justify-between mt-2 text-xs font-bold text-primary/80 dark:text-primary/90">
                    <span v-for="dataPoint in stressData.weeklyData" :key="dataPoint.day">
                      {{ $t(`common.days.${dataPoint.day}`) }}
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
                  {{ stressData.average }}
                </p>
              </div>
              <div class="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg">
                <p class="text-lg font-medium text-primary">{{ $t('dashboard.chart.peakStressHours') }}</p>
                <p class="text-4xl font-bold mt-2 text-foreground-light dark:text-foreground-dark">
                  {{ stressData.peakHours }}
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
                  @click="$router.push('/stress/register-trigger')"
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
                  @click="$router.push('/stress/breathing-session')"
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
                  @click="$router.push('/resources')"
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

import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { DashboardService } from '../../services/DashboardService.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default {
  name: 'DashboardComponent',
  data() {
    return {
      stressData: null,
      isLoading: true,
      errorMessage: '',
      dashboardService: null,
      stressChart: null, // Chart.js instance
      selectedPeriod: 'week',
      periods: [
        { value: 'day' },
        { value: 'week' },
        { value: 'month' }
      ]
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
    }
  },
  async created() {
    this.dashboardService = new DashboardService();
    await this.loadStressData();
  },
  async mounted() {
    // Initialize chart after component is mounted
    this.$nextTick(() => {
      if (this.stressData) {
        this.initializeChart();
      }
    });
  },
  beforeUnmount() {
    // Cleanup chart instance
    if (this.stressChart) {
      this.stressChart.destroy();
    }
  },
  methods: {
    /**
     * Carga los datos de estrés del usuario desde el servicio
     * Maneja estados de carga y errores
     */
    async loadStressData() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        this.stressData = await this.dashboardService.getStressData();
        // Update chart after data is loaded
        this.$nextTick(() => {
          this.updateChart();
        });
      } catch (error) {
        this.errorMessage = this.$t('dashboard.errors.loadingData', { error: error.message });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Maneja el cambio de período en las estadísticas
     * Actualiza los datos y el gráfico según el período seleccionado
     */
    async onPeriodChange() {
      this.isLoading = true;
      try {
        this.stressData = await this.dashboardService.updateStressPeriod(this.selectedPeriod);
        // Update chart with new data
        this.$nextTick(() => {
          this.updateChart();
        });
      } catch (error) {
        this.errorMessage = this.$t('dashboard.errors.updatingData', { error: error.message });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Inicializa el gráfico de Chart.js con los datos de estrés
     * Configura el estilo y las opciones del gráfico
     */
    initializeChart() {
      if (!this.$refs.stressChart || !this.stressData) return;
      
      const ctx = this.$refs.stressChart.getContext('2d');
      
      this.stressChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.stressData.weeklyData.map(d => this.$t(`common.days.${d.day}`)),
          datasets: [{
            label: this.$t('dashboard.chart.stressLevel'),
            data: this.stressData.weeklyData.map(d => d.value),
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4F46E5',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1F2937',
              titleColor: '#F9FAFB',
              bodyColor: '#F9FAFB',
              borderColor: '#4F46E5',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                title: (context) => {
                  return `${context[0].label}`;
                },
                label: (context) => {
                  return `${this.$t('dashboard.chart.stressLevelShort')}: ${context.parsed.y}/10`;
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            y: {
              display: false,
              min: 0,
              max: 10
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          elements: {
            point: {
              hoverBackgroundColor: '#4F46E5',
              hoverBorderColor: '#fff',
              hoverBorderWidth: 3
            }
          }
        }
      });
    },

    updateChart() {
      if (!this.stressChart || !this.stressData) return;
      
      this.stressChart.data.labels = this.stressData.weeklyData.map(d => this.$t(`common.days.${d.day}`));
      this.stressChart.data.datasets[0].data = this.stressData.weeklyData.map(d => d.value);
      this.stressChart.update('active');
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
    }
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Manrope', sans-serif;
}
</style>

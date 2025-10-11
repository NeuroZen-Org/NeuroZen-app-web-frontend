<template>
    <div class="w-full chart-wrapper">
      <!-- Chart Container -->
      <div class="chart-container">
        <canvas 
          ref="chartCanvas" 
          width="400"
          height="200"
          class="max-w-full"
          style="display: block;"
        ></canvas>
      </div>
      
      <!-- Chart Labels -->
      <div v-if="chartData && chartData.length > 0" class="flex justify-between mt-2 text-xs font-bold text-primary/80 dark:text-primary/90">
        <span v-for="dataPoint in chartData" :key="dataPoint.day" class="text-center flex-1">
          {{ formatLabel(dataPoint.day) }}
        </span>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      
      <!-- Error State -->
      <div v-if="error" class="text-center text-red-500 text-sm mt-4">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js';
  
  // Register Chart.js components
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  export default {
    name: 'StressLevelChart',
    props: {
      chartData: {
        type: Array,
        required: true,
        default: () => []
      },
      period: {
        type: String,
        required: true,
        default: 'week'
      },
      averageStress: {
        type: Number,
        default: 50
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      error: {
        type: String,
        default: null
      },
      chartWidth: {
        type: Number,
        default: 400
      },
      chartHeight: {
        type: Number,
        default: 150
      }
    },
    data() {
      return {
        chart: null,
        isInitializing: false,
        initTimeout: null
      };
    },
    computed: {
      /**
       * Obtiene los colores del gráfico según el nivel de estrés promedio
       */
      chartColors() {
        const avg = this.averageStress;
        
        if (avg <= 40) {
          return { 
            border: '#10B981', 
            background: 'rgba(16, 185, 129, 0.1)',
            gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']
          };
        } else if (avg <= 70) {
          return { 
            border: '#F59E0B', 
            background: 'rgba(245, 158, 11, 0.1)',
            gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)']
          };
        } else {
          return { 
            border: '#EF4444', 
            background: 'rgba(239, 68, 68, 0.1)',
            gradient: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)']
          };
        }
      }
    },
  watch: {
    chartData: {
      handler(newData, oldData) {
        console.log('📊 Chart data changed:', newData);
        console.log('📊 Old data:', oldData);
        console.log('📊 Period:', this.period);
        
        if (newData && newData.length > 0) {
          // Cancelar inicialización pendiente
          if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
          }
          
          // Evitar inicializaciones concurrentes
          if (this.isInitializing) {
            console.log('⚠️ Chart initialization already in progress');
            return;
          }
          
          this.$nextTick(() => {
            if (this.chart && !this.chart.destroyed) {
              console.log('🔄 Updating existing chart...');
              this.updateChart();
            } else {
              console.log('🚀 Initializing new chart...');
              this.initializeChart();
            }
          });
        }
      },
      deep: true,
      immediate: true // Cambiar a true para inicialización inicial
    },
    period: {
      handler(newPeriod, oldPeriod) {
        console.log('📅 Period changed from', oldPeriod, 'to', newPeriod);
        
        // Reinicializar siempre que cambie el período, sin importar si hay datos
        if (newPeriod !== oldPeriod && oldPeriod !== undefined) {
          // Cancelar inicialización pendiente
          if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
          }
          
          // Evitar reinicializaciones concurrentes
          if (this.isInitializing) {
            console.log('⚠️ Chart initialization already in progress for period change');
            return;
          }
          
          // Reinicializar inmediatamente para cambios de período
          this.$nextTick(() => {
            console.log('🔄 Forcing chart reinitialization for period change...');
            this.initializeChart();
          });
        }
      },
      immediate: false
    }
  },
    mounted() {
      console.log('🚀 Chart component mounted');
      // Initialize chart with a delay to ensure DOM is ready
      this.$nextTick(() => {
        this.initTimeout = setTimeout(() => {
          if (this.chartData && this.chartData.length > 0) {
            console.log('🚀 Chart mounted with data:', this.chartData);
            this.initializeChart();
          } else {
            console.log('⚠️ Chart mounted but no data available yet');
          }
        }, 150); // Delay más largo para estabilidad
      });
    },
    beforeUnmount() {
      // Limpiar timeouts
      if (this.initTimeout) {
        clearTimeout(this.initTimeout);
      }
      
      // Limpiar flag
      this.isInitializing = false;
      
      // Destruir gráfico
      if (this.chart && !this.chart.destroyed) {
        try {
          this.chart.destroy();
        } catch (error) {
          console.warn('Error destroying chart on unmount:', error);
        }
      }
    },
    methods: {
      /**
       * Inicializa el gráfico Chart.js con protección contra llamadas concurrentes
       */
      initializeChart() {
        console.log('🔧 Starting chart initialization...');
        
        // Evitar inicializaciones concurrentes
        if (this.isInitializing) {
          console.log('⚠️ Chart initialization already in progress, skipping');
          return;
        }
        
        if (!this.$refs.chartCanvas) {
          console.warn('⚠️ Canvas ref not available');
          return;
        }
        
        if (!this.chartData || this.chartData.length === 0) {
          console.warn('⚠️ No chart data available');
          return;
        }
        
        // Marcar como inicializando
        this.isInitializing = true;
        
        const canvas = this.$refs.chartCanvas;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.warn('⚠️ Canvas context not available');
          this.isInitializing = false;
          return;
        }
        
        // Destroy existing chart if it exists
        if (this.chart && !this.chart.destroyed) {
          console.log('🗑️ Destroying existing chart...');
          try {
            this.chart.destroy();
          } catch (error) {
            console.warn('Error destroying chart:', error);
          }
          this.chart = null;
        }
        
        // Small delay to ensure DOM is ready and avoid race conditions
        setTimeout(() => {
          try {
            this.createChart(ctx);
          } finally {
            // Siempre limpiar el flag
            this.isInitializing = false;
          }
        }, 100); // Aumentado a 100ms para más estabilidad
      },
  
      /**
       * Crea el gráfico Chart.js
       */
      createChart(ctx) {
        // Prepare data
        const labels = this.chartData.map(d => this.formatLabel(d.day));
        const values = this.chartData.map(d => d.value);
        
        console.log('📊 Creating chart with labels:', labels, 'values:', values);
        
        const chartData = {
          labels: labels,
          datasets: [{
            label: 'Stress Level',
            data: values,
            fill: true,
            borderColor: this.chartColors.border,
            backgroundColor: this.createGradient(),
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 0,
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent'
          }]
        };
        
        const config = {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 500,
              easing: 'easeInOutQuart'
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: this.chartColors.border,
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: false,
                callbacks: {
                  title: (context) => {
                    return context[0].label;
                  },
                  label: (context) => {
                    return `Stress: ${context.parsed.y}%`;
                  }
                }
              }
            },
            scales: {
              x: {
                display: false,
                grid: {
                  display: false
                }
              },
              y: {
                display: false,
                min: 0,
                max: 100,
                grid: {
                  display: false
                }
              }
            },
            elements: {
              line: {
                tension: 0.4
              }
            }
          }
        };
        
        try {
          this.chart = new Chart(ctx, config);
          console.log('✅ Chart created successfully');
        } catch (error) {
          console.error('❌ Error creating chart:', error);
        }
      },
      /**
     * Actualiza el gráfico con nuevos datos sin recrearlo
     */
    updateChart() {
      if (!this.chart || this.chart.destroyed) {
        console.log('🔄 Chart not available, reinitializing...');
        this.initializeChart();
        return;
      }
      
      if (!this.chartData || this.chartData.length === 0) {
        console.warn('⚠️ No data to update chart');
        return;
      }
      
      console.log('🔄 Updating chart data...');
      
      // Prepare new data
      const labels = this.chartData.map(d => this.formatLabel(d.day));
      const values = this.chartData.map(d => d.value);
      
      console.log('🔄 Updating chart with labels:', labels, 'values:', values);
      
      // Update chart data
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;
      this.chart.data.datasets[0].borderColor = this.chartColors.border;
      
      // Recrear el gradiente para asegurar que se actualice correctamente
      try {
        this.chart.data.datasets[0].backgroundColor = this.createGradient();
      } catch (error) {
        console.warn('Error updating gradient, using fallback:', error);
        this.chart.data.datasets[0].backgroundColor = this.chartColors.background;
      }
      
      // Animate the update
      this.chart.update('active');
      console.log('✅ Chart updated successfully');
    },
  
      /**
       * Formatea las etiquetas según el período
       */
      formatLabel(day) {
        if (this.period === 'day') {
          return day; // Retorna las horas directamente (06:00, 09:00, etc.)
        } else if (this.period === 'month') {
          // Para períodos mensuales, formatear como "Semana 1", "Semana 2", etc.
          const weekMap = {
            'week1': 'Week 1',
            'week2': 'Week 2', 
            'week3': 'Week 3',
            'week4': 'Week 4'
          };
          return weekMap[day] || day;
        } else {
          // Para días de la semana, usar etiquetas cortas
          const dayMap = {
            'monday': 'Mon',
            'tuesday': 'Tue',
            'wednesday': 'Wed',
            'thursday': 'Thu',
            'friday': 'Fri',
            'saturday': 'Sat',
            'sunday': 'Sun'
          };
          return dayMap[day] || day;
        }
      },
  
      /**
       * Crea un gradiente para el fondo del gráfico
       */
      createGradient() {
        if (!this.$refs.chartCanvas || !this.chart) {
          console.log('📊 Using solid color fallback');
          return this.chartColors.background;
        }
        
        try {
          const ctx = this.$refs.chartCanvas.getContext('2d');
          if (!ctx) {
            console.warn('Canvas context not available for gradient');
            return this.chartColors.background;
          }
          
          const gradient = ctx.createLinearGradient(0, 0, 0, 150);
          gradient.addColorStop(0, this.chartColors.gradient[0]);
          gradient.addColorStop(1, this.chartColors.gradient[1]);
          
          return gradient;
        } catch (error) {
          console.warn('Error creating gradient:', error);
          return this.chartColors.background;
        }
      },
  
      /**
       * Fuerza la re-inicialización del gráfico (método público)
       */
      forceInit() {
        this.initializeChart();
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    height: 150px;
    min-height: 150px;
  }
  
  canvas {
    width: 100% !important;
    height: auto !important;
  }
  
  /* Ensure the chart is visible */
  .chart-wrapper {
    background: transparent;
    border-radius: 8px;
    overflow: hidden;
  }
  </style>
  
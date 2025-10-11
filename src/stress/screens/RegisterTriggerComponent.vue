<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-6 md:p-8">
        <!-- Header -->
        <header class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <i class="fas fa-brain text-lg"></i>
            </div>
            <h1 class="text-xl font-bold text-content-light dark:text-content-dark">NeuroZen</h1>
          </div>
          <button 
            @click="$router.go(-1)"
            class="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
          >
            <i class="fas fa-arrow-left text-primary"></i>
          </button>
        </header>

        <!-- Main Content -->
        <main>
          <h2 class="text-2xl font-bold text-center text-content-light dark:text-content-dark mb-2">
            {{ $t('stress.triggers.title') }}
          </h2>
          <p class="text-center text-content-light/80 dark:text-content-dark/80 mb-8">
            {{ $t('stress.triggers.subtitle') }}
          </p>

          <!-- Success Message -->
          <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {{ $t('stress.triggers.successMessage') }}
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ $t('stress.triggers.errorMessage') }}
          </div>

          <!-- Form -->
          <form @submit.prevent="submitTrigger" class="space-y-6">
            <!-- Date and Time -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-content-light dark:text-content-dark mb-2" for="fecha">
                  {{ $t('stress.triggers.date') }}
                </label>
                <input 
                  v-model="formData.date"
                  class="form-input w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-content-light dark:text-content-dark rounded-lg focus:ring-primary focus:border-primary"
                  id="fecha" 
                  type="date" 
                  required
                  :max="maxDate"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-content-light dark:text-content-dark mb-2" for="hora">
                  {{ $t('stress.triggers.time') }}
                </label>
                <input 
                  v-model="formData.time"
                  class="form-input w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-content-light dark:text-content-dark rounded-lg focus:ring-primary focus:border-primary"
                  id="hora" 
                  type="time" 
                  required
                />
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-content-light dark:text-content-dark mb-2" for="categoria">
                {{ $t('stress.triggers.category') }}
              </label>
              <select 
                v-model="formData.category"
                class="form-select w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-content-light dark:text-content-dark rounded-lg focus:ring-primary focus:border-primary"
                id="categoria"
                required
              >
                <option value="">{{ $t('stress.triggers.selectCategory') }}</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ $t(`stress.triggers.categories.${category}`) }}
                </option>
              </select>
            </div>

            <!-- Stress Level -->
            <div>
              <label class="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                {{ $t('stress.triggers.stressLevelLabel') }}
              </label>
              <div class="flex items-center gap-4">
                <span class="text-sm text-content-light dark:text-content-dark">1</span>
                <input 
                  v-model.number="formData.stressLevel"
                  type="range" 
                  min="1" 
                  max="10" 
                  class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style="background: linear-gradient(to right, #169c70 0%, #169c70 var(--value), #e5e7eb var(--value), #e5e7eb 100%)"
                  :style="{ '--value': (formData.stressLevel - 1) / 9 * 100 + '%' }"
                />
                <span class="text-sm text-content-light dark:text-content-dark">10</span>
                <span class="ml-2 text-lg font-bold text-primary">{{ formData.stressLevel }}</span>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-content-light dark:text-content-dark mb-2" for="descripcion">
                {{ $t('stress.triggers.situationLabel') }}
              </label>
              <textarea 
                v-model="formData.description"
                class="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-content-light dark:text-content-dark rounded-lg focus:ring-primary focus:border-primary resize-none"
                id="descripcion" 
                :placeholder="$t('stress.triggers.situationPlaceholder')" 
                rows="4"
                required
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="isSubmitting" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                {{ isSubmitting ? $t('common.saving') : $t('stress.triggers.save') }}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { StressTriggerService } from '../../services/StressTriggerService.js';

export default {
  name: 'RegisterTriggerComponent',
  data() {
    return {
      stressTriggerService: null,
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      maxDate: '',
      categories: [],
      formData: {
        date: '',
        time: '',
        category: '',
        description: '',
        stressLevel: 5
      }
    };
  },
  created() {
    this.stressTriggerService = new StressTriggerService();
    this.categories = this.stressTriggerService.getStressTriggerCategories();
    this.setDefaultDateTime();
    this.setMaxDate();
  },
  methods: {
    setDefaultDateTime() {
      const now = new Date();
      this.formData.date = now.toISOString().split('T')[0];
      this.formData.time = now.toTimeString().slice(0, 5);
    },

    setMaxDate() {
      const today = new Date();
      this.maxDate = today.toISOString().split('T')[0];
    },

    async submitTrigger() {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        const triggerData = {
          userId: currentUser.id || '1',
          date: this.formData.date,
          time: this.formData.time,
          category: this.formData.category,
          description: this.formData.description,
          stressLevel: this.formData.stressLevel
        };

        await this.stressTriggerService.addStressTrigger(triggerData);
        
        this.successMessage = this.$t('stress.triggers.successMessage');
        
        // Reset form
        this.formData = {
          date: '',
          time: '',
          category: '',
          description: '',
          stressLevel: 5
        };
        this.setDefaultDateTime();

        // Redirect after delay
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 2000);

      } catch (error) {
        this.errorMessage = this.$t('stress.triggers.errorMessage') + ': ' + error.message;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Manrope', sans-serif;
}

/* Custom range slider styling */
input[type="range"] {
  background: linear-gradient(to right, #169c70 0%, #169c70 var(--value, 50%), #e5e7eb var(--value, 50%), #e5e7eb 100%);
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #169c70;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #169c70;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <main class="flex flex-col items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-sm mx-auto flex flex-col items-center text-center">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="mb-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        
        <!-- Content -->
        <template v-else-if="onboardingStep">
          <div class="relative w-64 h-64 mb-8">
            <div class="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full"></div>
            <img 
              :alt="onboardingStep.title" 
              class="absolute inset-0 w-full h-full object-contain" 
              :src="onboardingStep.image"
            />
          </div>
          
          <h1 class="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
            {{ onboardingStep.title }}
          </h1>
          
          <p class="text-text-light dark:text-text-dark mb-8">
            {{ onboardingStep.description }}
          </p>
          
          <div class="flex items-center justify-center space-x-2 mb-8">
            <div 
              v-for="step in onboardingStep.totalSteps" 
              :key="step"
              :class="[
                'rounded-full',
                step === onboardingStep.step 
                  ? 'w-3 h-3 bg-primary' 
                  : 'w-2 h-2 bg-primary/30 dark:bg-primary/50'
              ]"
            ></div>
          </div>
          
          <button 
            @click="handleNext"
            class="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            Next
          </button>
        </template>
        
        <!-- Error state -->
        <div v-else-if="errorMessage" class="text-center">
          <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
          </div>
          <button 
            @click="loadOnboardingStep"
            class="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { OnboardingService } from '../../services/OnboardingService.js';

export default {
  name: 'OnboardingProfessionalComponent',
  data() {
    return {
      onboardingStep: null,
      isLoading: true,
      errorMessage: '',
      onboardingService: null
    };
  },
  async created() {
    this.onboardingService = new OnboardingService();
    await this.loadOnboardingStep();
  },
  methods: {
    async loadOnboardingStep() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // Get the third onboarding step
        this.onboardingStep = await this.onboardingService.getOnboardingStep(3);
      } catch (error) {
        this.errorMessage = 'Error al cargar el contenido: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    handleNext() {
      // Complete onboarding and navigate to dashboard
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Manrope', sans-serif;
}

.text-primary {
  color: #169c70;
}

.bg-primary {
  background-color: #169c70;
}

.bg-background-light {
  background-color: #F1E9D4;
}

.bg-background-dark {
  background-color: #2D5A4A;
}

.text-text-light {
  color: #2D5A4A;
}

.text-text-dark {
  color: #F1E9D4;
}

.hover\:bg-opacity-90:hover {
  background-color: rgba(22, 156, 112, 0.9);
}
</style>

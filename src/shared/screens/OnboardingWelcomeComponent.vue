<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="flex flex-col items-center justify-center min-h-screen p-6">
      <div class="w-full max-w-sm text-center">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="text-center mb-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        
        <!-- Content -->
        <div v-else-if="onboardingStep">
          <div class="mb-8 flex items-center justify-center">
            <div class="text-9xl">
              {{ onboardingStep.icon || '👋' }}
            </div>
          </div>
          
          <div class="px-4">
            <h1 class="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
              {{ $t('onboarding.steps.welcome') }}
            </h1>
            <p class="text-base text-text-light dark:text-text-dark/80 mb-12">
              {{ $t('onboarding.steps.welcomeDescription') }}
            </p>
          </div>
          
          <div class="px-4">
            <button 
              @click="handleGetStarted"
              class="w-full bg-primary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
              {{ $t('onboarding.buttons.getStarted') }}
            </button>
          </div>
        </div>
        
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
    </div>
  </div>
</template>

<script>
import { OnboardingService } from '../../services/OnboardingService.js';

export default {
  name: 'OnboardingWelcomeComponent',
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
        // Get the first onboarding step
        this.onboardingStep = await this.onboardingService.getOnboardingStep(1);
      } catch (error) {
        this.errorMessage = 'Error al cargar el contenido de bienvenida: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    handleGetStarted() {
      // Navigate to the next onboarding step
      this.$router.push('/onboarding/step/2');
    }
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Manrope', sans-serif;
}

.text-primary {
  color: #2D5A4A;
}

.bg-primary {
  background-color: #2D5A4A;
}

.bg-background-light {
  background-color: #F1E9D4;
}

.bg-background-dark {
  background-color: #11211c;
}

.text-text-light {
  color: #374151;
}

.text-text-dark {
  color: #E5E7EB;
}

.hover\:bg-primary\/90:hover {
  background-color: rgba(45, 90, 74, 0.9);
}

.focus\:ring-primary:focus {
  --tw-ring-color: #2D5A4A;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>

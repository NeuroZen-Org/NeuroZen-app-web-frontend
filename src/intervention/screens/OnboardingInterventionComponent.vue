<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="flex flex-col items-center justify-center min-h-screen p-6">
      <div class="w-full max-w-sm mx-auto flex flex-col h-full">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex-grow flex items-center justify-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        
        <!-- Content -->
        <template v-else-if="onboardingStep">
          <div class="flex-grow flex items-center justify-center">
            <div class="illustration-container">
              <div class="illustration-item item-1 shadow-lg"></div>
              <div class="illustration-item item-2 shadow-lg"></div>
              <div class="illustration-item item-3"></div>
            </div>
          </div>
          
          <div class="text-center pt-8 pb-6">
            <h1 class="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
              {{ $t('onboarding.steps.profile') }}
            </h1>
            <p class="text-text-light/80 dark:text-text-dark/80 px-4">
              {{ $t('onboarding.steps.profileDescription') }}
            </p>
          </div>
          
          <div class="w-full">
            <div class="flex justify-center items-center space-x-2 mb-8">
              <div 
                v-for="step in onboardingStep.totalSteps" 
                :key="step"
                :class="[
                  'rounded-full',
                  step === onboardingStep.step 
                    ? 'w-3 h-3 bg-primary' 
                    : 'w-2 h-2 bg-primary/30'
                ]"
              ></div>
            </div>
            
            <button 
              @click="handleNext"
              class="w-full bg-primary text-background-light dark:text-background-light font-bold py-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300 shadow-lg"
            >
              {{ $t('onboarding.buttons.next') }}
            </button>
            
            <a 
              class="block text-center mt-4 text-sm text-primary/80 dark:text-primary/90 font-medium cursor-pointer" 
              @click="handleSkip"
            >
              {{ $t('onboarding.buttons.skip') }}
            </a>
          </div>
        </template>
        
        <!-- Error state -->
        <div v-else-if="errorMessage" class="flex-grow flex items-center justify-center text-center">
          <div>
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
  </div>
</template>

<script>
import { OnboardingService } from '../../services/OnboardingService.js';

export default {
  name: 'OnboardingInterventionComponent',
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
        // Get the second onboarding step
        this.onboardingStep = await this.onboardingService.getOnboardingStep(2);
      } catch (error) {
        this.errorMessage = 'Error al cargar el contenido: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    handleNext() {
      // Navigate to the next onboarding step
      this.$router.push('/onboarding/step/3');
    },
    
    handleSkip() {
      // Skip to the end of onboarding
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
  color: #2D5A4A;
}

.bg-primary {
  background-color: #2D5A4A;
}

.bg-background-light {
  background-color: #F1E9D4;
}

.bg-background-dark {
  background-color: #1A1A1A;
}

.text-text-light {
  color: #2D5A4A;
}

.text-text-dark {
  color: #F1E9D4;
}

.illustration-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

.illustration-item {
  position: absolute;
  transition: all 0.5s ease-in-out;
  border-radius: 1rem;
}

.item-1 {
  top: 5%;
  left: 5%;
  width: 50%;
  height: 50%;
  background-image: url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300&h=300&auto=format&fit=crop');
  background-size: cover;
  z-index: 10;
}

.item-2 {
  bottom: 5%;
  right: 5%;
  width: 60%;
  height: 60%;
  background-image: url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=300&h=300&auto=format&fit=crop');
  background-size: cover;
  z-index: 20;
}

.item-3 {
  top: 40%;
  left: 30%;
  width: 45%;
  height: 45%;
  background-color: #2D5A4A;
  opacity: 0.5;
  z-index: 15;
  border-radius: 9999px;
}

.hover\:bg-opacity-90:hover {
  background-color: rgba(45, 90, 74, 0.9);
}
</style>

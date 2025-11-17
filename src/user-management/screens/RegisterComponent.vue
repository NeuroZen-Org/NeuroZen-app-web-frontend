<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <div class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <main class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-primary">NeuroZen</h1>
          <p class="mt-2 text-text-light/80 dark:text-text-dark/80">
            {{ $t('auth.register.tagline') }}
          </p>
        </div>
        
        <div class="bg-input-light dark:bg-input-dark p-6 sm:p-8 rounded-xl shadow-lg">
          <!-- Progress indicator -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <span class="text-sm font-semibold text-primary">{{ $t('auth.register.stepProgress', { current: currentStep, total: totalSteps }) }}</span>
            </div>
            <div class="w-full bg-border-light dark:bg-border-dark rounded-full h-2">
              <div 
                class="bg-primary h-2 rounded-full transition-all duration-300" 
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Error message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
          </div>
          
          <!-- Loading indicator -->
          <div v-if="isLoading" class="text-center mb-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-text-light dark:text-text-dark mb-2" for="username">
                Username
              </label>
              <div class="mt-1">
                <input 
                  v-model="formData.username"
                  autocomplete="username" 
                  class="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary placeholder-placeholder-light dark:placeholder-placeholder-dark" 
                  id="username" 
                  name="username" 
                  placeholder="Choose a username" 
                  required 
                  type="text"
                  :disabled="isLoading"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-text-light dark:text-text-dark mb-2" for="password">
                {{ $t('auth.register.password') }}
              </label>
              <div class="mt-1">
                <input 
                  v-model="formData.password"
                  autocomplete="new-password" 
                  class="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary placeholder-placeholder-light dark:placeholder-placeholder-dark" 
                  id="password" 
                  name="password" 
                  :placeholder="$t('auth.register.passwordPlaceholder')" 
                  required 
                  type="password"
                  :disabled="isLoading"
                />
              </div>
            </div>
            
            <div>
              <button 
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50" 
                type="submit"
                :disabled="isLoading"
              >
                {{ isLoading ? $t('auth.register.submitting') : $t('auth.register.submit') }}
              </button>
            </div>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-sm text-text-light/80 dark:text-text-dark/80">
              {{ $t('auth.register.hasAccount') }}
              <a class="font-semibold text-primary hover:underline" href="#" @click.prevent="goToLogin">
                {{ $t('auth.register.signIn') }}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../../services/AuthService.js';

export default {
  name: 'RegisterComponent',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      currentStep: 1,
      totalSteps: 3,
      isLoading: false,
      errorMessage: '',
      authService: null
    };
  },
  computed: {
    progressPercentage() {
      return (this.currentStep / this.totalSteps) * 100;
    }
  },
  created() {
    this.authService = new AuthService();
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const user = await this.authService.register(this.formData);
        
        // Emit registration success event
        this.$emit('register-success', user);
        
        // Navigate to onboarding
        this.$router.push('/onboarding');
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    goToLogin() {
      this.$router.push('/login');
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
  background-color: #1a1a1a;
}

.bg-input-light {
  background-color: #ffffff;
}

.bg-input-dark {
  background-color: #2a2a2a;
}

.text-text-light {
  color: #1f1f1f;
}

.text-text-dark {
  color: #e5e5e5;
}

.placeholder-placeholder-light {
  color: #6b7280;
}

.placeholder-placeholder-dark {
  color: #9ca3af;
}

.border-border-light {
  border-color: #d1d5db;
}

.border-border-dark {
  border-color: #4b5563;
}

.hover\:bg-primary\/90:hover {
  background-color: rgba(22, 156, 112, 0.9);
}

.focus\:ring-primary:focus {
  --tw-ring-color: #169c70;
}

.focus\:border-primary:focus {
  border-color: #169c70;
}
</style>

<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-primary">NeuroZen</h1>
          <p class="mt-2 text-muted-light dark:text-muted-dark">{{ $t('auth.login.welcomeBack') }}</p>
        </div>
        
        <!-- Error message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="text-center mb-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="sr-only" for="email">{{ $t('auth.login.email') }}</label>
            <input 
              v-model="formData.email"
              class="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-primary/20 dark:border-primary/40 rounded-lg focus:ring-primary focus:border-primary placeholder-muted-light dark:placeholder-muted-dark" 
              id="email" 
              name="email" 
              :placeholder="$t('auth.login.emailPlaceholder')" 
              type="email"
              required
              :disabled="isLoading"
            />
          </div>
          <div>
            <label class="sr-only" for="password">{{ $t('auth.login.password') }}</label>
            <input 
              v-model="formData.password"
              class="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-primary/20 dark:border-primary/40 rounded-lg focus:ring-primary focus:border-primary placeholder-muted-light dark:placeholder-muted-dark" 
              id="password" 
              name="password" 
              :placeholder="$t('auth.login.passwordPlaceholder')" 
              type="password"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                v-model="formData.rememberMe"
                class="h-4 w-4 rounded border-primary/50 text-primary focus:ring-primary" 
                id="remember-me" 
                name="remember-me" 
                type="checkbox"
                :disabled="isLoading"
              />
              <label class="ml-2 block text-sm text-text-light dark:text-text-dark" for="remember-me">
                {{ $t('auth.login.rememberMe') }}
              </label>
            </div>
            <div class="text-sm">
              <a class="font-medium text-primary hover:text-primary/80" href="#" @click.prevent="handleForgotPassword">
                {{ $t('auth.login.forgotPassword') }}
              </a>
            </div>
          </div>
          <div>
            <button 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? $t('auth.login.submitting') : $t('auth.login.submit') }}
            </button>
          </div>
        </form>
        
        <p class="mt-8 text-center text-sm text-muted-light dark:text-muted-dark">
          {{ $t('auth.login.noAccount') }} 
          <a class="font-medium text-primary hover:text-primary/80" href="#" @click.prevent="goToRegister">
            {{ $t('auth.login.signUp') }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../application/AuthService.js';

export default {
  name: 'LoginComponent',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        rememberMe: false
      },
      isLoading: false,
      errorMessage: '',
      authService: null
    };
  },
  created() {
    this.authService = new AuthService();
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const user = await this.authService.login(this.formData.email, this.formData.password);
        
        // Emit login success event
        this.$emit('login-success', user);
        
        // Navigate to dashboard or home
        this.$router.push('/dashboard');
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    handleForgotPassword() {
      // Navigate to forgot password page
      this.$router.push('/forgot-password');
    },
    
    goToRegister() {
      this.$router.push('/register');
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

.text-muted-light {
  color: #6B7280;
}

.text-muted-dark {
  color: #9CA3AF;
}

.border-primary\/20 {
  border-color: rgba(45, 90, 74, 0.2);
}

.border-primary\/40 {
  border-color: rgba(45, 90, 74, 0.4);
}

.hover\:bg-primary\/90:hover {
  background-color: rgba(45, 90, 74, 0.9);
}

.hover\:text-primary\/80:hover {
  color: rgba(45, 90, 74, 0.8);
}

.focus\:ring-primary:focus {
  --tw-ring-color: #2D5A4A;
}

.focus\:border-primary:focus {
  border-color: #2D5A4A;
}
</style>

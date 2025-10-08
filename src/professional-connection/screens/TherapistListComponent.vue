<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col">
      <!-- Header -->
      <header class="flex items-center justify-between whitespace-nowrap border-b border-primary/20 dark:border-primary/30 px-6 sm:px-10 py-4">
        <div class="flex items-center gap-3 text-primary">
          <span class="material-symbols-outlined text-3xl">self_improvement</span>
          <h2 class="text-primary text-xl font-bold">NeuroZen</h2>
        </div>
        <div class="flex gap-2">
          <button 
            @click="$router.push('/dashboard')"
            class="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <button class="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
            <span class="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-4xl">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center min-h-96">
            <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMessage" class="text-center">
            <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {{ errorMessage }}
            </div>
            <button 
              @click="loadTherapists"
              class="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>

          <!-- Content -->
          <div v-else>
            <!-- Header -->
            <div class="mb-8 px-2">
              <h1 class="text-slate-900 dark:text-slate-50 text-4xl font-bold tracking-tight">Find Your Therapist</h1>
              <p class="mt-2 text-slate-600 dark:text-slate-400 text-lg">Connect with licensed professionals to support your mental well-being.</p>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-4 mb-8 px-2">
              <div class="relative">
                <select 
                  v-model="selectedSpecialty"
                  @change="filterTherapists"
                  class="appearance-none w-full sm:w-auto bg-background-light dark:bg-background-dark border border-primary/30 dark:border-primary/40 text-slate-700 dark:text-slate-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Specialties</option>
                  <option value="Cognitive Behavioral Therapy">Cognitive Behavioral</option>
                  <option value="Mindfulness & Stress Reduction">Mindfulness</option>
                  <option value="Occupational Stress Management">Occupational Stress</option>
                  <option value="Work-Life Balance">Work-Life Balance</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <span class="material-symbols-outlined">expand_more</span>
                </div>
              </div>
              <div class="relative">
                <select 
                  v-model="selectedAvailability"
                  @change="filterTherapists"
                  class="appearance-none w-full sm:w-auto bg-background-light dark:bg-background-dark border border-primary/30 dark:border-primary/40 text-slate-700 dark:text-slate-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <span class="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            <!-- Therapists Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                v-for="therapist in filteredTherapists" 
                :key="therapist.id"
                class="bg-white dark:bg-slate-800/50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div class="md:flex">
                  <div class="md:shrink-0">
                    <img 
                      :alt="therapist.name" 
                      class="h-48 w-full object-cover md:h-full md:w-48" 
                      :src="therapist.image"
                    />
                  </div>
                  <div class="p-6">
                    <div class="flex items-center">
                      <div class="flex text-yellow-400">
                        <span v-for="i in Math.floor(therapist.rating)" :key="'full-' + i">★</span>
                        <span v-if="therapist.rating % 1 !== 0" class="text-yellow-400/70">★</span>
                      </div>
                      <p class="ml-2 text-sm text-slate-500 dark:text-slate-400">
                        {{ therapist.rating }} ({{ therapist.reviews }} reviews)
                      </p>
                    </div>
                    <a 
                      @click="goToTherapist(therapist.id)"
                      class="block mt-1 text-lg leading-tight font-semibold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                    >
                      {{ therapist.name }}
                    </a>
                    <p class="mt-2 text-slate-600 dark:text-slate-400">{{ therapist.specialty }}</p>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${{ therapist.price }} / session</p>
                    <button 
                      @click="bookSession(therapist.id)"
                      class="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Book a Session
                    </button>
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
import { TherapistService } from '../../services/TherapistService.js';

export default {
  name: 'TherapistListComponent',
  data() {
    return {
      therapists: [],
      filteredTherapists: [],
      isLoading: true,
      errorMessage: '',
      therapistService: null,
      selectedSpecialty: '',
      selectedAvailability: ''
    };
  },
  async created() {
    this.therapistService = new TherapistService();
    await this.loadTherapists();
  },
  methods: {
    async loadTherapists() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        this.therapists = await this.therapistService.getTherapists();
        this.filteredTherapists = [...this.therapists];
      } catch (error) {
        this.errorMessage = 'Error al cargar los terapeutas: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },

    filterTherapists() {
      this.filteredTherapists = this.therapists.filter(therapist => {
        const matchesSpecialty = !this.selectedSpecialty || therapist.specialty === this.selectedSpecialty;
        // For simplicity, we'll just filter by specialty for now
        return matchesSpecialty;
      });
    },

    goToTherapist(therapistId) {
      this.$router.push(`/therapist/${therapistId}`);
    },

    bookSession(therapistId) {
      this.$router.push(`/book-appointment/${therapistId}`);
    }
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Manrope', sans-serif;
}
</style>

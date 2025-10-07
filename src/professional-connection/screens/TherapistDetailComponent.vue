<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-[#11211c] dark:text-[#f6f8f7]">
    <div class="relative flex min-h-screen w-full flex-col">
      <!-- Header -->
      <header class="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-2 text-primary">
          <span class="material-symbols-outlined text-3xl">psychology</span>
          <h1 class="text-2xl font-bold">NeuroZen</h1>
        </div>
        <button 
          @click="$router.go(-1)"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
      </header>

      <!-- Main Content -->
      <main class="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-2xl space-y-8">
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
              @click="loadTherapistData"
              class="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>

          <!-- Content -->
          <div v-else>
            <!-- Profile Section -->
            <section class="flex flex-col sm:flex-row items-center gap-6 rounded-xl bg-background-light dark:bg-background-dark p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
              <img 
                :alt="therapist.name" 
                class="h-32 w-32 rounded-full object-cover" 
                :src="therapist.image"
              />
              <div class="text-center sm:text-left">
                <h2 class="text-3xl font-bold text-[#11211c] dark:text-[#f6f8f7]">{{ therapist.name }}</h2>
                <p class="text-lg text-primary">{{ therapist.specialty }}</p>
                <p class="text-base text-[#11211c]/70 dark:text-[#f6f8f7]/70">{{ therapist.experience }}</p>
                <div class="flex items-center mt-2 justify-center sm:justify-start">
                  <div class="flex text-yellow-400">
                    <span v-for="i in Math.floor(therapist.rating)" :key="'full-' + i">★</span>
                    <span v-if="therapist.rating % 1 !== 0" class="text-yellow-400/70">★</span>
                  </div>
                  <p class="ml-2 text-sm text-[#11211c]/70 dark:text-[#f6f8f7]/70">
                    {{ therapist.rating }} ({{ therapist.reviews }} reviews)
                  </p>
                </div>
              </div>
            </section>

            <!-- Biography Section -->
            <section>
              <h3 class="text-2xl font-bold mb-4 px-1">Biografía</h3>
              <p class="text-base text-[#11211c]/90 dark:text-[#f6f8f7]/90 leading-relaxed px-1">
                {{ therapist.bio }}
              </p>
            </section>

            <!-- Experience and Rates Section -->
            <section>
              <h3 class="text-2xl font-bold mb-4 px-1">Experiencia y Tarifas</h3>
              <div class="divide-y divide-primary/20 rounded-lg border border-primary/20 bg-primary/5 dark:bg-primary/10">
                <div class="grid grid-cols-3 gap-4 p-4">
                  <p class="col-span-1 font-semibold text-primary">Especialidad</p>
                  <p class="col-span-2 text-[#11211c] dark:text-[#f6f8f7]">{{ therapist.specialty }}</p>
                </div>
                <div class="grid grid-cols-3 gap-4 p-4">
                  <p class="col-span-1 font-semibold text-primary">Tarifa por sesión</p>
                  <p class="col-span-2 text-[#11211c] dark:text-[#f6f8f7]">${{ therapist.price }} / 50 minutos</p>
                </div>
                <div class="grid grid-cols-3 gap-4 p-4">
                  <p class="col-span-1 font-semibold text-primary">Disponibilidad</p>
                  <p class="col-span-2 text-[#11211c] dark:text-[#f6f8f7]">{{ therapist.availability }}</p>
                </div>
              </div>
            </section>

            <!-- Reviews Section -->
            <section>
              <h3 class="text-2xl font-bold mb-4 px-1">Reseñas y Testimonios</h3>
              <div v-if="reviews.length > 0" class="space-y-6">
                <div 
                  v-for="review in reviews" 
                  :key="review.id"
                  class="rounded-lg bg-background-light dark:bg-background-dark p-4 border border-primary/10 dark:border-primary/20"
                >
                  <div class="flex items-start gap-4">
                    <img 
                      :alt="review.userName" 
                      class="h-12 w-12 rounded-full object-cover" 
                      :src="review.userImage"
                    />
                    <div class="flex-1">
                      <div class="flex justify-between items-center">
                        <div>
                          <p class="font-bold text-[#11211c] dark:text-[#f6f8f7]">{{ review.userName }}</p>
                          <p class="text-sm text-[#11211c]/70 dark:text-[#f6f8f7]/70">{{ formatDate(review.date) }}</p>
                        </div>
                        <div class="flex items-center text-primary">
                          <span v-for="i in review.rating" :key="i" class="material-symbols-outlined text-lg">star</span>
                          <span v-for="i in (5 - review.rating)" :key="'empty-' + i" class="material-symbols-outlined text-lg text-primary/30">star</span>
                        </div>
                      </div>
                      <p class="mt-2 text-base text-[#11211c]/90 dark:text-[#f6f8f7]/90">
                        {{ review.comment }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <p class="text-[#11211c]/70 dark:text-[#f6f8f7]/70">No hay reseñas disponibles para este terapeuta.</p>
              </div>
            </section>

            <!-- Book Appointment Button -->
            <div class="pt-6">
              <button 
                @click="bookAppointment"
                class="w-full flex items-center justify-center gap-2 rounded-lg bg-primary h-12 px-5 text-lg font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span class="material-symbols-outlined">calendar_add_on</span>
                Reservar Cita
              </button>
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
  name: 'TherapistDetailComponent',
  data() {
    return {
      therapist: null,
      reviews: [],
      isLoading: true,
      errorMessage: '',
      therapistService: null
    };
  },
  async created() {
    this.therapistService = new TherapistService();
    await this.loadTherapistData();
  },
  methods: {
    async loadTherapistData() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const therapistId = this.$route.params.id;
        
        // Load therapist data
        this.therapist = await this.therapistService.getTherapist(therapistId);
        
        // Load reviews
        this.reviews = await this.therapistService.getTherapistReviews(therapistId);
      } catch (error) {
        this.errorMessage = 'Error al cargar la información del terapeuta: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },

    bookAppointment() {
      this.$router.push(`/book-appointment/${this.therapist.id}`);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Ayer';
      } else if (diffDays < 30) {
        return `Hace ${diffDays} días`;
      } else if (diffDays < 60) {
        return 'Hace 1 mes';
      } else {
        const months = Math.floor(diffDays / 30);
        return `Hace ${months} meses`;
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

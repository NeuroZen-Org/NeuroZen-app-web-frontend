<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark">
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="flex items-center justify-between p-4 border-b border-primary/20 dark:border-primary/30">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-3xl">calendar_add_on</span>
          <h1 class="text-xl font-bold text-primary">NeuroZen</h1>
        </div>
        <button 
          @click="$router.go(-1)"
          class="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <span class="material-symbols-outlined text-primary">arrow_back</span>
        </button>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 md:p-8">
        <div class="max-w-2xl mx-auto">
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

          <!-- Booking Form -->
          <div v-else class="space-y-8">
            <!-- Header -->
            <div class="text-center">
              <h2 class="text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
                Reservar Cita
              </h2>
              <p class="text-foreground-light/80 dark:text-foreground-dark/80">
                Programa tu sesión con {{ therapist?.name }}
              </p>
            </div>

            <!-- Therapist Info -->
            <div v-if="therapist" class="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg">
              <div class="flex items-center gap-4">
                <img 
                  :src="therapist.image" 
                  :alt="therapist.name"
                  class="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 class="text-xl font-semibold text-foreground-light dark:text-foreground-dark">
                    {{ therapist.name }}
                  </h3>
                  <p class="text-primary">{{ therapist.specialty }}</p>
                  <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                    ${{ therapist.price }} / 50 minutos
                  </p>
                </div>
              </div>
            </div>

            <!-- Booking Form -->
            <form @submit.prevent="submitBooking" class="space-y-6">
              <!-- Date Selection -->
              <div>
                <label class="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
                  Fecha de la cita
                </label>
                <input 
                  v-model="selectedDate"
                  type="date"
                  :min="minDate"
                  required
                  @change="loadAvailableSlots"
                  class="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark"
                />
              </div>

              <!-- Time Selection -->
              <div v-if="availableSlots.length > 0">
                <label class="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
                  Hora disponible
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="slot in availableSlots"
                    :key="slot"
                    type="button"
                    @click="selectedTime = slot"
                    :class="[
                      'py-2 px-4 rounded-lg border text-sm font-medium transition-colors',
                      selectedTime === slot 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-background-light dark:bg-background-dark border-primary/30 text-foreground-light dark:text-foreground-dark hover:border-primary/50'
                    ]"
                  >
                    {{ slot }}
                  </button>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
                  Notas adicionales (opcional)
                </label>
                <textarea 
                  v-model="notes"
                  rows="3"
                  placeholder="Describe brevemente el motivo de tu consulta o cualquier información relevante..."
                  class="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark resize-none"
                ></textarea>
              </div>

              <!-- Contact Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
                    Teléfono de contacto
                  </label>
                  <input 
                    v-model="contactPhone"
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    class="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
                    Email de confirmación
                  </label>
                  <input 
                    v-model="contactEmail"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    class="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background-light dark:text-foreground-dark text-foreground-light dark:text-foreground-dark"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                :disabled="!canSubmit || isSubmitting"
                class="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span v-if="isSubmitting" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                <span class="material-symbols-outlined" v-else>calendar_add_on</span>
                {{ isSubmitting ? 'Reservando...' : 'Confirmar Reserva' }}
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="successMessage" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { TherapistService } from '../../services/TherapistService.js';
import { AppointmentService } from '../../services/AppointmentService.js';

export default {
  name: 'BookAppointmentComponent',
  data() {
    return {
      therapist: null,
      isLoading: true,
      errorMessage: '',
      successMessage: '',
      isSubmitting: false,
      therapistService: null,
      appointmentService: null,
      selectedDate: '',
      selectedTime: '',
      availableSlots: [],
      notes: '',
      contactPhone: '',
      contactEmail: '',
      minDate: ''
    };
  },
  computed: {
    canSubmit() {
      return this.selectedDate && this.selectedTime && this.contactPhone && this.contactEmail;
    }
  },
  async created() {
    this.therapistService = new TherapistService();
    this.appointmentService = new AppointmentService();
    this.setMinDate();
    await this.loadTherapistData();
  },
  methods: {
    setMinDate() {
      const today = new Date();
      this.minDate = today.toISOString().split('T')[0];
    },

    async loadTherapistData() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const therapistId = this.$route.params.id;
        this.therapist = await this.therapistService.getTherapist(therapistId);
      } catch (error) {
        this.errorMessage = 'Error al cargar la información del terapeuta: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async loadAvailableSlots() {
      if (!this.selectedDate) return;
      
      try {
        this.availableSlots = await this.appointmentService.getAvailableSlots(
          this.therapist.id,
          this.selectedDate
        );
        this.selectedTime = ''; // Reset time selection
      } catch (error) {
        console.error('Error loading available slots:', error);
        this.availableSlots = [];
      }
    },

    async submitBooking() {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        const appointmentData = {
          professionalId: this.therapist.id,
          userId: 1, // Mock user ID
          date: this.selectedDate,
          time: this.selectedTime,
          duration: 50,
          status: 'scheduled',
          notes: this.notes,
          contactPhone: this.contactPhone,
          contactEmail: this.contactEmail
        };

        await this.appointmentService.bookAppointment(appointmentData);
        
        this.successMessage = `¡Cita reservada exitosamente! Recibirás una confirmación en ${this.contactEmail}`;
        
        // Reset form
        this.selectedDate = '';
        this.selectedTime = '';
        this.notes = '';
        this.contactPhone = '';
        this.contactEmail = '';
        this.availableSlots = [];
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 3000);
        
      } catch (error) {
        this.errorMessage = 'Error al reservar la cita: ' + error.message;
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
</style>

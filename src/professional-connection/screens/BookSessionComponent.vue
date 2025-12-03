<template>
  <div class="book-session-container">
    <!-- Navigation -->
    <nav class="booking-nav">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i>
        Atrás
      </button>
      <h1>{{ $t('professionals.bookSession') }}</h1>
    </nav>

    <div class="booking-content">
      <!-- Professional Selection -->
      <div class="professional-selection" v-if="currentStep === 'professional'">
        <h2>Selecciona un profesional</h2>
        <div class="professional-grid">
          <div 
            v-for="professional in professionals" 
            :key="professional.id"
            class="professional-card"
            :class="{ 'selected': selectedProfessional?.id === professional.id }"
            @click="selectProfessional(professional)"
          >
            <div class="professional-avatar">
              <img :src="professional.avatar" :alt="professional.name" />
            </div>
            <div class="professional-info">
              <h3>{{ professional.name }}</h3>
              <p class="specialty">{{ professional.specialty }}</p>
              <div class="rating">
                <span class="stars">
                  <i v-for="n in 5" :key="n" 
                     class="fas fa-star" 
                     :class="{ 'filled': n <= professional.rating }"></i>
                </span>
                <span class="rating-text">{{ professional.rating }}/5 ({{ professional.reviews }} reseñas)</span>
              </div>
              <p class="price">${{ professional.pricePerSession }}/sesión</p>
            </div>
          </div>
        </div>
        <button 
          class="continue-btn" 
          :disabled="!selectedProfessional"
          @click="nextStep"
        >
          Continuar
        </button>
      </div>

      <!-- Date and Time Selection -->
      <div class="datetime-selection" v-if="currentStep === 'datetime'">
        <div class="selected-professional-info">
          <img :src="selectedProfessional.avatar" :alt="selectedProfessional.name" />
          <div>
            <h3>{{ selectedProfessional.name }}</h3>
            <p>{{ selectedProfessional.specialty }}</p>
          </div>
        </div>

        <div class="calendar-section">
          <h2>Selecciona fecha y hora</h2>
          
          <!-- Calendar -->
          <div class="calendar-container">
            <div class="calendar-header">
              <button @click="previousMonth" class="nav-btn">
                <i class="fas fa-chevron-left"></i>
              </button>
              <h3>{{ currentMonthName }} {{ currentYear }}</h3>
              <button @click="nextMonth" class="nav-btn">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div class="calendar-grid">
              <div class="day-header" v-for="day in dayHeaders" :key="day">{{ day }}</div>
              <div 
                v-for="date in calendarDates" 
                :key="`${date.day}-${date.isCurrentMonth}`"
                class="calendar-day"
                :class="{ 
                  'other-month': !date.isCurrentMonth,
                  'selected': isDateSelected(date),
                  'available': isDateAvailable(date),
                  'disabled': !isDateAvailable(date)
                }"
                @click="selectDate(date)"
              >
                {{ date.day }}
              </div>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="time-slots" v-if="selectedDate">
            <h3>Horarios disponibles</h3>
            <div class="slots-grid">
              <button 
                v-for="slot in availableSlots" 
                :key="slot"
                class="time-slot"
                :class="{ 'selected': selectedTime === slot }"
                @click="selectTime(slot)"
              >
                {{ formatTime(slot) }}
              </button>
            </div>
          </div>
        </div>

        <div class="navigation-buttons">
          <button @click="previousStep" class="back-btn">Atrás</button>
          <button 
            class="continue-btn" 
            :disabled="!selectedDate || !selectedTime"
            @click="nextStep"
          >
            Continuar
          </button>
        </div>
      </div>

      <!-- Session Type Selection -->
      <div class="session-type-selection" v-if="currentStep === 'sessionType'">
        <h2>Tipo de sesión</h2>
        <div class="session-types">
          <div 
            v-for="type in sessionTypes" 
            :key="type.id"
            class="session-type-card"
            :class="{ 'selected': selectedSessionType?.id === type.id }"
            @click="selectSessionType(type)"
          >
            <div class="type-icon">
              <i :class="type.icon"></i>
            </div>
            <h3>{{ type.name }}</h3>
            <p>{{ type.description }}</p>
            <p class="duration">{{ type.duration || 60 }} minutos</p>
          </div>
        </div>

        <div class="navigation-buttons">
          <button @click="previousStep" class="back-btn">Atrás</button>
          <button 
            class="continue-btn" 
            :disabled="!selectedSessionType"
            @click="nextStep"
          >
            Continuar
          </button>
        </div>
      </div>

      <!-- Booking Summary -->
      <div class="booking-summary" v-if="currentStep === 'summary'">
        <h2>Resumen de la reserva</h2>
        
        <div class="summary-card">
          <div class="summary-section">
            <h3>Profesional</h3>
            <div class="professional-summary">
              <img :src="selectedProfessional.avatar" :alt="selectedProfessional.name" />
              <div>
                <p class="name">{{ selectedProfessional.name }}</p>
                <p class="specialty">{{ selectedProfessional.specialty }}</p>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <h3>Fecha y hora</h3>
            <p>{{ formatSelectedDate }} a las {{ formatTime(selectedTime) }}</p>
          </div>

          <div class="summary-section">
            <h3>Tipo de sesión</h3>
            <p>{{ selectedSessionType.name }} ({{ selectedSessionType.duration || 60 }} min)</p>
          </div>

          <div class="summary-section">
            <h3>Notas adicionales</h3>
            <textarea 
              v-model="notes" 
              placeholder="Comparte cualquier información relevante sobre tu consulta..."
              rows="3"
            ></textarea>
          </div>

          <div class="summary-section total">
            <h3>Total a pagar</h3>
            <p class="price">${{ selectedProfessional.pricePerSession }}</p>
          </div>
        </div>

        <div class="navigation-buttons">
          <button @click="previousStep" class="back-btn">Atrás</button>
          <button 
            class="book-btn" 
            @click="confirmBooking"
            :disabled="isBooking"
          >
            {{ isBooking ? 'Reservando...' : 'Confirmar Reserva' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script>
import { AppointmentService } from '../../services/AppointmentService.js';
import { TherapistService } from '../../services/TherapistService.js';

export default {
  name: 'BookSessionComponent',
  data() {
    return {
      currentStep: 'professional', // professional, datetime, sessionType, summary
      loading: false,
      isBooking: false,
      
      // Professional selection
      professionals: [],
      selectedProfessional: null,
      
      // Date and time selection
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDate: null,
      selectedTime: null,
      availableSlots: [],
      
      // Session type selection
      sessionTypes: [], // Se cargarán desde el backend
      selectedSessionType: null,
      
      // Notes
      notes: '',
      
      // Calendar
      dayHeaders: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    };
  },
  
  computed: {
    currentMonthName() {
      return this.monthNames[this.currentMonth];
    },
    
    calendarDates() {
      return this.generateCalendar(this.currentYear, this.currentMonth);
    },
    
    formatSelectedDate() {
      if (!this.selectedDate) return '';
      const date = this.selectedDate.date;
      return `${date.getDate()} de ${this.monthNames[date.getMonth()]} de ${date.getFullYear()}`;
    }
  },
  
  async mounted() {
    await this.loadProfessionals();
    await this.loadSessionTypes();
  },
  
  methods: {
    async loadSessionTypes() {
      try {
        const appointmentService = new AppointmentService();
        const typesFromBackend = await appointmentService.getAppointmentTypes();
        
        // Mapear la estructura del backend: value, name, displayName, description, estimatedDurationMinutes
        this.sessionTypes = typesFromBackend.map(type => {
          // Asignar ícono según el nombre del tipo
          let icon = 'fas fa-calendar';
          if (type.name === 'TerapiaIndividual' || type.displayName?.includes('Terapia')) {
            icon = 'fas fa-user';
          } else if (type.name === 'ConsultaInicial' || type.displayName?.includes('Consulta')) {
            icon = 'fas fa-clipboard-list';
          } else if (type.name === 'Seguimiento' || type.displayName?.includes('Seguimiento')) {
            icon = 'fas fa-chart-line';
          }
          
          return {
            id: type.value || type.id, // Usar 'value' como id
            name: type.displayName || type.name, // Mostrar displayName
            description: type.description || '',
            duration: type.estimatedDurationMinutes || 60,
            icon: icon,
            backendName: type.name // Guardar el nombre original para enviar al backend
          };
        });
        
        console.log('Tipos de sesión obtenidos del backend:', this.sessionTypes);
      } catch (error) {
        console.error('Error loading session types:', error);
        // Si falla, usar tipos por defecto
        this.sessionTypes = [
          {
            id: 'therapy',
            name: 'Terapia Individual',
            description: 'Sesión personalizada uno a uno con el profesional',
            duration: 60,
            icon: 'fas fa-user',
            backendName: 'TerapiaIndividual'
          },
          {
            id: 'consultation',
            name: 'Consulta Inicial',
            description: 'Primera consulta para evaluación y diagnóstico',
            duration: 45,
            icon: 'fas fa-clipboard-list',
            backendName: 'ConsultaInicial'
          },
          {
            id: 'follow-up',
            name: 'Seguimiento',
            description: 'Sesión de seguimiento y revisión de progreso',
            duration: 30,
            icon: 'fas fa-chart-line',
            backendName: 'Seguimiento'
          }
        ];
      }
    },

    async loadProfessionals() {
      this.loading = true;
      try {
        // Crear instancia del servicio
        const therapistService = new TherapistService();
        
        // Obtener profesionales desde el backend
        const professionalsData = await therapistService.getTherapists();
        
        console.log('Profesionales obtenidos del backend:', professionalsData);
        
        // Mapear los datos del backend al formato del componente
        this.professionals = professionalsData.map(prof => ({
          id: prof.id,
          name: prof.name,
          specialty: prof.specialty,
          avatar: prof.image || '/images-of-professionals/usuariodemo.jpg',
          rating: prof.rating || 4.5,
          reviews: prof.reviews || 0,
          pricePerSession: prof.price || 150,
          experience: prof.experience || '',
          bio: prof.bio || '',
          availability: prof.availability || 'Consultar disponibilidad'
        }));
        
        // Si no hay profesionales, mostrar datos de fallback
        if (this.professionals.length === 0) {
          console.warn('No se encontraron profesionales en el backend, usando datos de ejemplo');
          this.professionals = [
            {
              id: 1,
              name: 'Profesional de Ejemplo',
              specialty: 'Psicología Clínica',
              avatar: '/images-of-professionals/usuariodemo.jpg',
              rating: 4.5,
              reviews: 0,
              pricePerSession: 150
            }
          ];
        }
        
      } catch (error) {
        console.error('Error loading professionals:', error);
        
        // En caso de error, mostrar datos de fallback
        this.professionals = [
          {
            id: 1,
            name: 'Dra. María González',
            specialty: 'Psicóloga Clínica',
            avatar: '/images-of-professionals/maria.jpg',
            rating: 4.8,
            reviews: 124,
            pricePerSession: 150
          },
          {
            id: 2,
            name: 'Dr. Carlos Rodríguez',
            specialty: 'Psiquiatra',
            avatar: '/images-of-professionals/carlos.jpg',
            rating: 4.9,
            reviews: 89,
            pricePerSession: 200
          },
          {
            id: 3,
            name: 'Lic. Ana Martínez',
            specialty: 'Terapeuta Cognitivo-Conductual',
            avatar: '/images-of-professionals/ana.png',
            rating: 4.7,
            reviews: 156,
            pricePerSession: 120
          }
        ];
        
        alert('No se pudieron cargar los profesionales del servidor. Mostrando datos de ejemplo.');
      } finally {
        this.loading = false;
      }
    },
    
    selectProfessional(professional) {
      this.selectedProfessional = professional;
    },
    
    async selectDate(date) {
      if (!this.isDateAvailable(date)) return;
      
      this.selectedDate = date;
      this.selectedTime = null;
      
      // Load available slots for the selected date
      await this.loadAvailableSlots();
    },
    
    async loadAvailableSlots() {
      if (!this.selectedDate || !this.selectedProfessional) return;
      
      try {
        const dateStr = this.formatDate(this.selectedDate.date);
        this.availableSlots = await AppointmentService.getAvailableSlots(
          this.selectedProfessional.id, 
          dateStr
        );
      } catch (error) {
        console.error('Error loading available slots:', error);
        // Fallback to default slots
        this.availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      }
    },
    
    selectTime(time) {
      this.selectedTime = time;
    },
    
    selectSessionType(type) {
      this.selectedSessionType = type;
    },
    
    isDateSelected(date) {
      if (!this.selectedDate) return false;
      return this.selectedDate.date.toDateString() === date.date.toDateString();
    },
    
    isDateAvailable(date) {
      if (!date.isCurrentMonth) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date.date >= today;
    },
    
    generateCalendar(year, month) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const calendar = [];
      
      // Add previous month's days
      const prevMonth = new Date(year, month - 1, 0);
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendar.push({
          day: prevMonth.getDate() - i,
          isCurrentMonth: false,
          date: new Date(year, month - 1, prevMonth.getDate() - i)
        });
      }

      // Add current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        calendar.push({
          day,
          isCurrentMonth: true,
          date: new Date(year, month, day)
        });
      }

      // Add next month's days to complete the grid
      const remainingCells = 42 - calendar.length;
      for (let day = 1; day <= remainingCells; day++) {
        calendar.push({
          day,
          isCurrentMonth: false,
          date: new Date(year, month + 1, day)
        });
      }

      return calendar;
    },
    
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    
    formatDate(date) {
      return date.toISOString().split('T')[0];
    },
    
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    },
    
    nextStep() {
      const steps = ['professional', 'datetime', 'sessionType', 'summary'];
      const currentIndex = steps.indexOf(this.currentStep);
      if (currentIndex < steps.length - 1) {
        this.currentStep = steps[currentIndex + 1];
      }
    },
    
    previousStep() {
      const steps = ['professional', 'datetime', 'sessionType', 'summary'];
      const currentIndex = steps.indexOf(this.currentStep);
      if (currentIndex > 0) {
        this.currentStep = steps[currentIndex - 1];
      }
    },
    
    async confirmBooking() {
      this.isBooking = true;
      
      try {
        // Obtener el usuario actual
        const currentUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('currentUser') || '{}');
        const userId = currentUser.id || 1;
        
        // Crear instancia del servicio
        const appointmentService = new AppointmentService();
        
        // Combinar fecha y hora en formato ISO
        const dateStr = this.formatDate(this.selectedDate.date); // YYYY-MM-DD
        const timeStr = this.selectedTime; // HH:mm
        const appointmentDateTime = `${dateStr}T${timeStr}:00Z`;
        
        // Adaptar datos al formato del backend
        const appointmentData = {
          patientId: userId,
          professionalId: this.selectedProfessional.id,
          appointmentDateTime: appointmentDateTime,
          appointmentType: this.selectedSessionType.id, // El value numérico (1, 2, 3)
          notasAdicionales: this.notes || ''
        };
        
        console.log('Datos de cita a enviar al backend:', appointmentData);
        
        const appointment = await appointmentService.bookAppointment(appointmentData);
        
        console.log('Cita creada exitosamente:', appointment);
        
        // Extraer el ID de la cita (puede venir como id, appointmentId, etc.)
        const appointmentId = appointment.id || appointment.appointmentId || appointment.value || 1;
        
        // Navigate to confirmation page con datos adicionales por si el backend no los devuelve todos
        this.$router.push({
          name: 'AppointmentConfirmation',
          params: { appointmentId: appointmentId },
          query: {
            // Datos de respaldo por si no se pueden obtener del backend
            professionalId: this.selectedProfessional.id,
            date: this.formatDate(this.selectedDate.date),
            time: this.selectedTime,
            duration: this.selectedSessionType.duration,
            notes: this.notes
          }
        });
        
      } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Error al reservar la cita: ' + (error.message || 'Por favor intenta nuevamente.'));
      } finally {
        this.isBooking = false;
      }
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.book-session-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #5c9c6c 0%, #448630 100%);
  padding: 20px;
  position: relative;
}

.booking-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.booking-nav h1 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.booking-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

/* Professional Selection */
.professional-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.professional-card {
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.professional-card:hover,
.professional-card.selected {
  border-color: #0b531d;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.professional-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.professional-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.specialty {
  color: #666;
  margin: 0 0 10px 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.stars {
  color: #ffd700;
}

.stars .fa-star:not(.filled) {
  color: #ddd;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.price {
  font-weight: 600;
  color: #086323;
  margin: 0;
  font-size: 16px;
}

/* Calendar */
.selected-professional-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8f9ff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.selected-professional-info img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.calendar-container {
  background: #f8f9ff;
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
  color: #333;
}

.nav-btn {
  background: #067c1f;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #06691f;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-header {
  text-align: center;
  font-weight: 600;
  color: #666;
  padding: 10px;
  font-size: 12px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.calendar-day.available {
  background: white;
  color: #333;
  border: 1px solid #e2e8f0;
}

.calendar-day.available:hover {
  background: #036d03;
  color: white;
}

.calendar-day.selected {
  background: #4a7e5b;
  color: white;
}

.calendar-day.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.calendar-day.other-month {
  color: #ccc;
}

/* Time Slots */
.time-slots {
  margin-top: 30px;
}

.time-slots h3 {
  margin-bottom: 15px;
  color: #333;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.time-slot {
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.time-slot:hover,
.time-slot.selected {
  border-color: #087a11;
  background: #016d49;
  color: white;
}

/* Session Types */
.session-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.session-type-card {
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.session-type-card:hover,
.session-type-card.selected {
  border-color: #07722b;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.type-icon {
  font-size: 36px;
  color: #066115;
  margin-bottom: 15px;
}

.session-type-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.session-type-card p {
  color: #666;
  margin: 0 0 10px 0;
}

.duration {
  font-weight: 600;
  color: #056923 !important;
}

/* Summary */
.summary-card {
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
}

.summary-section {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.summary-section:last-child {
  border-bottom: none;
}

.summary-section h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.professional-summary {
  display: flex;
  align-items: center;
  gap: 15px;
}

.professional-summary img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.professional-summary .name {
  font-weight: 600;
  margin: 0;
}

.professional-summary .specialty {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.summary-section textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  resize: vertical;
  font-family: inherit;
}

.summary-section.total {
  background: #f8f9ff;
}

.summary-section.total .price {
  font-size: 24px;
  font-weight: 700;
  color: #035723;
  margin: 0;
}

/* Navigation */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
}

.continue-btn,
.book-btn {
  background: #015a0d;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 200px;
  margin-left: auto;
}

.continue-btn:hover,
.book-btn:hover {
  background: #035f1f;
}

.continue-btn:disabled,
.book-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.book-btn {
  background: #056940;
}

.book-btn:hover {
  background: #38a169;
}

/* Loading */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .book-session-container {
    padding: 10px;
  }
  
  .booking-content {
    padding: 20px;
  }
  
  .professional-grid {
    grid-template-columns: 1fr;
  }
  
  .professional-card {
    flex-direction: column;
    text-align: center;
  }
  
  .session-types {
    grid-template-columns: 1fr;
  }
  
  .slots-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .continue-btn,
  .book-btn {
    max-width: none;
  }
}
</style>

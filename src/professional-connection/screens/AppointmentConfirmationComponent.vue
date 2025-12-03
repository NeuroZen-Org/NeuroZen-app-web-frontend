<template>
  <div class="appointment-confirmation-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>NeuroZen</h1>
      <div class="spacer"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loadingAppointment') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Error al cargar</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadAppointmentData">Reintentar</button>
    </div>

    <!-- Main Content -->
    <div v-else class="main-content">
      <div class="confirmation-card">
        <h2>Confirmar tu cita</h2>
        
        <!-- Professional Info -->
        <div class="professional-section">
          <div class="professional-info">
            <img :src="professional.image" :alt="professional.name" class="professional-avatar" />
            <div class="professional-details">
              <p class="session-type">Sesión de Terapia</p>
              <p class="professional-name">{{ professional.name }}</p>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Appointment Details -->
        <div class="appointment-details">
          <div class="detail-item">
            <div class="detail-content">
              <p class="detail-title">Fecha y Hora</p>
              <p class="detail-value">{{ formattedDateTime }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-content">
              <p class="detail-title">Duración</p>
              <p class="detail-value">{{ appointmentData.duration }} minutos</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-content">
              <p class="detail-title">Costo</p>
              <p class="detail-value">${{ professional.price || 150 }}</p>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="notes-section" v-if="appointmentData.notes">
          <h3>Notas adicionales</h3>
          <p class="notes-text">{{ appointmentData.notes }}</p>
        </div>

        <div class="divider"></div>

        <!-- Payment Method -->
        <div class="payment-section">
          <h3>Método de Pago</h3>
          <div class="payment-options">
            <label class="payment-option" :class="{ selected: selectedPayment === 'card' }">
              <input 
                type="radio" 
                name="payment" 
                value="card"
                v-model="selectedPayment"
              />
              <span class="payment-label">Tarjeta</span>
            </label>
            <label class="payment-option" :class="{ selected: selectedPayment === 'cash' }">
              <input 
                type="radio" 
                name="payment" 
                value="cash"
                v-model="selectedPayment"
              />
              <span class="payment-label">Efectivo</span>
            </label>
          </div>
        </div>

        <!-- Confirm Button -->
        <button 
          class="confirm-button" 
          @click="confirmAppointment"
          :disabled="isConfirming || !selectedPayment"
        >
          <span v-if="isConfirming">Confirmando...</span>
          <span v-else>Confirmar Cita</span>
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success-modal" @click.stop>
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>¡Cita confirmada!</h3>
        <p>Tu cita con {{ professional.name }} ha sido confirmada exitosamente.</p>
        <div class="modal-actions">
          <button class="primary-button" @click="goToDashboard">
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TherapistService } from '../../services/TherapistService.js';

export default {
  name: 'AppointmentConfirmationComponent',
  data() {
    return {
      loading: true,
      error: null,
      isConfirming: false,
      showSuccessModal: false,
      showContactInfo: true,
      
      professional: {},
      appointmentData: {
        date: '',
        time: '',
        duration: 50,
        notes: ''
      },
      
      selectedPayment: 'card'
    }
  },
  computed: {
    formattedDateTime() {
      if (!this.appointmentData.date || !this.appointmentData.time) return '';
      
      const date = new Date(this.appointmentData.date + 'T' + this.appointmentData.time);
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleDateString('es-ES', options);
    }
  },
  async mounted() {
    await this.loadAppointmentData();
  },
  methods: {
    async loadAppointmentData() {
      try {
        this.loading = true;
        this.error = null;
        
        // Obtener appointmentId de los params
        const appointmentId = this.$route.params.appointmentId;
        
        if (!appointmentId) {
          console.warn('No appointmentId found, using mock data');
          // Si no hay appointmentId, usar datos mock básicos
          this.professional = {
            id: 1,
            name: 'Profesional',
            image: '/images-of-professionals/usuariodemo.jpg',
            price: 150
          };
          this.appointmentData = {
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            duration: 60,
            notes: ''
          };
          return;
        }
        
        // Intentar obtener la cita del backend
        try {
          const appointmentService = new AppointmentService();
          const appointment = await appointmentService.getAppointment(appointmentId);
          
          console.log('Cita obtenida del backend:', appointment);
          
          // Extraer datos de la cita
          const professionalId = appointment.professionalId || appointment.professional?.id;
          
          // Cargar datos del profesional
          const therapistService = new TherapistService();
          this.professional = await therapistService.getTherapist(professionalId);
          
          // Establecer datos de la cita
          const appointmentDateTime = new Date(appointment.appointmentDateTime || appointment.scheduledAt);
          this.appointmentData = {
            date: appointmentDateTime.toISOString().split('T')[0],
            time: appointmentDateTime.toTimeString().slice(0, 5),
            duration: appointment.duration || appointment.estimatedDurationMinutes || 60,
            notes: appointment.notasAdicionales || appointment.notes || ''
          };
          
        } catch (apiError) {
          console.warn('Error al obtener cita del backend, usando datos de navegación:', apiError);
          
          // Fallback: usar datos que vienen de la navegación (si existen)
          const professionalId = this.$route.query.professionalId;
          const appointmentDate = this.$route.query.date;
          const appointmentTime = this.$route.query.time;
          
          if (professionalId) {
            const therapistService = new TherapistService();
            this.professional = await therapistService.getTherapist(professionalId);
          } else {
            // Datos mock si todo falla
            this.professional = {
              id: 1,
              name: 'Profesional',
              image: '/images-of-professionals/usuariodemo.jpg',
              price: 150
            };
          }
          
          this.appointmentData = {
            date: appointmentDate || new Date().toISOString().split('T')[0],
            time: appointmentTime || '10:00',
            duration: 60,
            notes: this.$route.query.notes || ''
          };
        }
        
      } catch (error) {
        console.error('Error loading appointment data:', error);
        this.error = 'No se pudo cargar la información de la cita';
      } finally {
        this.loading = false;
      }
    },

    async confirmAppointment() {
      // La cita ya fue creada en el paso anterior (BookSessionComponent)
      // Este método solo muestra la confirmación final al usuario
      
      if (!this.selectedPayment) {
        alert('Por favor selecciona un método de pago');
        return;
      }

      try {
        this.isConfirming = true;
        
        // Aquí podrías actualizar el método de pago si el backend lo requiere
        // Por ahora, solo guardamos localmente para referencia
        const appointmentId = this.$route.params.appointmentId;
        
        console.log('Cita confirmada con método de pago:', this.selectedPayment);
        console.log('Appointment ID:', appointmentId);
        
        // Simular un pequeño delay para mejor UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mostrar modal de éxito
        this.showSuccessModal = true;
        
      } catch (error) {
        console.error('Error confirming appointment:', error);
        alert('Error al confirmar la cita. Por favor intenta nuevamente.');
      } finally {
        this.isConfirming = false;
      }
    },


    closeSuccessModal() {
      this.showSuccessModal = false;
      this.goToDashboard();
    },

    goToDashboard() {
      this.$router.push('/dashboard');
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.appointment-confirmation-container {
  min-height: 100vh;
  background: #F1E9D4;
  font-family: 'Manrope', sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.back-button {
  background: none;
  border: none;
  color: #2D5A4A;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(45, 90, 74, 0.1);
}

.header h1 {
  color: #2D5A4A;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.spacer {
  width: 40px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(45, 90, 74, 0.3);
  border-top: 3px solid #2D5A4A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.retry-button {
  background: #2D5A4A;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
}

.main-content {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.confirmation-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.confirmation-card h2 {
  text-align: center;
  color: #2D5A4A;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 24px 0;
}

.professional-section {
  margin-bottom: 24px;
}

.professional-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.professional-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.professional-details {
  flex: 1;
}

.session-type {
  color: #2D5A4A;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.professional-name {
  color: rgba(45, 90, 74, 0.8);
  font-size: 14px;
  margin: 0;
}

.divider {
  height: 1px;
  background: rgba(45, 90, 74, 0.2);
  margin: 24px 0;
}

.appointment-details {
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-icon {
  width: 48px;
  height: 48px;
  background: rgba(45, 90, 74, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2D5A4A;
}

.detail-content {
  flex: 1;
}

.detail-title {
  color: #2D5A4A;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.detail-value {
  color: rgba(45, 90, 74, 0.8);
  font-size: 14px;
  margin: 0;
}

.notes-section,
.contact-section {
  margin-bottom: 24px;
}

.notes-section h3,
.contact-section h3,
.payment-section h3 {
  color: #2D5A4A;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.notes-text {
  color: rgba(45, 90, 74, 0.8);
  line-height: 1.5;
  margin: 0;
}

.contact-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  color: #2D5A4A;
  font-weight: 500;
  font-size: 14px;
}

.input-group input {
  padding: 12px;
  border: 1px solid rgba(45, 90, 74, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #2D5A4A;
  font-size: 16px;
  transition: all 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #2D5A4A;
  box-shadow: 0 0 0 3px rgba(45, 90, 74, 0.1);
}

.input-group input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}

.payment-section {
  margin-bottom: 24px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid rgba(45, 90, 74, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option.selected {
  background: rgba(45, 90, 74, 0.1);
  border-color: #2D5A4A;
}

.payment-option:hover {
  background: rgba(45, 90, 74, 0.05);
}

.payment-label {
  color: #2D5A4A;
  font-weight: 600;
}

.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: #2D5A4A;
}

.confirm-button {
  width: 100%;
  background: #2D5A4A;
  color: #F1E9D4;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirm-button:hover:not(:disabled) {
  background: rgba(45, 90, 74, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.confirm-button:disabled {
  background: rgba(45, 90, 74, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.success-modal .success-icon {
  margin-bottom: 20px;
}

.success-modal .success-icon i {
  font-size: 64px;
  color: #10b981;
}

.success-modal h3 {
  color: #2D5A4A;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.success-modal p {
  color: rgba(45, 90, 74, 0.8);
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primary-button,
.secondary-button {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-button {
  background: #2D5A4A;
  color: white;
  border: none;
}

.secondary-button {
  background: rgba(45, 90, 74, 0.1);
  color: #2D5A4A;
  border: 1px solid rgba(45, 90, 74, 0.3);
}

.primary-button:hover {
  background: rgba(45, 90, 74, 0.9);
}

.secondary-button:hover {
  background: rgba(45, 90, 74, 0.2);
}

@media (max-width: 768px) {
  .confirmation-card {
    margin: 10px;
    padding: 20px;
  }
  
  .modal-content {
    margin: 20px;
    padding: 24px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>

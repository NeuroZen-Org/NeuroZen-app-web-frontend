<template>
  <div class="appointment-confirmation-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <i class="material-symbols-outlined">arrow_back</i>
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
            <div class="detail-icon">
              <i class="material-symbols-outlined">calendar_today</i>
            </div>
            <div class="detail-content">
              <p class="detail-title">Fecha y Hora</p>
              <p class="detail-value">{{ formattedDateTime }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <i class="material-symbols-outlined">schedule</i>
            </div>
            <div class="detail-content">
              <p class="detail-title">Duración</p>
              <p class="detail-value">{{ appointmentData.duration }} minutos</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <i class="material-symbols-outlined">payments</i>
            </div>
            <div class="detail-content">
              <p class="detail-title">Costo</p>
              <p class="detail-value">${{ professional.price }}</p>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="notes-section" v-if="appointmentData.notes">
          <h3>Notas adicionales</h3>
          <p class="notes-text">{{ appointmentData.notes }}</p>
        </div>

        <!-- Contact Information -->
        <div class="contact-section" v-if="showContactInfo">
          <h3>Información de contacto</h3>
          <div class="contact-inputs">
            <div class="input-group">
              <label for="contactEmail">Email de contacto</label>
              <input 
                type="email" 
                id="contactEmail"
                v-model="contactInfo.email"
                placeholder="tu@email.com"
                :class="{ error: emailError }"
              />
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
            </div>
            <div class="input-group">
              <label for="contactPhone">Teléfono de contacto</label>
              <input 
                type="tel" 
                id="contactPhone"
                v-model="contactInfo.phone"
                placeholder="+1 (555) 123-4567"
                :class="{ error: phoneError }"
              />
              <span v-if="phoneError" class="error-message">{{ phoneError }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="payment-section">
          <h3>Método de Pago</h3>
          <div class="payment-options">
            <label class="payment-option" :class="{ selected: selectedPayment === 'credit' }">
              <span class="payment-label">Tarjeta de Crédito</span>
              <input 
                type="radio" 
                name="payment" 
                value="credit"
                v-model="selectedPayment"
              />
            </label>
            <label class="payment-option" :class="{ selected: selectedPayment === 'paypal' }">
              <span class="payment-label">PayPal</span>
              <input 
                type="radio" 
                name="payment" 
                value="paypal"
                v-model="selectedPayment"
              />
            </label>
          </div>

          <!-- Credit Card Form -->
          <div v-if="selectedPayment === 'credit'" class="credit-card-form">
            <div class="input-group">
              <label for="cardName">Nombre en la tarjeta</label>
              <input 
                type="text" 
                id="cardName"
                v-model="cardInfo.nameUser"
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div class="input-group">
              <label for="cardLastName">Apellido</label>
              <input 
                type="text" 
                id="cardLastName"
                v-model="cardInfo.lastNameUser"
                placeholder="García"
                required
              />
            </div>
            <div class="input-group">
              <label for="cardNumber">Número de tarjeta</label>
              <input 
                type="text" 
                id="cardNumber"
                v-model="cardInfo.numberCard"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                required
              />
            </div>
            <div class="input-row">
              <div class="input-group">
                <label for="cardExpiry">Fecha de expiración</label>
                <input 
                  type="text" 
                  id="cardExpiry"
                  v-model="cardInfo.expirationDate"
                  placeholder="MM/YY"
                  maxlength="5"
                  required
                />
              </div>
              <div class="input-group">
                <label for="cardCvv">CVV</label>
                <input 
                  type="text" 
                  id="cardCvv"
                  v-model="cardInfo.cvv"
                  placeholder="123"
                  maxlength="4"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Confirm Button -->
        <button 
          class="confirm-button" 
          @click="confirmAppointment"
          :disabled="isConfirming || !isFormValid"
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
          <i class="material-symbols-outlined">check_circle</i>
        </div>
        <h3>¡Cita confirmada!</h3>
        <p>Tu cita con {{ professional.name }} ha sido confirmada exitosamente.</p>
        <div class="modal-actions">
          <button class="secondary-button" @click="addToCalendar">
            <i class="material-symbols-outlined">calendar_add_on</i>
            Agregar al calendario
          </button>
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
import { AppointmentService } from '../../services/AppointmentService.js';
import { SubscriptionService } from '../../services/SubscriptionService.js';

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
      
      contactInfo: {
        email: '',
        phone: ''
      },
      
      selectedPayment: 'credit',
      
      cardInfo: {
        nameUser: '',
        lastNameUser: '',
        numberCard: '',
        expirationDate: '',
        cvv: ''
      },
      
      // Validation
      emailError: '',
      phoneError: ''
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
    },
    
    isFormValid() {
      const hasValidEmail = this.contactInfo.email && !this.emailError;
      const hasValidPhone = this.contactInfo.phone && !this.phoneError;
      const hasPaymentMethod = this.selectedPayment;
      
      let hasValidCardInfo = true;
      if (this.selectedPayment === 'credit') {
        hasValidCardInfo = this.cardInfo.nameUser && 
                          this.cardInfo.lastNameUser && 
                          this.cardInfo.numberCard && 
                          this.cardInfo.expirationDate && 
                          this.cardInfo.cvv;
      }
      
      return hasValidEmail && hasValidPhone && hasPaymentMethod && hasValidCardInfo;
    }
  },
  watch: {
    'contactInfo.email'(newEmail) {
      this.validateEmail(newEmail);
    },
    'contactInfo.phone'(newPhone) {
      this.validatePhone(newPhone);
    }
  },
  async mounted() {
    await this.loadAppointmentData();
    this.loadUserContactInfo();
  },
  methods: {
    async loadAppointmentData() {
      try {
        this.loading = true;
        this.error = null;
        
        // Get professional ID and appointment data from route params or store
        const professionalId = this.$route.params.id || this.$route.query.professionalId;
        const appointmentDate = this.$route.query.date;
        const appointmentTime = this.$route.query.time;
        
        if (!professionalId) {
          throw new Error('ID del profesional no encontrado');
        }
        
        // Load professional data
        this.professional = await TherapistService.getTherapistById(professionalId);
        
        // Set appointment data
        this.appointmentData = {
          date: appointmentDate || '',
          time: appointmentTime || '',
          duration: 50,
          notes: this.$route.query.notes || ''
        };
        
      } catch (error) {
        console.error('Error loading appointment data:', error);
        this.error = 'No se pudo cargar la información de la cita';
      } finally {
        this.loading = false;
      }
    },

    loadUserContactInfo() {
      // Load user contact info from localStorage or user service
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.contactInfo.email = userInfo.email || '';
      this.contactInfo.phone = userInfo.phone || '';
    },

    validateEmail(email) {
      this.emailError = '';
      if (!email) {
        this.emailError = 'El email es requerido';
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.emailError = 'Formato de email inválido';
        return false;
      }
      return true;
    },

    validatePhone(phone) {
      this.phoneError = '';
      if (!phone) {
        this.phoneError = 'El teléfono es requerido';
        return false;
      }
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(phone)) {
        this.phoneError = 'Formato de teléfono inválido';
        return false;
      }
      return true;
    },

    async confirmAppointment() {
      if (!this.isFormValid) {
        return;
      }

      try {
        this.isConfirming = true;
        this.error = null;
        
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = currentUser.id || '1';
        
        // Create appointment data
        const appointmentData = {
          professionalId: this.professional.id,
          userId: userId,
          date: this.appointmentData.date,
          time: this.appointmentData.time,
          duration: this.appointmentData.duration,
          status: 'confirmed',
          notes: this.appointmentData.notes,
          contactPhone: this.contactInfo.phone,
          contactEmail: this.contactInfo.email,
          paymentMethod: this.selectedPayment,
          amount: this.professional.price
        };
        
        // Initialize services
        const appointmentService = new AppointmentService();
        const subscriptionService = new SubscriptionService();
        
        // Save appointment
        const appointment = await appointmentService.bookAppointment(appointmentData);
        console.log('Appointment created:', appointment);
        
        // Create subscription/payment record if payment method is credit card
        if (this.selectedPayment === 'credit' && this.cardInfo.numberCard) {
          const subscriptionData = {
            userId: userId,
            planId: appointment.id || 'session-' + Date.now(), // Use appointment ID as plan reference
            nameUser: this.cardInfo.nameUser,
            lastNameUser: this.cardInfo.lastNameUser,
            emailUser: this.contactInfo.email,
            numberCard: this.cardInfo.numberCard,
            expirationDate: this.cardInfo.expirationDate,
            cvv: this.cardInfo.cvv,
            isActive: true
          };
          
          const subscription = await subscriptionService.createSubscription(subscriptionData);
          console.log('Subscription/Payment created:', subscription);
        }
        
        // Save contact info for future use
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        userInfo.email = this.contactInfo.email;
        userInfo.phone = this.contactInfo.phone;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        this.showSuccessModal = true;
        
      } catch (error) {
        console.error('Error confirming appointment:', error);
        this.error = 'Error al confirmar la cita. Por favor intenta nuevamente. ' + error.message;
      } finally {
        this.isConfirming = false;
      }
    },

    addToCalendar() {
      const startDate = new Date(this.appointmentData.date + 'T' + this.appointmentData.time);
      const endDate = new Date(startDate.getTime() + (this.appointmentData.duration * 60000));
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sesión de Terapia con ${this.professional.name}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=Sesión de terapia con ${this.professional.name} - NeuroZen&location=Online`;
      
      window.open(calendarUrl, '_blank');
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

.credit-card-form {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(45, 90, 74, 0.2);
  border-radius: 8px;
}

.credit-card-form .input-group {
  margin-bottom: 16px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .input-row {
    grid-template-columns: 1fr;
  }
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

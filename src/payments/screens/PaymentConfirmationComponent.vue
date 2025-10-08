<template>
  <div class="payment-confirmation-container">
    <!-- Success Animation -->
    <div class="success-animation">
      <div class="checkmark-circle">
        <div class="checkmark"></div>
      </div>
    </div>

    <!-- Confirmation Content -->
    <div class="confirmation-content">
      <h1>¡Pago Exitoso!</h1>
      <p class="success-message">
        Tu sesión ha sido reservada y confirmada. Te hemos enviado los detalles por correo electrónico.
      </p>

      <!-- Appointment Details -->
      <div class="appointment-details">
        <h2>Detalles de tu cita</h2>
        
        <div class="detail-item">
          <div class="detail-icon">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="detail-content">
            <h3>Profesional</h3>
            <p>{{ appointment.professionalName }}</p>
            <span class="specialty">{{ appointment.specialty }}</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">
            <i class="fas fa-calendar"></i>
          </div>
          <div class="detail-content">
            <h3>Fecha y hora</h3>
            <p>{{ formatDate(appointment.date) }}</p>
            <span class="time">{{ formatTime(appointment.time) }}</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="detail-content">
            <h3>Duración</h3>
            <p>{{ appointment.duration }} minutos</p>
            <span class="session-type">{{ appointment.sessionTypeName }}</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">
            <i class="fas fa-credit-card"></i>
          </div>
          <div class="detail-content">
            <h3>Método de pago</h3>
            <p>{{ payment.method }}</p>
            <span class="amount">${{ payment.amount }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Receipt -->
      <div class="payment-receipt">
        <h3>Recibo de pago</h3>
        <div class="receipt-details">
          <div class="receipt-row">
            <span>ID de transacción:</span>
            <span class="transaction-id">{{ payment.transactionId }}</span>
          </div>
          <div class="receipt-row">
            <span>Fecha de pago:</span>
            <span>{{ formatDate(payment.date) }}</span>
          </div>
          <div class="receipt-row">
            <span>Estado:</span>
            <span class="status confirmed">Confirmado</span>
          </div>
          <div class="receipt-row total">
            <span>Total pagado:</span>
            <span class="amount">${{ payment.amount }}</span>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps">
        <h3>Próximos pasos</h3>
        <div class="steps-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Revisa tu correo</h4>
              <p>Te hemos enviado un email con todos los detalles de tu cita y las instrucciones de conexión.</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Prepárate para tu sesión</h4>
              <p>Asegúrate de tener una conexión estable a internet y busca un lugar tranquilo y privado.</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Únete a la sesión</h4>
              <p>5 minutos antes de tu cita, recibirás un enlace para unirte a la videollamada.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="contact-info">
        <h3>¿Necesitas ayuda?</h3>
        <div class="contact-options">
          <div class="contact-option">
            <i class="fas fa-phone"></i>
            <div>
              <h4>Llámanos</h4>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="contact-option">
            <i class="fas fa-envelope"></i>
            <div>
              <h4>Escríbenos</h4>
              <p>soporte@neurozen.com</p>
            </div>
          </div>
          <div class="contact-option">
            <i class="fas fa-comments"></i>
            <div>
              <h4>Chat en vivo</h4>
              <p>Disponible 24/7</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="downloadReceipt" class="download-btn">
          <i class="fas fa-download"></i>
          Descargar recibo
        </button>
        <button @click="addToCalendar" class="calendar-btn">
          <i class="fas fa-calendar-plus"></i>
          Agregar al calendario
        </button>
        <button @click="viewAppointments" class="appointments-btn">
          <i class="fas fa-list"></i>
          Ver mis citas
        </button>
        <button @click="goToDashboard" class="dashboard-btn">
          <i class="fas fa-home"></i>
          Ir al inicio
        </button>
      </div>

      <!-- Policies Notice -->
      <div class="policies-notice">
        <h4>Política de cancelación</h4>
        <p>
          Puedes cancelar o reprogramar tu cita hasta 24 horas antes sin costo adicional. 
          Para cambios de último momento, puede aplicar una tarifa de cancelación.
        </p>
        <div class="policy-links">
          <a href="/terms" target="_blank">Términos de servicio</a>
          <a href="/privacy" target="_blank">Política de privacidad</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentConfirmationComponent',
  data() {
    return {
      appointment: {},
      payment: {},
      loading: false
    };
  },
  
  async mounted() {
    await this.loadConfirmationData();
  },
  
  methods: {
    async loadConfirmationData() {
      this.loading = true;
      
      try {
        // Get data from route params or storage
        const appointmentId = this.$route.params.appointmentId;
        const paymentId = this.$route.params.paymentId;
        
        // Mock data - replace with actual API calls
        this.appointment = {
          id: appointmentId || '12345',
          professionalName: 'Dra. María González',
          specialty: 'Psicóloga Clínica',
          date: '2024-01-15',
          time: '14:00',
          duration: 60,
          sessionTypeName: 'Terapia Individual'
        };
        
        this.payment = {
          id: paymentId || 'pay_67890',
          transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          method: 'Tarjeta de crédito terminada en 4242',
          amount: 150,
          date: new Date().toISOString().split('T')[0],
          status: 'confirmed'
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Error loading confirmation data:', error);
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('es-ES', options);
    },
    
    formatTime(timeString) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    },
    
    downloadReceipt() {
      // Mock download functionality
      const receiptData = {
        appointment: this.appointment,
        payment: this.payment,
        downloadDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(receiptData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `recibo_${this.payment.transactionId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    },
    
    addToCalendar() {
      const startDate = new Date(`${this.appointment.date}T${this.appointment.time}:00`);
      const endDate = new Date(startDate.getTime() + (this.appointment.duration * 60000));
      
      const event = {
        title: `Cita con ${this.appointment.professionalName}`,
        start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        description: `Sesión de ${this.appointment.sessionTypeName} con ${this.appointment.professionalName}`
      };
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}`;
      
      window.open(googleCalendarUrl, '_blank');
    },
    
    viewAppointments() {
      this.$router.push({ name: 'UserAppointments' });
    },
    
    goToDashboard() {
      this.$router.push({ name: 'Dashboard' });
    }
  }
};
</script>

<style scoped>
.payment-confirmation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirmation-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Success Animation */
.success-animation {
  margin-bottom: 30px;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #48bb78;
  margin: 0 auto 20px;
  position: relative;
  animation: scaleIn 0.6s ease-out;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 15px;
  border-left: 4px solid white;
  border-bottom: 4px solid white;
  transform-origin: center;
  transform: translate(-50%, -60%) rotate(-45deg);
  animation: checkmarkDraw 0.4s ease-out 0.3s both;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkmarkDraw {
  0% {
    width: 0;
    height: 0;
  }
  100% {
    width: 30px;
    height: 15px;
  }
}

/* Content */
.confirmation-content h1 {
  color: #48bb78;
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
}

.success-message {
  color: #666;
  font-size: 18px;
  margin-bottom: 40px;
  line-height: 1.6;
}

/* Appointment Details */
.appointment-details {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: left;
}

.appointment-details h2 {
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  font-size: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  width: 50px;
  height: 50px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.detail-content h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.detail-content p {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.detail-content span {
  color: #666;
  font-size: 14px;
}

.detail-content .amount {
  color: #48bb78;
  font-weight: 600;
  font-size: 16px;
}

/* Payment Receipt */
.payment-receipt {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: left;
}

.payment-receipt h3 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.receipt-row:last-child {
  border-bottom: none;
}

.receipt-row.total {
  font-weight: 600;
  font-size: 18px;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
}

.transaction-id {
  font-family: monospace;
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.confirmed {
  background: #48bb78;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Next Steps */
.next-steps {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: left;
}

.next-steps h3 {
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  font-size: 20px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.step-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

/* Contact Info */
.contact-info {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: left;
}

.contact-info h3 {
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  font-size: 20px;
}

.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.contact-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.contact-option i {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.contact-option h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.contact-option p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.action-buttons button {
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.download-btn {
  background: #667eea;
  color: white;
}

.download-btn:hover {
  background: #5a67d8;
}

.calendar-btn {
  background: #48bb78;
  color: white;
}

.calendar-btn:hover {
  background: #38a169;
}

.appointments-btn {
  background: #ed8936;
  color: white;
}

.appointments-btn:hover {
  background: #dd7724;
}

.dashboard-btn {
  background: #9f7aea;
  color: white;
}

.dashboard-btn:hover {
  background: #805ad5;
}

/* Policies Notice */
.policies-notice {
  background: #fffaf0;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
}

.policies-notice h4 {
  color: #c05621;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.policies-notice p {
  color: #9c4221;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.policy-links {
  display: flex;
  gap: 20px;
}

.policy-links a {
  color: #c05621;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.policy-links a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .payment-confirmation-container {
    padding: 20px 10px;
  }
  
  .confirmation-content {
    padding: 30px 20px;
  }
  
  .confirmation-content h1 {
    font-size: 28px;
  }
  
  .success-message {
    font-size: 16px;
  }
  
  .detail-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .steps-list {
    gap: 25px;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .contact-options {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .policy-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>

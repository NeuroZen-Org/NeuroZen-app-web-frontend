import { HttpClient } from './HttpClient.js';

export class AppointmentService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAppointments(userId) {
    try {
      // Obtener citas del usuario
      const response = await this.httpClient.get(`/api/v1/appointments?patientId=${userId}`);
      return this._extractList(response);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw new Error('No se pudieron cargar las citas. Por favor intenta nuevamente.');
    }
  }

  async getAppointment(appointmentId) {
    try {
      // Obtener una cita específica por ID
      const response = await this.httpClient.get(`/api/v1/appointments/${appointmentId}`);
      return this._extractData(response);
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
      throw new Error('No se pudo cargar la cita. Por favor intenta nuevamente.');
    }
  }

  async bookAppointment(appointmentData) {
    try {
      // El componente ya envía los datos en el formato correcto del backend:
      // {
      //   patientId: number,
      //   professionalId: number,
      //   appointmentDateTime: "2025-12-02T18:18:13.093Z",
      //   appointmentType: number (1, 2, 3),
      //   notasAdicionales: string
      // }
      
      console.log('AppointmentService - Enviando datos:', appointmentData);

      const response = await this.httpClient.post('/api/v1/appointments', appointmentData);
      return this._extractData(response);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      throw new Error('No se pudo reservar la cita. Por favor intenta nuevamente.');
    }
  }

  async getAvailableSlots(therapistId, date) {
    try {
      // Intentar obtener slots disponibles del backend
      const response = await this.httpClient.get(`/api/v1/professionals/${therapistId}/available-slots?date=${date}`);
      return this._extractList(response);
    } catch (error) {
      // Si no existe el endpoint, devolver slots mock
      console.warn('Using mock available slots');
      return [
        "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
      ];
    }
  }

  async getAppointmentTypes() {
    try {
      // Intentar obtener tipos de cita del backend
      const response = await this.httpClient.get('/api/v1/appointments/types');
      return this._extractList(response);
    } catch (error) {
      console.warn('Could not fetch appointment types from backend, using default types');
      // Si no existe el endpoint, devolver tipos por defecto
      return [
        {
          id: 'therapy',
          name: 'Terapia Individual',
          description: 'Sesión personalizada uno a uno con el profesional',
          duration: 60,
          icon: 'fas fa-user'
        },
        {
          id: 'consultation',
          name: 'Consulta Inicial',
          description: 'Primera consulta para evaluación y diagnóstico',
          duration: 45,
          icon: 'fas fa-clipboard-list'
        },
        {
          id: 'follow-up',
          name: 'Seguimiento',
          description: 'Sesión de seguimiento y revisión de progreso',
          duration: 30,
          icon: 'fas fa-chart-line'
        }
      ];
    }
  }

  /**
   * Extrae datos de diferentes formatos de respuesta
   * @private
   */
  _extractData(response) {
    if (response.data) return response.data;
    if (response.success && response.data) return response.data;
    return response;
  }

  /**
   * Extrae listas de diferentes formatos de respuesta
   * @private
   */
  _extractList(response) {
    if (Array.isArray(response)) return response;
    if (response.items) return response.items;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.success && response.data && Array.isArray(response.data)) return response.data;
    return [];
  }
}

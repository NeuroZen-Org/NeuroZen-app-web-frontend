import { HttpClient } from './HttpClient.js';

export class AppointmentService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAppointments(userId) {
    try {
      const appointments = await this.httpClient.get(`/appointments/appointments/${userId}`);
      return appointments;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw new Error('Failed to fetch appointments: ' + error.message);
    }
  }

  async bookAppointment(appointmentData) {
    try {
      const appointment = await this.httpClient.post('/appointments', appointmentData);
      return appointment;
    } catch (error) {
      console.error('Failed to book appointment:', error);
      throw new Error('Failed to book appointment: ' + error.message);
    }
  }

  async getAvailableSlots(therapistId, date) {
    // Mock available time slots for demo purposes
    // In a real implementation, this would call the backend
    const slots = [
      "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
    ];
    
    return slots;
  }
}

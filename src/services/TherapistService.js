import { HttpClient } from './HttpClient.js';

export class TherapistService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getTherapists() {
    try {
      const response = await this.httpClient.get('/api/v1/professionals');
      // Manejar diferentes formatos de respuesta
      return this._extractList(response);
    } catch (error) {
      console.error('Failed to fetch therapists:', error);
      throw new Error('No se pudieron cargar los profesionales. Por favor intenta nuevamente.');
    }
  }

  async getTherapist(id) {
    try {
      const response = await this.httpClient.get(`/api/v1/professionals/${id}`);
      // Manejar diferentes formatos de respuesta
      return this._extractData(response);
    } catch (error) {
      console.error('Failed to fetch therapist:', error);
      throw new Error('No se pudo cargar el profesional. Por favor intenta nuevamente.');
    }
  }

  async getTherapistReviews(therapistId) {
    try {
      // Endpoint de reviews puede variar, ajustar según el backend
      const response = await this.httpClient.get(`/api/v1/professionals/${therapistId}/reviews`);
      return this._extractList(response);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      // Si no existe el endpoint, devolver array vacío
      return [];
    }
  }

  /**
   * Extrae datos de diferentes formatos de respuesta
   * @private
   */
  _extractData(response) {
    // Si es un objeto directo, devolverlo tal cual
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      // Si tiene estructura de envelope, extraer data
      if (response.data) return response.data;
      if (response.success && response.data) return response.data;
    }
    return response;
  }

  /**
   * Extrae listas de diferentes formatos de respuesta
   * @private
   */
  _extractList(response) {
    // Si ya es un array, devolverlo directamente
    if (Array.isArray(response)) return response;
    
    // Si tiene estructura de envelope o paginación
    if (response && typeof response === 'object') {
      if (response.items) return response.items;
      if (response.data && Array.isArray(response.data)) return response.data;
      if (response.success && response.data && Array.isArray(response.data)) return response.data;
    }
    
    return [];
  }
}

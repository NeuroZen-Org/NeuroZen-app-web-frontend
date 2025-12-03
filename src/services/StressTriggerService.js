/**
 * StressTriggerService - Servicio para gestión de triggers de estrés
 * Maneja la creación, obtención y eliminación de factores de estrés del usuario
 *
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { HttpClient } from "./HttpClient.js";

/**
 * Servicio para la gestión de triggers de estrés del usuario
 * Permite registrar, consultar y eliminar factores que causan estrés
 * @class StressTriggerService
 */
export class StressTriggerService {
  /**
   * Constructor del servicio de triggers de estrés
   * Inicializa el cliente HTTP para comunicación con la API
   */
  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Obtiene todos los triggers de estrés de un usuario específico
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de triggers de estrés del usuario
   * @throws {Error} Error si falla la obtención de triggers
   */
  async getStressTriggers(userId) {
    try {
      const response = await this.httpClient.get(`/api/v1/triggers?userId=${userId}`);
      return this._extractList(response);
    } catch (error) {
      console.error('Failed to fetch stress triggers:', error);
      throw new Error('No se pudieron cargar los triggers de estrés. Por favor intenta nuevamente.');
    }
  }

  /**
   * Agrega un nuevo trigger de estrés para el usuario
   * @param {Object} triggerData - Datos del trigger de estrés
   * @param {string} triggerData.userId - ID del usuario
   * @param {string} triggerData.category - Categoría del trigger
   * @param {string} triggerData.description - Descripción del trigger
   * @param {number} triggerData.stressLevel - Nivel de estrés (1-10)
   * @param {string} triggerData.date - Fecha del trigger
   * @param {string} triggerData.time - Hora del trigger
   * @returns {Promise<Object>} Trigger creado con ID y timestamp
   * @throws {Error} Error si falla la creación del trigger
   */
  async addStressTrigger(triggerData) {
    try {
      // Construir la fecha y hora en formato ISO
      let triggeredAt;
      if (triggerData.date && triggerData.time) {
        // Combinar fecha y hora en formato ISO
        triggeredAt = `${triggerData.date}T${triggerData.time}:00Z`;
      } else {
        triggeredAt = triggerData.createdAt || new Date().toISOString();
      }

      // Convertir stressLevel (1-10) a intensity (low, medium, high)
      let intensity = 'medium';
      if (triggerData.stressLevel) {
        if (triggerData.stressLevel <= 3) {
          intensity = 'low';
        } else if (triggerData.stressLevel <= 7) {
          intensity = 'medium';
        } else {
          intensity = 'high';
        }
      } else if (triggerData.intensity) {
        intensity = triggerData.intensity;
      }

      // Adaptar estructura de datos al backend
      const backendData = {
        userId: parseInt(triggerData.userId) || 1,
        description: triggerData.description || triggerData.trigger || '',
        category: triggerData.category || 'general',
        intensity: intensity,
        stressLevel: triggerData.stressLevel || 5,
        triggeredAt: triggeredAt
      };

      console.log('Sending trigger data to backend:', backendData);

      const response = await this.httpClient.post('/api/v1/triggers', backendData);
      return this._extractData(response);
    } catch (error) {
      console.error('Failed to add stress trigger:', error);
      // Mostrar error más detallado
      const errorMessage = error.message || 'Error desconocido';
      throw new Error('Error al guardar el registro: ' + errorMessage);
    }
  }

  /**
   * Elimina un trigger de estrés específico
   * @param {string} triggerId - ID del trigger a eliminar
   * @throws {Error} Error si falla la eliminación del trigger
   */
  async deleteStressTrigger(triggerId) {
    try {
      await this.httpClient.delete(`/api/v1/triggers/${triggerId}`);
    } catch (error) {
      console.error('Failed to delete stress trigger:', error);
      throw new Error('No se pudo eliminar el trigger de estrés. Por favor intenta nuevamente.');
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

  /**
   * Obtiene las categorías predefinidas de triggers de estrés
   * @returns {Array<string>} Lista de claves de categorías para i18n
   */
  getStressTriggerCategories() {
    return [
      "meeting",
      "deadline",
      "interpersonalConflict",
      "workOverload",
      "technicalProblems",
      "difficultClient",
      "organizationalChanges",
      "other",
    ];
  }
}

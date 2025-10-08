/**
 * DashboardService - Servicio para gestión de datos del dashboard
 * Obtiene y procesa estadísticas de estrés personalizadas por usuario
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { HttpClient } from './HttpClient.js';

/**
 * Servicio principal para la gestión de datos del dashboard
 * Proporciona estadísticas de estrés personalizadas por usuario
 * @class DashboardService
 */
export class DashboardService {
  /**
   * Constructor del servicio de dashboard
   * Inicializa el cliente HTTP para comunicación con la API
   */
  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Obtiene los datos de estrés del usuario actual
   * Intenta obtener datos específicos del usuario, con fallback a datos generales
   * @returns {Promise<Object>} Datos de estrés del usuario incluyendo niveles y estadísticas semanales
   * @throws {Error} Error si falla la obtención de datos
   */
  async getStressData() {
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id;
      
      if (userId) {
        // Get user-specific stress data
        const userData = await this.httpClient.get(`/users/${userId}`);
        if (userData && userData.stressData) {
          return userData.stressData;
        }
      }
      
      // Fallback to general stress data if user-specific data not available
      const stressData = await this.httpClient.get('/stressData');
      
      // Map Spanish day names to translation keys
      const dayMapping = {
        'Lun': 'monday',
        'Mar': 'tuesday', 
        'Mié': 'wednesday',
        'Jue': 'thursday',
        'Vie': 'friday',
        'Sáb': 'saturday',
        'Dom': 'sunday'
      };
      
      // Transform day names to translation keys
      if (stressData.weeklyData) {
        stressData.weeklyData = stressData.weeklyData.map(item => ({
          ...item,
          day: dayMapping[item.day] || item.day
        }));
      }
      
      return stressData;
    } catch (error) {
      throw new Error('Failed to fetch stress data: ' + error.message);
    }
  }

  /**
   * Actualiza los datos de estrés para un período específico
   * Proporciona datos simulados para diferentes períodos de tiempo
   * @param {string} period - Período de tiempo ('day', 'week', 'month')
   * @returns {Promise<Object>} Datos de estrés para el período especificado
   */
  async updateStressPeriod(period) {
    // Simulated data for different periods
    const mockData = {
      day: {
        currentLevel: 72,
        average: 68,
        peakHours: "2 PM - 4 PM",
        weeklyChange: 5,
        weeklyData: [
          { day: "00:00", value: 45 },
          { day: "04:00", value: 30 },
          { day: "08:00", value: 60 },
          { day: "12:00", value: 75 },
          { day: "16:00", value: 85 },
          { day: "20:00", value: 55 },
          { day: "24:00", value: 40 }
        ]
      },
      month: {
        currentLevel: 58,
        average: 52,
        peakHours: "10 AM - 12 PM",
        weeklyChange: -15,
        weeklyData: [
          { day: "Sem 1", value: 62 },
          { day: "Sem 2", value: 58 },
          { day: "Sem 3", value: 48 },
          { day: "Sem 4", value: 55 }
        ]
      }
    };

    return mockData[period] || await this.getStressData();
  }
}

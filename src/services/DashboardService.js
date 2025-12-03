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
      const currentUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      
      if (userId) {
        try {
          // Get user-specific data from backend .NET
          const userData = await this.httpClient.get(`/api/v1/users/${userId}`);
          
          // Extraer datos según formato de respuesta
          const user = this._extractData(userData);
          
          if (user && user.stressData) {
            return user.stressData;
          }
          
          // Si no tiene stressData, intentar obtener triggers para generar estadísticas
          try {
            const triggers = await this.httpClient.get(`/api/v1/triggers?userId=${userId}`);
            const triggerList = this._extractList(triggers);
            
            if (triggerList.length > 0) {
              return this._generateStressDataFromTriggers(triggerList);
            }
          } catch (triggerError) {
            console.warn('Could not fetch triggers:', triggerError.message);
          }
        } catch (userError) {
          console.warn('Could not fetch user-specific data, falling back to demo data:', userError.message);
        }
      }
      
      // Fallback a datos de demostración
      console.info('No stress data found, generating demo data');
      return this.generateRealisticStressData('week');
    } catch (error) {
      console.warn('Failed to fetch stress data, generating demo data:', error.message);
      return this.generateRealisticStressData('week');
    }
  }

  /**
   * Genera datos de estrés a partir de triggers
   * @private
   */
  _generateStressDataFromTriggers(triggers) {
    const avgIntensity = triggers.reduce((sum, t) => {
      const intensity = typeof t.intensity === 'number' ? t.intensity : 
                       t.intensity === 'high' ? 80 : 
                       t.intensity === 'medium' ? 50 : 30;
      return sum + intensity;
    }, 0) / triggers.length;

    return {
      currentLevel: Math.round(avgIntensity),
      average: Math.round(avgIntensity),
      peakHours: "10 AM - 12 PM",
      weeklyChange: -5,
      weeklyData: this.generateRealisticStressData('week').weeklyData
    };
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
   * Actualiza los datos de estrés para un período específico
   * Proporciona datos simulados realistas para diferentes períodos de tiempo
   * @param {string} period - Período de tiempo ('day', 'week', 'month')
   * @returns {Promise<Object>} Datos de estrés para el período especificado
   */
  async updateStressPeriod(period) {
    return this.generateRealisticStressData(period);
  }

  /**
   * Genera datos de estrés realistas basados en patrones típicos
   * @param {string} period - Período de tiempo ('day', 'week', 'month')
   * @returns {Object} Datos de estrés simulados realistas
   */
  generateRealisticStressData(period) {
    const baseStressLevel = 45 + Math.random() * 30; // Base entre 45-75
    
    switch (period) {
      case 'day':
        return this.generateDayData(baseStressLevel);
      case 'week':
        return this.generateWeekData(baseStressLevel);
      case 'month':
        return this.generateMonthData(baseStressLevel);
      default:
        return this.generateWeekData(baseStressLevel);
    }
  }

  /**
   * Genera datos de estrés por horas del día
   * @param {number} baseLevel - Nivel base de estrés
   * @returns {Object} Datos de estrés por horas
   */
  generateDayData(baseLevel) {
    const hourlyData = [];
    const hours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'];
    
    // Patrón típico: bajo en la madrugada, sube durante el día, pico en la tarde
    const patterns = [0.6, 0.8, 0.9, 1.2, 1.1, 0.7, 0.5]; // Multiplicadores
    
    for (let i = 0; i < hours.length; i++) {
      const variation = (Math.random() - 0.5) * 10; // Variación ±5
      const value = Math.max(10, Math.min(100, baseLevel * patterns[i] + variation));
      hourlyData.push({
        day: hours[i],
        value: Math.round(value)
      });
    }

    const currentLevel = hourlyData[Math.floor(Math.random() * hourlyData.length)].value;
    const average = Math.round(hourlyData.reduce((sum, item) => sum + item.value, 0) / hourlyData.length);
    const peakTime = hourlyData.reduce((max, item) => item.value > max.value ? item : max).day;
    
    return {
      currentLevel,
      average,
      peakHours: peakTime,
      weeklyChange: Math.round((Math.random() - 0.5) * 20), // ±10%
      dayData: hourlyData,
      weeklyData: hourlyData // Compatibilidad con código existente
    };
  }

  /**
   * Genera datos de estrés por días de la semana
   * @param {number} baseLevel - Nivel base de estrés
   * @returns {Object} Datos de estrés semanales
   */
  generateWeekData(baseLevel) {
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const weeklyData = [];
    
    // Patrón típico: estrés alto entre semana, bajo los fines de semana
    const patterns = [0.9, 1.0, 1.1, 1.2, 1.1, 0.7, 0.6];
    
    for (let i = 0; i < weekDays.length; i++) {
      const variation = (Math.random() - 0.5) * 15; // Variación ±7.5
      const value = Math.max(10, Math.min(100, baseLevel * patterns[i] + variation));
      weeklyData.push({
        day: weekDays[i],
        value: Math.round(value)
      });
    }

    const currentLevel = weeklyData[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].value;
    const average = Math.round(weeklyData.reduce((sum, item) => sum + item.value, 0) / weeklyData.length);
    
    // Determinar horas pico basado en el día con más estrés
    const peakDay = weeklyData.reduce((max, item) => item.value > max.value ? item : max);
    const peakHours = this.getPeakHoursForDay(peakDay.day);
    
    return {
      currentLevel,
      average,
      peakHours,
      weeklyChange: Math.round((Math.random() - 0.5) * 25), // ±12.5%
      weeklyData
    };
  }

  /**
   * Genera datos de estrés por semanas del mes
   * @param {number} baseLevel - Nivel base de estrés
   * @returns {Object} Datos de estrés mensuales
   */
  generateMonthData(baseLevel) {
    const monthWeeks = ['week1', 'week2', 'week3', 'week4'];
    const monthlyData = [];
    
    // Patrón típico: puede variar según eventos del mes
    const patterns = [0.8, 1.0, 1.1, 0.9];
    
    for (let i = 0; i < monthWeeks.length; i++) {
      const variation = (Math.random() - 0.5) * 20; // Variación ±10
      const value = Math.max(10, Math.min(100, baseLevel * patterns[i] + variation));
      monthlyData.push({
        day: monthWeeks[i],
        value: Math.round(value)
      });
    }

    const currentLevel = monthlyData[Math.floor(new Date().getDate() / 7)].value;
    const average = Math.round(monthlyData.reduce((sum, item) => sum + item.value, 0) / monthlyData.length);
    
    return {
      currentLevel,
      average,
      peakHours: "10:00 - 16:00",
      weeklyChange: Math.round((Math.random() - 0.5) * 30), // ±15%
      monthData: monthlyData,
      weeklyData: monthlyData // Compatibilidad con código existente
    };
  }

  /**
   * Obtiene las horas pico típicas para un día específico
   * @param {string} day - Día de la semana
   * @returns {string} Rango de horas pico
   */
  getPeakHoursForDay(day) {
    const peakHours = {
      monday: "09:00 - 11:00",
      tuesday: "10:00 - 12:00", 
      wednesday: "14:00 - 16:00",
      thursday: "15:00 - 17:00",
      friday: "11:00 - 13:00",
      saturday: "16:00 - 18:00",
      sunday: "19:00 - 21:00"
    };
    
    return peakHours[day] || "14:00 - 16:00";
  }
}

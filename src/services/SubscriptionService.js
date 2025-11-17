/**
 * SubscriptionService - Servicio para gestión de suscripciones y pagos
 * Maneja la creación y consulta de suscripciones en el backend
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { HttpClient } from './HttpClient.js';

/**
 * Servicio para la gestión de suscripciones y pagos
 * @class SubscriptionService
 */
export class SubscriptionService {
  /**
   * Constructor del servicio de suscripciones
   * Inicializa el cliente HTTP para comunicación con la API
   */
  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Crea una nueva suscripción/pago en el backend
   * @param {Object} subscriptionData - Datos de la suscripción
   * @param {string} subscriptionData.userId - ID del usuario
   * @param {string} subscriptionData.planId - ID del plan de suscripción
   * @param {string} subscriptionData.nameUser - Nombre del usuario
   * @param {string} subscriptionData.lastNameUser - Apellido del usuario
   * @param {string} subscriptionData.emailUser - Email del usuario
   * @param {string} subscriptionData.numberCard - Número de tarjeta
   * @param {string} subscriptionData.expirationDate - Fecha de expiración (MM/YY)
   * @param {string} subscriptionData.cvv - CVV de la tarjeta
   * @param {boolean} subscriptionData.isActive - Estado de la suscripción
   * @returns {Promise<Object>} Suscripción creada
   * @throws {Error} Error si falla la creación
   */
  async createSubscription(subscriptionData) {
    try {
      const subscription = await this.httpClient.post('/subscriptions', {
        userId: subscriptionData.userId,
        planId: subscriptionData.planId,
        nameUser: subscriptionData.nameUser,
        lastNameUser: subscriptionData.lastNameUser,
        emailUser: subscriptionData.emailUser,
        numberCard: subscriptionData.numberCard,
        expirationDate: subscriptionData.expirationDate,
        cvv: subscriptionData.cvv,
        isActive: subscriptionData.isActive !== undefined ? subscriptionData.isActive : true
      });
      return subscription;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw new Error('Failed to create subscription: ' + error.message);
    }
  }

  /**
   * Obtiene las suscripciones de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de suscripciones del usuario
   * @throws {Error} Error si falla la consulta
   */
  async getUserSubscriptions(userId) {
    try {
      const subscriptions = await this.httpClient.get(`/subscriptions/user/${userId}`);
      return subscriptions;
    } catch (error) {
      console.error('Failed to fetch user subscriptions:', error);
      throw new Error('Failed to fetch user subscriptions: ' + error.message);
    }
  }

  /**
   * Obtiene el plan activo de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object|null>} Suscripción activa o null
   * @throws {Error} Error si falla la consulta
   */
  async getActiveSubscription(userId) {
    try {
      const subscriptions = await this.getUserSubscriptions(userId);
      return subscriptions.find(sub => sub.isActive === true) || null;
    } catch (error) {
      console.error('Failed to fetch active subscription:', error);
      throw new Error('Failed to fetch active subscription: ' + error.message);
    }
  }

  /**
   * Obtiene suscripciones por plan
   * @param {string} planId - ID del plan
   * @returns {Promise<Array>} Lista de suscripciones del plan
   * @throws {Error} Error si falla la consulta
   */
  async getSubscriptionsByPlan(planId) {
    try {
      const subscriptions = await this.httpClient.get(`/subscriptions/plan/${planId}`);
      return subscriptions;
    } catch (error) {
      console.error('Failed to fetch subscriptions by plan:', error);
      throw new Error('Failed to fetch subscriptions by plan: ' + error.message);
    }
  }

  /**
   * Obtiene suscripciones activas o inactivas
   * @param {boolean} isActive - Estado de activación
   * @returns {Promise<Array>} Lista de suscripciones filtradas por estado
   * @throws {Error} Error si falla la consulta
   */
  async getSubscriptionsByStatus(isActive) {
    try {
      const subscriptions = await this.httpClient.get(`/subscriptions/active/${isActive}`);
      return subscriptions;
    } catch (error) {
      console.error('Failed to fetch subscriptions by status:', error);
      throw new Error('Failed to fetch subscriptions by status: ' + error.message);
    }
  }
}

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
      const triggers = await this.httpClient.get("/stressTriggers");
      return triggers.filter((trigger) => trigger.userId === userId);
    } catch (error) {
      throw new Error("Failed to fetch stress triggers: " + error.message);
    }
  }

  /**
   * Agrega un nuevo trigger de estrés para el usuario
   * @param {Object} triggerData - Datos del trigger de estrés
   * @param {string} triggerData.userId - ID del usuario
   * @param {string} triggerData.category - Categoría del trigger
   * @param {string} triggerData.description - Descripción del trigger
   * @param {number} triggerData.intensity - Intensidad del estrés (1-10)
   * @returns {Promise<Object>} Trigger creado con ID y timestamp
   * @throws {Error} Error si falla la creación del trigger
   */
  async addStressTrigger(triggerData) {
    try {
      const trigger = await this.httpClient.post("/stressTriggers", {
        ...triggerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      return trigger;
    } catch (error) {
      throw new Error("Failed to add stress trigger: " + error.message);
    }
  }

  /**
   * Elimina un trigger de estrés específico
   * @param {string} triggerId - ID del trigger a eliminar
   * @throws {Error} Error si falla la eliminación del trigger
   */
  async deleteStressTrigger(triggerId) {
    try {
      await this.httpClient.delete(`/stressTriggers/${triggerId}`);
    } catch (error) {
      throw new Error("Failed to delete stress trigger: " + error.message);
    }
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

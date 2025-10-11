/**
 * HttpClient - Cliente HTTP simple para comunicación con APIs
 * Proporciona métodos para realizar peticiones HTTP básicas (GET, POST, PUT, DELETE)
 * Soporta modo estático para Firebase Hosting
 * 
 * @author Juan Carlos Angulo
 * @version 1.1.0
 */

import { StaticAPIAdapter } from './StaticAPIAdapter.js';

/**
 * Cliente HTTP simple para realizar peticiones a APIs REST
 * @class HttpClient
 */
export class HttpClient {
  /**
   * Constructor del cliente HTTP
   * @param {string} baseURL - URL base de la API (usa variables de entorno por defecto)
   */
  constructor(baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002') {
    this.baseURL = baseURL;
    this.timeout = import.meta.env.VITE_API_TIMEOUT || 10000;
    
    // Detectar si estamos en modo estático
    this.isStaticMode = baseURL === 'static' || 
                       import.meta.env.VITE_API_MODE === 'static';
    
    if (this.isStaticMode) {
      this.staticAdapter = new StaticAPIAdapter();
      console.info('🔧 HttpClient: Using static API mode for Firebase Hosting');
    }
  }

  /**
   * Realiza una petición GET a un endpoint específico
   * @param {string} endpoint - Endpoint relativo a la URL base
   * @returns {Promise<Object>} Respuesta JSON de la API
   * @throws {Error} Error si la petición falla
   */
  async get(endpoint) {
    if (this.isStaticMode) {
      return await this.staticAdapter.get(endpoint);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST para crear un nuevo recurso
   * @param {string} endpoint - Endpoint relativo a la URL base
   * @param {Object} data - Datos a enviar en el cuerpo de la petición
   * @returns {Promise<Object>} Respuesta JSON de la API
   * @throws {Error} Error si la petición falla
   */
  async post(endpoint, data) {
    if (this.isStaticMode) {
      return await this.staticAdapter.post(endpoint, data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT para actualizar un recurso existente
   * @param {string} endpoint - Endpoint relativo a la URL base
   * @param {Object} data - Datos actualizados a enviar
   * @returns {Promise<Object>} Respuesta JSON de la API
   * @throws {Error} Error si la petición falla
   */
  async put(endpoint, data) {
    if (this.isStaticMode) {
      return await this.staticAdapter.put(endpoint, data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE para eliminar un recurso
   * @param {string} endpoint - Endpoint relativo a la URL base
   * @returns {Promise<Object|null>} Respuesta JSON de la API o null si es status 204
   * @throws {Error} Error si la petición falla
   */
  async delete(endpoint) {
    if (this.isStaticMode) {
      return await this.staticAdapter.delete(endpoint);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.status === 204 ? null : await response.json();
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  }
}

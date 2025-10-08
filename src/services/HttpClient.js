/**
 * HttpClient - Cliente HTTP simple para comunicación con APIs
 * Proporciona métodos para realizar peticiones HTTP básicas (GET, POST, PUT, DELETE)
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

/**
 * Cliente HTTP simple para realizar peticiones a APIs REST
 * @class HttpClient
 */
export class HttpClient {
  /**
   * Constructor del cliente HTTP
   * @param {string} baseURL - URL base de la API (por defecto: http://localhost:3002)
   */
  constructor(baseURL = 'http://localhost:3002') {
    this.baseURL = baseURL;
  }

  /**
   * Realiza una petición GET a un endpoint específico
   * @param {string} endpoint - Endpoint relativo a la URL base
   * @returns {Promise<Object>} Respuesta JSON de la API
   * @throws {Error} Error si la petición falla
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
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
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
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
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
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
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.status === 204 ? null : await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

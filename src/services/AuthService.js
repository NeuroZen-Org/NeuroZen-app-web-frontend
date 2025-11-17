/**
 * AuthService - Servicio de autenticación para NeuroZen App
 * Maneja el login, registro, logout y gestión de sesiones de usuarios
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { HttpClient } from './HttpClient.js';

/**
 * Servicio principal para la gestión de autenticación de usuarios
 * @class AuthService
 */
export class AuthService {
  /**
   * Constructor del servicio de autenticación
   * Inicializa el cliente HTTP para comunicación con la API
   */
  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Autentica un usuario con username y contraseña
   * @param {string} username - Username del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario autenticado con token JWT
   * @throws {Error} Error si las credenciales son inválidas
   */
  async login(username, password) {
    try {
      const response = await this.httpClient.post('/authentication/sign-in', {
        username,
        password
      });
      
      if (response && response.token) {
        // Store JWT token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('user', JSON.stringify(response));
        return response;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed: ' + error.message);
    }
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.username - Username del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario creado con autenticación automática
   * @throws {Error} Error si el usuario ya existe o falla el registro
   */
  async register(userData) {
    try {
      const response = await this.httpClient.post('/authentication/sign-up', {
        username: userData.username,
        password: userData.password
      });
      
      if (response) {
        // Automatically login after successful registration
        return await this.login(userData.username, userData.password);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed: ' + error.message);
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * Limpia todos los datos de autenticación del localStorage
   * @returns {Promise<boolean>} true si el logout fue exitoso
   * @throws {Error} Error si falla el logout
   */
  async logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  }

  /**
   * Obtiene los datos del usuario actualmente autenticado
   * @returns {Object|null} Datos del usuario o null si no hay usuario autenticado
   */
  getCurrentUser() {
    try {
      const userString = localStorage.getItem('currentUser');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si existe un usuario autenticado
   * @returns {boolean} true si hay un usuario autenticado, false en caso contrario
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}

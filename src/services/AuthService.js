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
   * Autentica un usuario con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario autenticado
   * @throws {Error} Error si las credenciales son inválidas
   */
  async login(email, password) {
    try {
      const users = await this.httpClient.get('/users');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Store authentication token and user data
        localStorage.setItem('authToken', 'fake-jwt-token');
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @param {string} userData.name - Nombre del usuario
   * @returns {Promise<Object>} Datos del usuario creado
   * @throws {Error} Error si el usuario ya existe o falla el registro
   */
  async register(userData) {
    try {
      const users = await this.httpClient.get('/users');
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString(),
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Actually persist to fake API
      const createdUser = await this.httpClient.post('/users', newUser);
      
      // Store auth info
      localStorage.setItem('authToken', 'fake-jwt-token');
      localStorage.setItem('currentUser', JSON.stringify(createdUser));
      localStorage.setItem('user', JSON.stringify(createdUser));
      
      return createdUser;
    } catch (error) {
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

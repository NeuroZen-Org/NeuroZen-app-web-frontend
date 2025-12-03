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
      console.log('🔐 Iniciando login...');
      
      // Llamar al endpoint real del backend .NET
      const response = await this.httpClient.post('/api/v1/authentication/sign-in', {
        username: email,  // El backend usa 'username'
        password: password
      });
      
      console.log('✅ Respuesta del backend:', response);
      
      // Guardar token primero
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        console.log('✅ Token guardado');
        
        // Obtener ID del usuario
        const userId = response.id || response.userId || (response.user && response.user.id);
        
        if (userId) {
          try {
            console.log(`📥 Obteniendo datos completos del usuario con ID: ${userId}`);
            
            // Obtener datos completos del usuario
            const fullUserData = await this.httpClient.get(`/api/v1/users/${userId}`);
            console.log('✅ Datos completos del usuario:', fullUserData);
            
            // Guardar datos completos
            localStorage.setItem('currentUser', JSON.stringify(fullUserData));
            localStorage.setItem('user', JSON.stringify(fullUserData));
            
            return fullUserData;
          } catch (userError) {
            console.warn('⚠️ No se pudieron obtener datos completos del usuario, usando datos básicos:', userError);
            // Si falla, guardar los datos básicos del login
            const basicUserData = response.user || response;
            localStorage.setItem('currentUser', JSON.stringify(basicUserData));
            localStorage.setItem('user', JSON.stringify(basicUserData));
            return basicUserData;
          }
        } else {
          // Si no hay userId, guardar lo que devolvió el backend
          const userData = response.user || response;
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
        }
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw new Error('Credenciales inválidas. Por favor verifica tu email y contraseña.');
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
      // Validaciones
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Email, password and name are required');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('📝 Iniciando registro...');
      console.log('📝 userData recibido:', {
        email: userData.email,
        name: userData.name,
        password: userData.password ? '***existe***' : '❌ NO EXISTE'
      });
      
      const requestBody = {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || ''
      };
      
      console.log('📝 Request body a enviar:', {
        username: requestBody.username,
        email: requestBody.email,
        password: requestBody.password ? '***existe***' : '❌ NO EXISTE',
        firstName: requestBody.firstName,
        lastName: requestBody.lastName
      });
      
      // Llamar al endpoint real del backend .NET
      const response = await this.httpClient.post('/api/v1/authentication/sign-up', requestBody);
      
      console.log('✅ Respuesta del registro:', response);
      
      // Guardar token y datos del usuario
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        console.log('✅ Token guardado');
        
        // Obtener ID del usuario
        const userId = response.id || response.userId || (response.user && response.user.id);
        
        if (userId) {
          try {
            console.log(`📥 Obteniendo datos completos del usuario con ID: ${userId}`);
            
            // Obtener datos completos del usuario
            const fullUserData = await this.httpClient.get(`/api/v1/users/${userId}`);
            console.log('✅ Datos completos del usuario:', fullUserData);
            
            // Guardar datos completos
            localStorage.setItem('currentUser', JSON.stringify(fullUserData));
            localStorage.setItem('user', JSON.stringify(fullUserData));
            
            return fullUserData;
          } catch (userError) {
            console.warn('⚠️ No se pudieron obtener datos completos del usuario, usando datos básicos:', userError);
            // Si falla, guardar los datos básicos del registro
            const basicUserData = response.user || response;
            localStorage.setItem('currentUser', JSON.stringify(basicUserData));
            localStorage.setItem('user', JSON.stringify(basicUserData));
            return basicUserData;
          }
        } else {
          // Si no hay userId, guardar lo que devolvió el backend
          const userData = response.user || response;
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw new Error('Error en el registro. ' + (error.message || 'Por favor intenta nuevamente.'));
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

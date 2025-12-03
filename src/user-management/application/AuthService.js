import { ApiAuthRepository } from '../infrastructure/ApiAuthRepository.js';
import { HttpClient } from '../../services/HttpClient.js';

export class AuthService {
  constructor() {
    this.authRepository = new ApiAuthRepository();
    this.http = new HttpClient();
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    try {
      const response = await this.http.post('/api/v1/authentication/sign-in', {
        username: email,
        password: password
      });

      if (response.token) {
        const user = response.user || response;
        
        console.log('=== DEBUG LOGIN ===');
        console.log('Respuesta del backend:', user);
        
        // Construir nombre completo priorizando fullName del backend
        let fullName = 'Usuario';
        if (user.fullName && !user.fullName.includes('@')) {
          fullName = user.fullName;
        } else if (user.name && !user.name.includes('@')) {
          fullName = user.name;
        } else if (user.firstName && user.lastName) {
          fullName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName && !user.firstName.includes('@')) {
          fullName = user.firstName;
        }
        
        // Preparar datos del usuario para el perfil
        const userProfile = {
          id: user.id || user.userId || Date.now(),
          name: fullName,
          fullName: fullName,
          email: user.email || email,
          username: user.username || email,
          firstName: user.firstName || fullName.split(' ')[0] || '',
          lastName: user.lastName || fullName.split(' ').slice(1).join(' ') || '',
          avatar: user.avatarUrl || user.avatar || user.profileImage || '/images-of-professionals/usuariodemo.jpg',
          memberSince: user.createdAt || user.registrationDate || user.memberSince || new Date().toISOString().split('T')[0],
          phone: user.phoneNumber || user.phone || '',
          birthDate: user.dateOfBirth || user.birthDate || '',
          address: user.address || '',
          gender: user.gender || ''
        };
        
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(userProfile));
        localStorage.setItem('user', JSON.stringify(userProfile));
        
        console.log('✅ Usuario logueado y guardado en localStorage:');
        console.log('- Nombre:', userProfile.name);
        console.log('- FullName:', userProfile.fullName);
        console.log('- Email:', userProfile.email);
        console.log('=== FIN DEBUG LOGIN ===');
        
        return user;
      }
      throw new Error(response.message || 'Invalid credentials');
    } catch(error) {
      console.error('Login failed:', error);
      throw new Error('Credenciales inválidas. Por favor verifica tu email y contraseña.');
    }
  }

  async register(userData) {
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Email, password and name are required');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    try {
      // Registrar usuario
      const response = await this.http.post('/api/v1/authentication/sign-up', {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        fullName: userData.name, // ✅ Enviar nombre completo
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || ''
      });

      const user = response.user || response;
      
      console.log('=== DEBUG REGISTRO ===');
      console.log('Datos del formulario - userData.name:', userData.name);
      console.log('Datos del formulario - userData.email:', userData.email);
      console.log('Respuesta del backend - user:', user);
      
      // Preparar datos del usuario para localStorage
      const userProfile = {
        id: user.id || user.userId || Date.now(),
        name: user.fullName || userData.name, // ✅ Priorizar fullName del backend
        fullName: user.fullName || userData.name,
        email: userData.email,
        username: user.username || userData.email,
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        avatar: user.avatarUrl || user.avatar || user.profileImage || '/images-of-professionals/usuariodemo.jpg',
        memberSince: user.createdAt || user.registrationDate || new Date().toISOString().split('T')[0],
        phone: user.phoneNumber || user.phone || '',
        birthDate: user.dateOfBirth || user.birthDate || '',
        address: user.address || '',
        gender: user.gender || ''
      };

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(userProfile));
        localStorage.setItem('user', JSON.stringify(userProfile));
        
        console.log('✅ Usuario registrado y guardado en localStorage:');
        console.log('- Nombre guardado:', userProfile.name);
        console.log('- FullName guardado:', userProfile.fullName);
        console.log('- Email guardado:', userProfile.email);
        console.log('- MemberSince guardado:', userProfile.memberSince);
        console.log('- CreatedAt del backend:', user.createdAt);
        console.log('- Objeto completo:', userProfile);
        console.log('- Objeto completo:', userProfile);
        console.log('=== FIN DEBUG REGISTRO ===');
        
        return user;
      }

      return response;
    } catch(error) {
      console.error('Registration failed:', error);
      throw new Error('Error en el registro. ' + (error.message || 'Por favor intenta nuevamente.'));
    }
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    return true;
  }

  async getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}

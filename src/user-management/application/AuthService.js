import { ApiAuthRepository } from '../infrastructure/ApiAuthRepository.js';

export class AuthService {
  constructor() {
    this.authRepository = new ApiAuthRepository();
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const response = await this.authRepository.login(email, password);
    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data;
  }

  async register(userData) {
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Email, password and name are required');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const response = await this.authRepository.register(userData);
    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data;
  }

  async logout() {
    const response = await this.authRepository.logout();
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getCurrentUser() {
    const response = await this.authRepository.getCurrentUser();
    return response.success ? response.data : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}

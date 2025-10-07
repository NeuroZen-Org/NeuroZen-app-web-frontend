import { HttpClient } from '../../../shared/infrastructure/HttpClient.js';
import { AuthRepository } from '../../domain/repositories/AuthRepository.js';
import { User } from '../../domain/models/User.js';
import { ApiResponse } from '../../../shared/domain/models/ApiResponse.js';

export class ApiAuthRepository extends AuthRepository {
  constructor() {
    super();
    this.httpClient = new HttpClient();
  }

  async login(email, password) {
    try {
      const users = await this.httpClient.get('/users');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userModel = User.fromApiResponse(user);
        // Simular token storage
        localStorage.setItem('authToken', 'fake-jwt-token');
        localStorage.setItem('currentUser', JSON.stringify(userModel));
        return ApiResponse.success(userModel, 'Login successful');
      } else {
        return ApiResponse.error('Invalid credentials');
      }
    } catch (error) {
      return ApiResponse.error('Login failed: ' + error.message);
    }
  }

  async register(userData) {
    try {
      const users = await this.httpClient.get('/users');
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        return ApiResponse.error('User already exists');
      }

      const newUser = new User({
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...userData
      });

      // Simulate user creation
      const userModel = User.fromApiResponse(newUser);
      localStorage.setItem('authToken', 'fake-jwt-token');
      localStorage.setItem('currentUser', JSON.stringify(userModel));
      
      return ApiResponse.success(userModel, 'Registration successful');
    } catch (error) {
      return ApiResponse.error('Registration failed: ' + error.message);
    }
  }

  async logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return ApiResponse.success(null, 'Logout successful');
    } catch (error) {
      return ApiResponse.error('Logout failed: ' + error.message);
    }
  }

  async getCurrentUser() {
    try {
      const userString = localStorage.getItem('currentUser');
      if (userString) {
        const userData = JSON.parse(userString);
        return ApiResponse.success(User.fromApiResponse(userData));
      }
      return ApiResponse.error('No user logged in');
    } catch (error) {
      return ApiResponse.error('Failed to get current user: ' + error.message);
    }
  }
}

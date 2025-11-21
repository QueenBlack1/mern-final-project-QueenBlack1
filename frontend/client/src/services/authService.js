import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

class AuthService {
  constructor() {
    this.token = null;
  }

  async setToken(token) {
    this.token = token;
    await AsyncStorage.setItem('token', token);
  }

  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('token');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('token');
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    const data = await this.request('/auth/signin', {
      method: 'POST',
      body: { email, password }
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data.user;
  }

  async signUp(userData) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: userData
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data.user;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async signOut() {
    await this.clearToken();
  }
}

export const authService = new AuthService();
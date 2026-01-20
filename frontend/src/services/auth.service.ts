import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    );
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<any> {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      userData
    );
    return response.data;
  },

  async updatePassword(newPassword: string): Promise<any> {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.UPDATE_PASSWORD}`,
      { password: newPassword }
    );
    return response.data;
  },

  async getCurrentUser(token: string): Promise<any> {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  setAuthToken(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeAuthToken() {
    delete axios.defaults.headers.common['Authorization'];
  },

  async getAllUsers(): Promise<any[]> {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.GET_ALL_USERS}`
    );
    return response.data;
  },

  async updateUserStatus(userId: number, status: string): Promise<any> {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.UPDATE_USER_STATUS}${userId}`,
      { status }
    );
    return response.data;
  },
};

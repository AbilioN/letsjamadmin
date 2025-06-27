import type { IAuthRepository } from '~/types/domain';
import type { LoginRequest, LoginResponse, Admin, UsersResponse } from '~/types/api';
import { ApiClient } from '../http/ApiClient';
import { API_CONFIG } from '~/config/api';

export class AuthRepository implements IAuthRepository {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = {
      email,
      password,
    };

    // Deixar o erro ser propagado para o serviço tratar
    const response = await this.apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, loginData);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
      // Não lançar erro no logout, pois queremos limpar o estado local mesmo se a API falhar
    }
  }

  async getCurrentUser(): Promise<Admin | null> {
    try {
      const response = await this.apiClient.get<{ admin: Admin }>(API_CONFIG.ENDPOINTS.ME);
      return response.admin;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  async getUsers(page: number = 1, perPage: number = 15): Promise<UsersResponse> {
    try {
      const response = await this.apiClient.get<UsersResponse>(`/users?page=${page}&per_page=${perPage}`);
      return response;
    } catch (error) {
      console.error('Get users failed:', error);
      throw new Error('Falha ao buscar usuários');
    }
  }
} 
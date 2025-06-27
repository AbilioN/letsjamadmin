import type { IAuthService } from '~/types/domain';
import type { LoginResponse, Admin, ApiResponse } from '~/types/api';
import { AuthRepository } from '~/infrastructure/repositories/AuthRepository';

export class AuthService implements IAuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.authRepository.login(email, password);
      
      // Salvar token no localStorage
      this.setToken(response.token);
      
      return {
        success: true,
        data: response,
        message: 'Login realizado com sucesso'
      };
    } catch (error) {
      // Capturar a mensagem específica de erro da API
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authRepository.logout();
    } finally {
      // Sempre limpar o token local, mesmo se a API falhar
      this.clearToken();
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (process.client) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token: string): void {
    if (process.client) {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken(): void {
    if (process.client) {
      localStorage.removeItem('auth_token');
    }
  }

  async getCurrentUser(): Promise<Admin | null> {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    return await this.authRepository.getCurrentUser();
  }
} 
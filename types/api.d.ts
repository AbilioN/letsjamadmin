// Tipos da API
export interface Admin {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
} 
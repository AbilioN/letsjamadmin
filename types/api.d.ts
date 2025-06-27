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

// Tipos para Usuários
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
} 
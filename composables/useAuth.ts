import type { Admin } from '~/types/api';
import { AuthService } from '~/services/AuthService';

export const useAuth = () => {
  // Estado reativo do usuário
  const user = useState<Admin | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  
  // Instância do serviço de autenticação
  const authService = new AuthService();

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.data) {
        user.value = result.data.admin;
        
        // Salvar dados do usuário no localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(result.data.admin));
        }
        
        return { success: true };
      } else {
        // Retornar a mensagem de erro específica da API
        return { 
          success: false, 
          error: result.error || 'Credenciais inválidas' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer login' 
      };
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      user.value = null;
      if (process.client) {
        localStorage.removeItem('user');
      }
      navigateTo('/auth/login');
    }
  }

  // Função para verificar se o usuário está logado (usado no middleware)
  const checkAuth = async () => {
    if (process.client && !user.value) {
      // Tentar recuperar usuário do localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      }
      
      // Se não há usuário salvo mas há token, tentar buscar dados do usuário
      if (!user.value && authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          user.value = currentUser;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      }
    }
    return isAuthenticated.value;
  }

  // Inicializar o estado quando o composable for usado
  if (process.client) {
    checkAuth();
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
} 
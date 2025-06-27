interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  // Estado reativo do usuário
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  // Função de login
  const login = async (username: string, password: string) => {
    try {
      // Simular uma chamada de API
      // Em produção, você faria uma chamada real para seu backend
      if (username === 'admin' && password === 'admin') {
        user.value = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          name: 'Administrador'
        }
        
        // Salvar no localStorage para persistir entre sessões
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user.value))
        }
        
        return { success: true }
      } else {
        return { success: false, error: 'Credenciais inválidas' }
      }
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' }
    }
  }

  // Função de logout
  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('user')
    }
    navigateTo('/auth/login')
  }

  // Função para verificar se o usuário está logado (usado no middleware)
  const checkAuth = () => {
    if (process.client && !user.value) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    }
    return isAuthenticated.value
  }

  // Inicializar o estado quando o composable for usado
  if (process.client) {
    checkAuth()
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
} 
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getPusherConfig } from '~/config/pusher';

// Declaração do tipo para window.Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  console.log('🔌 Plugin Echo iniciando...');
  console.log('🔌 Runtime config:', config);

  // Configuração do Pusher
  window.Pusher = Pusher;
  console.log('🔌 Pusher configurado no window:', window.Pusher);

  // Obter configuração centralizada
  const pusherConfig = getPusherConfig();
  console.log('🔌 Configuração Pusher:', pusherConfig);

  // Criar instância do Echo
  const echo = new Echo({
    ...pusherConfig,
    // Configurações adicionais para autenticação
    auth: {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    }
  });

  console.log('🔌 Instância Echo criada:', echo);
  console.log('🔌 Token de autenticação:', localStorage.getItem('auth_token'));

  // Fornecer Echo globalmente
  return {
    provide: {
      echo
    }
  };
}); 
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Declaração do tipo para window.Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Configuração do Pusher
  window.Pusher = Pusher;

  // Criar instância do Echo
  const echo = new Echo({
    broadcaster: 'pusher',
    key: config.public.pusherKey,
    cluster: config.public.pusherCluster,
    forceTLS: true,
    encrypted: true,
    // Configurações adicionais para autenticação
    auth: {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    }
  });

  // Fornecer Echo globalmente
  return {
    provide: {
      echo
    }
  };
}); 
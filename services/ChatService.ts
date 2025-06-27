import { ChatRepository } from '~/infrastructure/repositories/ChatRepository';
import type { ChatMessage, ChatChannel } from '~/types/chat';

export class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  /**
   * Buscar mensagens de um canal
   */
  async getMessages(channelId: number): Promise<ChatMessage[]> {
    try {
      return await this.chatRepository.getMessages(channelId);
    } catch (error) {
      console.error('ChatService - getMessages error:', error);
      throw error;
    }
  }

  /**
   * Enviar mensagem
   */
  async sendMessage(channelId: number, message: string): Promise<ChatMessage> {
    try {
      // Validação básica
      if (!message.trim()) {
        throw new Error('Mensagem não pode estar vazia');
      }

      if (message.length > 1000) {
        throw new Error('Mensagem muito longa (máximo 1000 caracteres)');
      }

      return await this.chatRepository.sendMessage(channelId, message.trim());
    } catch (error) {
      console.error('ChatService - sendMessage error:', error);
      throw error;
    }
  }

  /**
   * Buscar canais disponíveis
   */
  async getChannels(): Promise<ChatChannel[]> {
    try {
      return await this.chatRepository.getChannels();
    } catch (error) {
      console.error('ChatService - getChannels error:', error);
      throw error;
    }
  }

  /**
   * Marcar mensagens como lidas
   */
  async markAsRead(channelId: number): Promise<void> {
    try {
      await this.chatRepository.markAsRead(channelId);
    } catch (error) {
      console.error('ChatService - markAsRead error:', error);
      throw error;
    }
  }

  /**
   * Buscar usuários online
   */
  async getOnlineUsers(): Promise<any[]> {
    try {
      return await this.chatRepository.getOnlineUsers();
    } catch (error) {
      console.error('ChatService - getOnlineUsers error:', error);
      throw error;
    }
  }

  /**
   * Formatar mensagem para exibição
   */
  formatMessage(message: ChatMessage): ChatMessage & { 
    time: string; 
    isOwn: boolean; 
  } {
    const currentUser = useAuth().user.value;
    
    return {
      ...message,
      time: new Date(message.created_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isOwn: message.user_id === currentUser?.id
    };
  }

  /**
   * Validar canal
   */
  validateChannel(channel: ChatChannel): boolean {
    return !!(
      channel.id &&
      channel.name &&
      channel.type &&
      ['public', 'private', 'direct'].includes(channel.type)
    );
  }

  /**
   * Filtrar mensagens por canal
   */
  filterMessagesByChannel(messages: ChatMessage[], channelId: number): ChatMessage[] {
    return messages.filter(message => {
      // Em um sistema real, você teria um campo channel_id na mensagem
      // Por enquanto, retornamos todas as mensagens
      return true;
    });
  }
} 
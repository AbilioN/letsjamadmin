import { ApiClient } from '~/infrastructure/http/ApiClient';
import type { ChatMessage, ChatChannel } from '~/types/chat';

export class ChatRepository {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Buscar mensagens de um canal
   */
  async getMessages(channelId: number): Promise<ChatMessage[]> {
    try {
      const response = await this.apiClient.get<{ data: ChatMessage[] }>(`/chat/messages/${channelId}`);
      return (response as any).data || response;
    } catch (error) {
      throw new Error('Erro ao buscar mensagens do chat');
    }
  }

  /**
   * Enviar mensagem
   */
  async sendMessage(channelId: number, message: string): Promise<ChatMessage> {
    try {
      const response = await this.apiClient.post<{ data: ChatMessage }>('/chat/messages', {
        channel_id: channelId,
        message
      });
      return (response as any).data || response;
    } catch (error) {
      throw new Error('Erro ao enviar mensagem');
    }
  }

  /**
   * Buscar canais disponíveis
   */
  async getChannels(): Promise<ChatChannel[]> {
    try {
      const response = await this.apiClient.get<{ data: ChatChannel[] }>('/chat/channels');
      return (response as any).data || response;
    } catch (error) {
      throw new Error('Erro ao buscar canais do chat');
    }
  }

  /**
   * Marcar mensagens como lidas
   */
  async markAsRead(channelId: number): Promise<void> {
    try {
      await this.apiClient.post(`/chat/channels/${channelId}/read`);
    } catch (error) {
      throw new Error('Erro ao marcar mensagens como lidas');
    }
  }

  /**
   * Buscar usuários online
   */
  async getOnlineUsers(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<{ data: any[] }>('/chat/users/online');
      return (response as any).data || response;
    } catch (error) {
      throw new Error('Erro ao buscar usuários online');
    }
  }
} 
import { ApiClient } from '~/infrastructure/http/ApiClient';
import type { 
  ChatMessage, 
  Chat, 
  ApiResponse, 
  ChatResponse, 
  MessageResponse, 
  ChatMessageResponse,
  ConversationsResponse,
  MessagesResponse
} from '~/types/chat';

export class ChatRepository {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Enviar mensagem para outro usuário (cria/usa chat privado)
   */
  async sendMessageToUser(content: string, receiverId: number, receiverType: 'user' | 'admin'): Promise<ChatMessageResponse> {
    try {
      const response = await this.apiClient.post<ApiResponse<ChatMessageResponse>>('/chat/send', {
        content,
        receiver_type: receiverType,
        receiver_id: receiverId
      });
      return response.data;
    } catch (error) {
      console.error('ChatRepository - sendMessageToUser error:', error);
      throw new Error('Erro ao enviar mensagem');
    }
  }

  /**
   * Buscar conversa entre dois usuários
   */
  async getConversation(otherUserId: number, otherUserType: 'user' | 'admin', page: number = 1, perPage: number = 50): Promise<MessagesResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<MessagesResponse>>(`/chat/conversation?other_user_type=${otherUserType}&other_user_id=${otherUserId}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('ChatRepository - getConversation error:', error);
      throw new Error('Erro ao buscar conversa');
    }
  }

  /**
   * Listar todas as conversas do usuário
   */
  async getConversations(page: number = 1, perPage: number = 20): Promise<ConversationsResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<ConversationsResponse>>(`/chat/conversations?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('ChatRepository - getConversations error:', error);
      throw new Error('Erro ao buscar conversas');
    }
  }

  /**
   * Buscar mensagens de um chat específico
   */
  async getChatMessages(chatId: number, page: number = 1, perPage: number = 50): Promise<MessagesResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<MessagesResponse>>(`/chat/${chatId}/messages?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('ChatRepository - getChatMessages error:', error);
      throw new Error('Erro ao buscar mensagens do chat');
    }
  }

  /**
   * Enviar mensagem para um chat específico
   */
  async sendMessageToChat(chatId: number, content: string): Promise<MessageResponse> {
    try {
      const response = await this.apiClient.post<ApiResponse<MessageResponse>>(`/chat/${chatId}/send`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('ChatRepository - sendMessageToChat error:', error);
      throw new Error('Erro ao enviar mensagem');
    }
  }

  /**
   * Criar chat privado
   */
  async createPrivateChat(otherUserId: number, otherUserType: 'user' | 'admin'): Promise<ChatResponse> {
    try {
      const response = await this.apiClient.post<ApiResponse<ChatResponse>>('/chat/create-private', {
        other_user_id: otherUserId,
        other_user_type: otherUserType
      });
      return response.data;
    } catch (error) {
      console.error('ChatRepository - createPrivateChat error:', error);
      throw new Error('Erro ao criar chat privado');
    }
  }

  /**
   * Criar chat em grupo
   */
  async createGroupChat(name: string, description: string, participants: Array<{ user_id: number; user_type: 'user' | 'admin' }>): Promise<ChatResponse> {
    try {
      const response = await this.apiClient.post<ApiResponse<ChatResponse>>('/chat/create-group', {
        name,
        description,
        participants
      });
      return response.data;
    } catch (error) {
      console.error('ChatRepository - createGroupChat error:', error);
      throw new Error('Erro ao criar chat em grupo');
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
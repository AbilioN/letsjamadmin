import { ApiClient } from '~/infrastructure/http/ApiClient';
import type { 
  ChatMessage, 
  Chat, 
  ChatChannel,
  ApiResponse, 
  ChatResponse, 
  MessageResponse, 
  ChatMessageResponse,
  ChatsResponse,
  MessagesResponse
} from '~/types/chat';

export class ChatRepository {
  private apiClient: ApiClient;
  private chatApiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
    // Cliente específico para chat sem /admin
    this.chatApiClient = new ApiClient('http://localhost:8006/api');
  }

  /**
   * Enviar mensagem para outro usuário (cria/usa chat privado)
   */
  async sendMessageToUser(content: string, receiverId: number, receiverType: 'user' | 'admin'): Promise<ChatMessageResponse> {
    try {
      const response = await this.chatApiClient.post<ChatMessageResponse>('/chat/send', {
        content,
        receiver_type: receiverType,
        receiver_id: receiverId
      });
      return response;
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
      const response = await this.chatApiClient.get<MessagesResponse>(`/chat/conversation?other_user_type=${otherUserType}&other_user_id=${otherUserId}&page=${page}&per_page=${perPage}`);
      return response;
    } catch (error) {
      console.error('ChatRepository - getConversation error:', error);
      throw new Error('Erro ao buscar conversa');
    }
  }

  /**
   * Listar todos os chats do usuário
   */
  async getChats(page: number = 1, perPage: number = 20): Promise<ChatsResponse> {
    try {
      const response = await this.chatApiClient.get<ChatsResponse>(`/chats?page=${page}&per_page=${perPage}`);
      return response;
    } catch (error) {
      console.error('ChatRepository - getChats error:', error);
      throw new Error('Erro ao buscar chats');
    }
  }

  /**
   * Buscar mensagens de um chat específico
   */
  async getChatMessages(chatId: number, page: number = 1, perPage: number = 50): Promise<MessagesResponse> {
    try {
      const response = await this.chatApiClient.get<MessagesResponse>(`/chat/${chatId}/messages?page=${page}&per_page=${perPage}`);
      return response;
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
      const response = await this.chatApiClient.post<MessageResponse>(`/chat/${chatId}/send`, {
        content
      });
      return response;
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
      const response = await this.chatApiClient.post<ChatResponse>('/chat/create-private', {
        other_user_id: otherUserId,
        other_user_type: otherUserType
      });
      return response;
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
      const response = await this.chatApiClient.post<ChatResponse>('/chat/create-group', {
        name,
        description,
        participants
      });
      return response;
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
      const response = await this.chatApiClient.get<ChatChannel[]>('/chat/channels');
      return response;
    } catch (error) {
      throw new Error('Erro ao buscar canais do chat');
    }
  }

  /**
   * Marcar mensagens como lidas
   */
  async markAsRead(channelId: number): Promise<void> {
    try {
      await this.chatApiClient.post(`/chat/channels/${channelId}/read`);
    } catch (error) {
      throw new Error('Erro ao marcar mensagens como lidas');
    }
  }

  /**
   * Buscar usuários online
   */
  async getOnlineUsers(): Promise<any[]> {
    try {
      const response = await this.chatApiClient.get<any[]>('/chat/users/online');
      return response;
    } catch (error) {
      throw new Error('Erro ao buscar usuários online');
    }
  }
} 
import { ChatRepository } from '~/infrastructure/repositories/ChatRepository';
import type { 
  ChatMessage, 
  Chat, 
  ChatResponse, 
  MessageResponse, 
  ChatMessageResponse,
  ConversationsResponse,
  MessagesResponse
} from '~/types/chat';

export class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  /**
   * Criar chat privado
   */
  async createPrivateChat(otherUserId: number, otherUserType: 'user' | 'admin'): Promise<Chat> {
    try {
      const response = await this.chatRepository.createPrivateChat(otherUserId, otherUserType);
      return response.chat;
    } catch (error) {
      console.error('ChatService - createPrivateChat error:', error);
      throw error;
    }
  }

  /**
   * Criar chat em grupo
   */
  async createGroupChat(name: string, description: string, participants: Array<{ user_id: number; user_type: 'user' | 'admin' }>): Promise<Chat> {
    try {
      const response = await this.chatRepository.createGroupChat(name, description, participants);
      return response.chat;
    } catch (error) {
      console.error('ChatService - createGroupChat error:', error);
      throw error;
    }
  }

  /**
   * Enviar mensagem para outro usuário (cria/usa chat privado)
   */
  async sendMessageToUser(content: string, otherUserId: number, otherUserType: 'user' | 'admin'): Promise<ChatMessageResponse> {
    try {
      // Validação básica
      if (!content.trim()) {
        throw new Error('Mensagem não pode estar vazia');
      }

      if (content.length > 1000) {
        throw new Error('Mensagem muito longa (máximo 1000 caracteres)');
      }

      return await this.chatRepository.sendMessageToUser(content.trim(), otherUserId, otherUserType);
    } catch (error) {
      console.error('ChatService - sendMessageToUser error:', error);
      throw error;
    }
  }

  /**
   * Enviar mensagem para um chat específico
   */
  async sendMessageToChat(chatId: number, content: string): Promise<ChatMessage> {
    try {
      // Validação básica
      if (!content.trim()) {
        throw new Error('Mensagem não pode estar vazia');
      }

      if (content.length > 1000) {
        throw new Error('Mensagem muito longa (máximo 1000 caracteres)');
      }

      const response = await this.chatRepository.sendMessageToChat(chatId, content.trim());
      return response.message;
    } catch (error) {
      console.error('ChatService - sendMessageToChat error:', error);
      throw error;
    }
  }

  /**
   * Buscar conversa privada entre dois usuários
   */
  async getConversation(otherUserId: number, otherUserType: 'user' | 'admin', page: number = 1, perPage: number = 50): Promise<MessagesResponse> {
    try {
      return await this.chatRepository.getConversation(otherUserId, otherUserType, page, perPage);
    } catch (error) {
      console.error('ChatService - getConversation error:', error);
      throw error;
    }
  }

  /**
   * Listar todos os chats do usuário
   */
  async getConversations(page: number = 1, perPage: number = 20): Promise<ConversationsResponse> {
    try {
      return await this.chatRepository.getConversations(page, perPage);
    } catch (error) {
      console.error('ChatService - getConversations error:', error);
      throw error;
    }
  }

  /**
   * Buscar mensagens de um chat específico
   */
  async getChatMessages(chatId: number, page: number = 1, perPage: number = 50): Promise<MessagesResponse> {
    try {
      return await this.chatRepository.getChatMessages(chatId, page, perPage);
    } catch (error) {
      console.error('ChatService - getChatMessages error:', error);
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
   * Validar chat
   */
  validateChat(chat: Chat): boolean {
    return !!(
      chat.id &&
      chat.type &&
      ['private', 'group'].includes(chat.type)
    );
  }

  /**
   * Obter nome do chat para exibição
   */
  getChatDisplayName(chat: Chat): string {
    if (!chat.name) {
      return chat.type === 'private' ? 'Chat Privado' : 'Chat em Grupo';
    }
    
    if (chat.type === 'private') {
      // Para chats privados, remover o nome do usuário atual do nome
      const currentUser = useAuth().user.value;
      if (currentUser && chat.name.includes(currentUser.name)) {
        return chat.name.replace(`${currentUser.name} - `, '').replace(` - ${currentUser.name}`, '');
      }
    }
    return chat.name;
  }

  /**
   * Verificar se o usuário pode enviar mensagem para o chat
   */
  canSendMessage(chat: Chat): boolean {
    // Implementar lógica de permissões se necessário
    return true;
  }
} 
import { ChatRepository } from '~/infrastructure/repositories/ChatRepository';
import type { 
  ChatMessage, 
  Chat, 
  ChatResponse, 
  ChatCreateResponse,
  MessageResponse, 
  MessageSendResponse,
  ChatMessageResponse,
  ChatMessageSendResponse,
  ChatsResponse,
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
      const response: ChatCreateResponse = await this.chatRepository.createPrivateChat(otherUserId, otherUserType);
      console.log('🔍 ChatService - createPrivateChat response:', response);
      
      // A API retorna { success: true, data: { ... } }
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Resposta inválida da API ao criar chat');
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
      const response: ChatCreateResponse = await this.chatRepository.createGroupChat(name, description, participants);
      
      // A API retorna { success: true, data: { ... } }
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Resposta inválida da API ao criar chat em grupo');
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

      const response: ChatMessageSendResponse = await this.chatRepository.sendMessageToUser(content.trim(), otherUserId, otherUserType);
      
      // A API retorna { success: true, data: { ... } }
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Resposta inválida da API ao enviar mensagem para usuário');
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

      const response: MessageSendResponse = await this.chatRepository.sendMessageToChat(chatId, content.trim());
      
      // A API retorna { success: true, data: { ... } }
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Resposta inválida da API ao enviar mensagem para chat');
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
  async getChats(page: number = 1, perPage: number = 20): Promise<ChatsResponse> {
    try {
      return await this.chatRepository.getChats(page, perPage);
    } catch (error) {
      console.error('ChatService - getChats error:', error);
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
    user_name: string;
  } {
    const currentUser = useAuth().user.value;
    
    return {
      ...message,
      time: new Date(message.created_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isOwn: message.sender_id === currentUser?.id,
      user_name: message.sender_type === 'admin' ? 'Admin' : 'Usuário'
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
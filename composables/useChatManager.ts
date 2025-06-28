import { ChatService } from '~/services/ChatService';
import type { 
  Chat, 
  ChatMessage, 
  ChatConversation, 
  ChatListResponse 
} from '~/types/chat';

export const useChatManager = () => {
  // Estados reativos
  const conversations = ref<Chat[]>([]);
  const currentChat = ref<Chat | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  });

  // Instância do serviço
  const chatService = new ChatService();

  // Instância do Echo
  const { $echo, $listenToChat, $stopListeningToChat } = useNuxtApp();

  // Dados do usuário atual
  const { user } = useAuth();
  const currentUser = computed(() => user.value);

  /**
   * Carregar lista de conversas
   */
  const loadConversations = async (page: number = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await chatService.getConversations(page);
      conversations.value = response.chats;
      pagination.value = response.pagination;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar conversas';
      console.error('Load conversations error:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Iniciar chat com usuário
   */
  const startChatWithUser = async (userId: number, userType: 'user' | 'admin' = 'user') => {
    loading.value = true;
    error.value = null;

    try {
      const chat = await chatService.createPrivateChat(userId, userType);
      
      // Adicionar à lista de conversas se não existir
      const existingChat = conversations.value.find(c => c.id === chat.id);
      if (!existingChat) {
        conversations.value.unshift(chat);
      }

      // Retornar o chat criado (não definir como atual automaticamente)
      return chat;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao iniciar chat';
      console.error('Start chat error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Carregar mensagens de um chat
   */
  const loadChatMessages = async (chatId: number, page: number = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await chatService.getChatMessages(chatId, page);
      
      if (page === 1) {
        messages.value = response.messages;
      } else {
        // Para paginação, adicionar mensagens no início
        messages.value.unshift(...response.messages);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      console.error('Load chat messages error:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Enviar mensagem para chat atual
   */
  const sendMessage = async (content: string) => {
    if (!currentChat.value || !content.trim()) return;

    try {
      const message = await chatService.sendMessageToChat(currentChat.value.id, content);
      
      // Adicionar mensagem à lista
      messages.value.push(message);
      
      // Atualizar última mensagem na conversa
      if (currentChat.value) {
        currentChat.value.last_message = message;
        currentChat.value.unread_count = 0;
      }

      return message;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      console.error('Send message error:', err);
      throw err;
    }
  };

  /**
   * Enviar mensagem para usuário específico
   */
  const sendMessageToUser = async (content: string, userId: number, userType: 'user' | 'admin' = 'user') => {
    try {
      const response = await chatService.sendMessageToUser(content, userId, userType);
      
      // Adicionar chat à lista se não existir
      const existingChat = conversations.value.find(c => c.id === response.chat.id);
      if (!existingChat) {
        conversations.value.unshift(response.chat);
      }

      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      console.error('Send message to user error:', err);
      throw err;
    }
  };

  /**
   * Selecionar chat
   */
  const selectChat = async (chat: Readonly<Chat>) => {
    // Parar de escutar o chat anterior se houver
    if (currentChat.value) {
      $stopListeningToChat(currentChat.value.id);
    }

    currentChat.value = { 
      ...chat, 
      participants: chat.participants ? [...chat.participants] : undefined 
    } as Chat;
    
    await loadChatMessages(chat.id);

    // Escutar mensagens do novo chat
    $listenToChat(chat.id, (message: any) => {
      messages.value.push(message);
      // Atualizar última mensagem na conversa
      if (currentChat.value) {
        currentChat.value.last_message = message;
        currentChat.value.unread_count = 0;
      }
    });
  };

  /**
   * Formatar nome do chat para exibição
   */
  const getChatDisplayName = (chat: Chat): string => {
    return chatService.getChatDisplayName(chat);
  };

  /**
   * Formatar mensagem para exibição
   */
  const formatMessage = (message: ChatMessage) => {
    return chatService.formatMessage(message);
  };

  /**
   * Verificar se mensagem é própria
   */
  const isOwnMessage = (message: ChatMessage): boolean => {
    return message.sender_id === currentUser.value?.id && message.sender_type === 'admin';
  };

  /**
   * Obter conversas não lidas
   */
  const unreadConversations = computed(() => {
    return conversations.value.filter(chat => chat.unread_count > 0);
  });

  /**
   * Total de mensagens não lidas
   */
  const totalUnread = computed(() => {
    return conversations.value.reduce((total, chat) => total + chat.unread_count, 0);
  });

  /**
   * Mensagens formatadas
   */
  const formattedMessages = computed(() => {
    return messages.value.map(message => formatMessage(message));
  });

  return {
    // Estados
    conversations: readonly(conversations),
    currentChat: readonly(currentChat),
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Computed
    unreadConversations,
    totalUnread,
    formattedMessages,
    currentUser,

    // Funções
    loadConversations,
    startChatWithUser,
    loadChatMessages,
    sendMessage,
    sendMessageToUser,
    selectChat,
    getChatDisplayName,
    formatMessage,
    isOwnMessage
  };
}; 
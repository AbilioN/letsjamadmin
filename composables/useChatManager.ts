import { ref, computed, readonly } from 'vue';
import { ChatService } from '~/services/ChatService';
import type { ChatMessage, Chat, ChatsResponse } from '~/types/chat';

export const useChatManager = () => {
  // Estados reativos
  const chats = ref<Chat[]>([]);
  const currentChat = ref<Chat | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<any>(null);

  // Usuário atual
  const currentUser = useAuth().user;

  // Instância do serviço
  const chatService = new ChatService();

  /**
   * Carregar chats
   */
  const loadChats = async (page: number = 1): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response: ChatsResponse = await chatService.getChats(page);
      console.log(response);
      chats.value = response.chats || [];
      pagination.value = response.pagination;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar chats';
      console.error('Load chats error:', err);
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
      console.log('🚀 Chat criado:', chat);
      
      // Verificar se o chat tem ID
      if (!chat || !chat.id) {
        throw new Error('Chat criado sem ID válido');
      }
      
      // Adicionar à lista de chats se não existir
      const existingChat = chats.value.find(c => c.id === chat.id);
      if (!existingChat) {
        chats.value.unshift(chat);
      }

      // Definir como chat atual
      currentChat.value = chat;
      console.log('🎯 CurrentChat definido:', currentChat.value);

      // Retornar o chat criado
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
    console.log('📤 Tentando enviar mensagem:', { currentChat: currentChat.value, content });
    
    if (!currentChat.value || !currentChat.value.id || !content.trim()) {
      console.error('Send message error: currentChat or chat ID is undefined', currentChat.value);
      return;
    }

    try {
      console.log('📤 Enviando mensagem para chat ID:', currentChat.value.id);
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
      const existingChat = chats.value.find(c => c.id === response.chat.id);
      if (!existingChat) {
        chats.value.unshift(response.chat);
      }

      // Definir como chat atual
      currentChat.value = response.chat;

      // Adicionar mensagem à lista
      messages.value.push(response.message);

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
    currentChat.value = { 
      ...chat
    } as Chat;
    
    await loadChatMessages(chat.id);
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
    return message.sender_id === currentUser.value?.id;
  };

  /**
   * Obter chats não lidos
   */
  const unreadChats = computed(() => {
    return chats.value.filter(chat => chat.unread_count > 0);
  });

  /**
   * Total de mensagens não lidas
   */
  const totalUnread = computed(() => {
    return chats.value.reduce((total, chat) => total + chat.unread_count, 0);
  });

  /**
   * Mensagens formatadas
   */
  const formattedMessages = computed(() => {
    return messages.value.map(message => formatMessage(message));
  });

  return {
    // Estados
    chats: readonly(chats) as ComputedRef<Chat[]>,
    currentChat: readonly(currentChat),
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Computed
    unreadChats,
    totalUnread,
    formattedMessages,
    currentUser,

    // Funções
    loadChats,
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
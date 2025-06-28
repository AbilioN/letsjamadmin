// Tipos para o sistema de chat
export interface ChatMessage {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ChatUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_online: boolean;
  last_seen?: string;
}

export interface Chat {
  id: number;
  type: 'private' | 'group';
  name: string | null;
  description: string | null;
  last_message?: ChatMessage;
  unread_count: number;
}

export interface ChatChannel {
  id: number;
  name: string | null;
  type: 'public' | 'private' | 'direct';
  participants: ChatUser[];
  last_message?: ChatMessage;
  unread_count: number;
}

export interface ChatEvent {
  message: ChatMessage;
  channel_id: number;
  user: ChatUser;
}

export interface TypingEvent {
  user_id: number;
  user_name: string;
  channel_id: number;
  is_typing: boolean;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ChatResponse {
  chat: Chat;
}

export interface MessageResponse {
  message: ChatMessage;
}

export interface ChatMessageResponse {
  chat: Chat;
  message: ChatMessage;
}

export interface ConversationsResponse {
  chats: Chat[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface MessagesResponse {
  messages: ChatMessage[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
} 
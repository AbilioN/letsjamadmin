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

export interface ChatChannel {
  id: number;
  name: string;
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
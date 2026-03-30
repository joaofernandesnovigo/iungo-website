// =====================================================
// READDY HELPDESK - TYPESCRIPT DATABASE TYPES
// Gerado automaticamente a partir do schema SQL
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'admin' | 'client';

export type TicketStatus = 'new' | 'open' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

// =====================================================
// TABELAS DO BANCO
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      tickets: {
        Row: Ticket;
        Insert: TicketInsert;
        Update: TicketUpdate;
      };
      ticket_messages: {
        Row: TicketMessage;
        Insert: TicketMessageInsert;
        Update: TicketMessageUpdate;
      };
      ticket_history: {
        Row: TicketHistory;
        Insert: TicketHistoryInsert;
        Update: TicketHistoryUpdate;
      };
    };
    Views: {
      tickets_full: {
        Row: TicketFull;
      };
    };
    Functions: {
      generate_ticket_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}

// =====================================================
// INTERFACE: Profile
// =====================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  email?: string;
  full_name?: string;
  role?: UserRole;
  company_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  is_active?: boolean;
  updated_at?: string;
}

// =====================================================
// INTERFACE: Ticket
// =====================================================

export interface Ticket {
  id: string;
  ticket_number: string;
  client_id: string;
  assigned_to: string | null;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
  category_id: string | null;
  solution: string | null;
}

export interface TicketInsert {
  id?: string;
  ticket_number?: string;
  client_id: string;
  assigned_to?: string | null;
  category_id?: string | null;
  subject: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  solution?: string | null;
}

export interface TicketUpdate {
  ticket_number?: string;
  client_id?: string;
  assigned_to?: string | null;
  category_id?: string | null;
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  metadata?: Json;
  updated_at?: string;
  resolved_at?: string | null;
  closed_at?: string | null;
}

// =====================================================
// INTERFACE: TicketMessage
// =====================================================

export interface Attachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal: boolean;
  attachments: Attachment[];
  created_at: string;
}

export interface TicketMessageInsert {
  id?: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal?: boolean;
  attachments?: Attachment[];
  created_at?: string;
}

export interface TicketMessageUpdate {
  message?: string;
  is_internal?: boolean;
  attachments?: Attachment[];
}

// =====================================================
// INTERFACE: TicketHistory
// =====================================================

export interface TicketHistory {
  id: string;
  ticket_id: string;
  changed_by: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface TicketHistoryInsert {
  id?: string;
  ticket_id: string;
  changed_by: string;
  field_name: string;
  old_value?: string | null;
  new_value?: string | null;
  created_at?: string;
}

export interface TicketHistoryUpdate {
  field_name?: string;
  old_value?: string | null;
  new_value?: string | null;
}

// =====================================================
// VIEW: TicketFull
// =====================================================

export interface TicketFull extends Ticket {
  client_name: string;
  client_email: string;
  client_company: string | null;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  message_count: number;
  public_message_count: number;
}

// =====================================================
// TIPOS AUXILIARES
// =====================================================

// Tipo para filtros de tickets
export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  assigned_to?: string | null;
  client_id?: string;
  search?: string;
  tag_ids?: string[];
  date_from?: string;
  date_to?: string;
}

// Tipo para estatísticas de tickets
export interface TicketStats {
  total: number;
  new: number;
  open: number;
  pending: number;
  resolved: number;
  closed: number;
  by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  avg_resolution_time: number; // em horas
  avg_response_time: number; // em horas
}

// Tipo para resposta de API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Tipo para paginação
export interface PaginationParams {
  page: number;
  limit: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

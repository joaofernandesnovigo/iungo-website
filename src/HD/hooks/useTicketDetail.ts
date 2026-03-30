
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTicket, type TicketWithRelations } from './useTickets';
import { useTicketMessages, type TicketMessageWithSender } from './useTicketMessages';
import type { 
  TicketUpdate, 
  TicketStatus, 
  Profile,
  Attachment,
} from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';

// ============================================
// TYPES
// ============================================

export interface UseTicketDetailReturn {
  // Ticket data
  ticket: TicketWithRelations | null;
  messages: TicketMessageWithSender[];
  admins: Profile[];
  
  // Loading states
  isLoading: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  isUpdating: boolean;
  
  // Errors
  error: string | null;
  messageError: string | null;
  
  // Real-time status
  isConnected: boolean;
  
  // Actions
  sendMessage: (content: string, isInternal?: boolean, attachments?: Attachment[]) => Promise<{ error: string | null }>;
  updateStatus: (status: TicketStatus) => Promise<{ error: string | null }>;
  assignTicket: (adminId: string | null) => Promise<{ error: string | null }>;
  updatePriority: (priority: 'low' | 'medium' | 'high' | 'urgent') => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
}

// ============================================
// HOOK: useTicketDetail
// ============================================

export function useTicketDetail(ticketId: string | undefined): UseTicketDetailReturn {
  const { isAdmin } = useAuth();
  
  // Use existing hooks
  const { ticket, isLoading, error, refetch: refetchTicket } = useTicket(ticketId);
  const { 
    messages, 
    isLoading: isLoadingMessages, 
    isSending,
    error: messageError, 
    sendMessage: sendMessageBase,
    refetch: refetchMessages,
    isConnected,
  } = useTicketMessages(ticketId);
  
  // Local state
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // -----------------------------------------------------------------
  // Fetch admins for assignment dropdown
  // -----------------------------------------------------------------
  const fetchAdmins = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setAdmins(data || []);
    } catch (err) {
      console.error('❌ HD Detail - Erro ao buscar admins:', err);
    }
  }, [isAdmin]);

  // Fetch admins on mount if admin
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // -----------------------------------------------------------------
  // Send message wrapper
  // -----------------------------------------------------------------
  const sendMessage = useCallback(async (
    content: string, 
    isInternal: boolean = false,
    attachments: Attachment[] = []
  ): Promise<{ error: string | null }> => {
    const result = await sendMessageBase(content, isInternal, attachments);
    return { error: result.error };
  }, [sendMessageBase]);

  // -----------------------------------------------------------------
  // Update ticket status
  // -----------------------------------------------------------------
  const updateStatus = useCallback(async (status: TicketStatus): Promise<{ error: string | null }> => {
    if (!ticketId) return { error: 'Ticket não encontrado' };
    if (!isAdmin) return { error: 'Sem permissão' };

    setIsUpdating(true);

    try {
      const updateData: TicketUpdate = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Add timestamps for resolved/closed
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }
      if (status === 'closed') {
        updateData.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', ticketId);

      if (error) throw error;

      console.log('✅ HD Detail - Status atualizado para:', status);
      await refetchTicket();
      return { error: null };
    } catch (err) {
      console.error('❌ HD Detail - Erro ao atualizar status:', err);
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar status' };
    } finally {
      setIsUpdating(false);
    }
  }, [ticketId, isAdmin, refetchTicket]);

  // -----------------------------------------------------------------
  // Assign ticket to admin
  // -----------------------------------------------------------------
  const assignTicket = useCallback(async (adminId: string | null): Promise<{ error: string | null }> => {
    if (!ticketId) return { error: 'Ticket não encontrado' };
    if (!isAdmin) return { error: 'Sem permissão' };

    setIsUpdating(true);

    try {
      const updateData: TicketUpdate = {
        assigned_to: adminId,
        updated_at: new Date().toISOString(),
      };

      // If assigning and status is 'new', change to 'open'
      if (adminId && ticket?.status === 'new') {
        updateData.status = 'open';
      }

      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', ticketId);

      if (error) throw error;

      console.log('✅ HD Detail - Ticket atribuído para:', adminId || 'ninguém');
      await refetchTicket();
      return { error: null };
    } catch (err) {
      console.error('❌ HD Detail - Erro ao atribuir ticket:', err);
      return { error: err instanceof Error ? err.message : 'Erro ao atribuir ticket' };
    } finally {
      setIsUpdating(false);
    }
  }, [ticketId, isAdmin, ticket?.status, refetchTicket]);

  // -----------------------------------------------------------------
  // Update priority
  // -----------------------------------------------------------------
  const updatePriority = useCallback(async (
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ): Promise<{ error: string | null }> => {
    if (!ticketId) return { error: 'Ticket não encontrado' };
    if (!isAdmin) return { error: 'Sem permissão' };

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          priority,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (error) throw error;

      console.log('✅ HD Detail - Prioridade atualizada para:', priority);
      await refetchTicket();
      return { error: null };
    } catch (err) {
      console.error('❌ HD Detail - Erro ao atualizar prioridade:', err);
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar prioridade' };
    } finally {
      setIsUpdating(false);
    }
  }, [ticketId, isAdmin, refetchTicket]);

  // -----------------------------------------------------------------
  // Refetch all data
  // -----------------------------------------------------------------
  const refetch = useCallback(async () => {
    await Promise.all([refetchTicket(), refetchMessages()]);
  }, [refetchTicket, refetchMessages]);

  return {
    ticket,
    messages,
    admins,
    isLoading,
    isLoadingMessages,
    isSending,
    isUpdating,
    error,
    messageError,
    isConnected,
    sendMessage,
    updateStatus,
    assignTicket,
    updatePriority,
    refetch,
  };
}

export default useTicketDetail;


import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  TicketMessage, 
  TicketMessageInsert,
  Profile,
  Attachment,
  TicketUpdate,
} from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';

// ============================================
// TYPES
// ============================================

export interface TicketMessageWithSender extends TicketMessage {
  sender: Profile | null;
}

export interface UseTicketMessagesReturn {
  messages: TicketMessageWithSender[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  // Actions
  sendMessage: (content: string, isInternal?: boolean, attachments?: Attachment[]) => Promise<{ data: TicketMessage | null; error: string | null }>;
  refetch: () => Promise<void>;
  // Real-time status
  isConnected: boolean;
}

// ============================================
// HOOK: useTicketMessages
// ============================================

export function useTicketMessages(ticketId: string | undefined): UseTicketMessagesReturn {
  const { profile, isAdmin } = useAuth();
  const [messages, setMessages] = useState<TicketMessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  // -----------------------------------------------------------------
  // Fetch messages
  // -----------------------------------------------------------------
  const fetchMessages = useCallback(async () => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('ticket_messages')
        .select(`
          *,
          sender:profiles!ticket_messages_sender_id_fkey(*)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      // Clients don't see internal messages (RLS should handle this, but double-check)
      if (!isAdmin) {
        query = query.eq('is_internal', false);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (isMountedRef.current) {
        console.log('✅ HD Messages - Carregadas:', data?.length || 0);
        setMessages((data as TicketMessageWithSender[]) || []);
      }
    } catch (err) {
      console.error('❌ HD Messages - Erro:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [ticketId, isAdmin]);

  // -----------------------------------------------------------------
  // Send message
  // -----------------------------------------------------------------
  const sendMessage = useCallback(async (
    content: string, 
    isInternal: boolean = false,
    attachments: Attachment[] = []
  ): Promise<{ data: TicketMessage | null; error: string | null }> => {
    if (!ticketId || !profile) {
      return { data: null, error: 'Dados inválidos' };
    }

    if (!content.trim() && attachments.length === 0) {
      return { data: null, error: 'Mensagem não pode estar vazia' };
    }

    setIsSending(true);

    try {
      const messageData: TicketMessageInsert = {
        ticket_id: ticketId,
        sender_id: profile.id,
        message: content.trim(),
        is_internal: isInternal,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      const { data, error } = await supabase
        .from('ticket_messages')
        .insert(messageData)
        .select(`
          *,
          sender:profiles!ticket_messages_sender_id_fkey(*)
        `)
        .single();

      if (error) throw error;

      console.log('✅ HD Messages - Enviada');
      
      // Update ticket timestamp and potentially status
      const ticketUpdate: TicketUpdate = { 
        updated_at: new Date().toISOString(),
      };

      // If client responds to a pending ticket, reopen it
      if (!isAdmin && !isInternal) {
        ticketUpdate.status = 'open';
      }

      await supabase
        .from('tickets')
        .update(ticketUpdate)
        .eq('id', ticketId);

      // Add message to local state immediately for better UX
      if (isMountedRef.current) {
        setMessages(prev => [...prev, data as TicketMessageWithSender]);
      }

      return { data: data as TicketMessage, error: null };
    } catch (err) {
      console.error('❌ HD Messages - Erro ao enviar:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao enviar mensagem' };
    } finally {
      if (isMountedRef.current) {
        setIsSending(false);
      }
    }
  }, [ticketId, profile, isAdmin]);

  // -----------------------------------------------------------------
  // Real-time subscription
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!ticketId) return;

    console.log('🔌 HD Messages - Conectando real-time para ticket:', ticketId);

    const channel = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          console.log('🔔 HD Messages - Nova mensagem recebida via real-time');
          
          // Fetch the complete message with sender info
          const fetchNewMessage = async () => {
            const { data } = await supabase
              .from('ticket_messages')
              .select(`
                *,
                sender:profiles!ticket_messages_sender_id_fkey(*)
              `)
              .eq('id', payload.new.id)
              .maybeSingle();

            if (data && isMountedRef.current) {
              // Check if message already exists (avoid duplicates)
              setMessages(prev => {
                const exists = prev.some(m => m.id === data.id);
                if (exists) return prev;
                
                // If client and message is internal, don't add
                if (!isAdmin && data.is_internal) return prev;
                
                return [...prev, data as TicketMessageWithSender];
              });
            }
          };

          fetchNewMessage();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          console.log('🔔 HD Messages - Mensagem atualizada');
          if (isMountedRef.current) {
            setMessages(prev => 
              prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m)
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          console.log('🔔 HD Messages - Mensagem deletada');
          if (isMountedRef.current) {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 HD Messages - Status da conexão:', status);
        if (isMountedRef.current) {
          setIsConnected(status === 'SUBSCRIBED');
        }
      });

    return () => {
      console.log('🔌 HD Messages - Desconectando real-time');
      supabase.removeChannel(channel);
    };
  }, [ticketId, isAdmin]);

  // -----------------------------------------------------------------
  // Initial fetch
  // -----------------------------------------------------------------
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // -----------------------------------------------------------------
  // Cleanup on unmount
  // -----------------------------------------------------------------
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    refetch: fetchMessages,
    isConnected,
  };
}

export default useTicketMessages;


import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  Ticket, 
  TicketInsert, 
  TicketUpdate,
  TicketFilters,
  TicketStatus,
  TicketPriority,
  Profile,
  PaginationParams,
} from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';

// ============================================
// TYPES
// ============================================

export interface TicketWithRelations extends Ticket {
  client: Profile | null;
  assigned_admin: Profile | null;
}

export interface UseTicketsOptions {
  filters?: TicketFilters;
  pagination?: Partial<PaginationParams>;
  autoFetch?: boolean;
}

export interface UseTicketsReturn {
  tickets: TicketWithRelations[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  // Actions
  fetchTickets: () => Promise<void>;
  createTicket: (data: TicketInsert) => Promise<{ data: Ticket | null; error: string | null }>;
  updateTicket: (id: string, data: TicketUpdate) => Promise<{ error: string | null }>;
  deleteTicket: (id: string) => Promise<{ error: string | null }>;
  // Pagination
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
  // Filters
  setFilters: (filters: TicketFilters) => void;
  clearFilters: () => void;
}

// ============================================
// HOOK: useTickets
// ============================================

export function useTickets(options: UseTicketsOptions = {}): UseTicketsReturn {
  const { profile, isAdmin } = useAuth();
  
  // State
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  // Pagination state
  const [page, setPage] = useState(options.pagination?.page ?? 1);
  const [limit, setLimit] = useState(options.pagination?.limit ?? 10);
  
  // Filters state
  const [filters, setFilters] = useState<TicketFilters>(options.filters ?? {});

  // Computed pagination
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }, [page, limit, total]);

  // -----------------------------------------------------------------
  // Fetch tickets with pagination and filters
  // -----------------------------------------------------------------
  const fetchTickets = useCallback(async () => {
    if (!profile) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build base query
      let query = supabase
        .from('tickets')
        .select(`
          *,
          client:profiles!tickets_client_id_fkey(*),
          assigned_admin:profiles!tickets_assigned_to_fkey(*)
        `, { count: 'exact' });

      // Role-based filtering: clients only see their own tickets
      if (!isAdmin) {
        query = query.eq('client_id', profile.id);
      }

      // Apply filters
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          query = query.in('priority', filters.priority);
        } else {
          query = query.eq('priority', filters.priority);
        }
      }

      if (filters.assigned_to !== undefined) {
        if (filters.assigned_to === null) {
          query = query.is('assigned_to', null);
        } else {
          query = query.eq('assigned_to', filters.assigned_to);
        }
      }

      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      if (filters.search) {
        query = query.or(`subject.ilike.%${filters.search}%,ticket_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      console.log('✅ HD Tickets - Carregados:', data?.length || 0, 'de', count);
      setTickets((data as TicketWithRelations[]) || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('❌ HD Tickets - Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar tickets');
    } finally {
      setIsLoading(false);
    }
  }, [profile, isAdmin, filters, page, limit]);

  // -----------------------------------------------------------------
  // Create ticket
  // -----------------------------------------------------------------
  const createTicket = useCallback(async (
    data: TicketInsert
  ): Promise<{ data: Ticket | null; error: string | null }> => {
    if (!profile) {
      return { data: null, error: 'Usuário não autenticado' };
    }

    try {
      const { data: newTicket, error } = await supabase
        .from('tickets')
        .insert({
          subject: data.subject,
          description: data.description,
          client_id: data.client_id || profile.id,
          status: 'new' as TicketStatus,
          priority: data.priority || ('medium' as TicketPriority),
          category_id: data.category_id || null,
          solution: data.solution || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ HD Tickets - Criado:', newTicket.ticket_number);
      await fetchTickets();
      return { data: newTicket, error: null };
    } catch (err) {
      console.error('❌ HD Tickets - Erro ao criar:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao criar ticket' };
    }
  }, [profile, fetchTickets]);

  // -----------------------------------------------------------------
  // Update ticket
  // -----------------------------------------------------------------
  const updateTicket = useCallback(async (
    id: string, 
    data: TicketUpdate
  ): Promise<{ error: string | null }> => {
    try {
      const updateData: TicketUpdate = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Add resolution/closing timestamps
      if (data.status === 'resolved' && !data.resolved_at) {
        updateData.resolved_at = new Date().toISOString();
      }
      if (data.status === 'closed' && !data.closed_at) {
        updateData.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      console.log('✅ HD Tickets - Atualizado:', id);
      await fetchTickets();
      return { error: null };
    } catch (err) {
      console.error('❌ HD Tickets - Erro ao atualizar:', err);
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar ticket' };
    }
  }, [fetchTickets]);

  // -----------------------------------------------------------------
  // Delete ticket
  // -----------------------------------------------------------------
  const deleteTicket = useCallback(async (id: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('✅ HD Tickets - Deletado:', id);
      await fetchTickets();
      return { error: null };
    } catch (err) {
      console.error('❌ HD Tickets - Erro ao deletar:', err);
      return { error: err instanceof Error ? err.message : 'Erro ao deletar ticket' };
    }
  }, [fetchTickets]);

  // -----------------------------------------------------------------
  // Pagination helpers
  // -----------------------------------------------------------------
  const nextPage = useCallback(() => {
    if (paginationInfo.hasNext) {
      setPage(p => p + 1);
    }
  }, [paginationInfo.hasNext]);

  const prevPage = useCallback(() => {
    if (paginationInfo.hasPrev) {
      setPage(p => p - 1);
    }
  }, [paginationInfo.hasPrev]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const handleSetFilters = useCallback((newFilters: TicketFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // -----------------------------------------------------------------
  // Real-time subscription for ticket updates
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
        },
        (payload) => {
          console.log('🔔 HD Tickets - Alteração detectada:', payload.eventType);
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, fetchTickets]);

  // -----------------------------------------------------------------
  // Auto-fetch on mount and when dependencies change
  // -----------------------------------------------------------------
  useEffect(() => {
    if (options.autoFetch !== false && profile) {
      fetchTickets();
    }
  }, [fetchTickets, profile, options.autoFetch]);

  return {
    tickets,
    isLoading,
    error,
    pagination: paginationInfo,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    setPage,
    nextPage,
    prevPage,
    setLimit,
    setFilters: handleSetFilters,
    clearFilters,
  };
}

// ============================================
// HOOK: useTicket (single ticket)
// ============================================

export function useTicket(ticketId: string | undefined) {
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tickets')
        .select(`
          *,
          client:profiles!tickets_client_id_fkey(*),
          assigned_admin:profiles!tickets_assigned_to_fkey(*)
        `)
        .eq('id', ticketId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setTicket(data as TicketWithRelations);
    } catch (err) {
      console.error('❌ HD Ticket - Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar ticket');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  // Real-time subscription for single ticket
  useEffect(() => {
    if (!ticketId) return;

    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
          filter: `id=eq.${ticketId}`,
        },
        () => {
          console.log('🔔 HD Ticket - Atualização detectada');
          fetchTicket();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, fetchTicket]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return {
    ticket,
    isLoading,
    error,
    refetch: fetchTicket,
  };
}

export default useTickets;

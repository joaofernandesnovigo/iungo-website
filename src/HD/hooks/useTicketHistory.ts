import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TicketHistoryEntry {
  id: string;
  ticket_id: string;
  changed_by: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    role: 'admin' | 'client';
  };
}

export interface HistoryFilters {
  fieldType?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export function useTicketHistory(ticketId: string | undefined, filters?: HistoryFilters) {
  const [history, setHistory] = useState<TicketHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    fetchHistory();
  }, [ticketId, filters]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('ticket_history')
        .select(`
          *,
          user:profiles!ticket_history_changed_by_fkey(
            id,
            full_name,
            email,
            avatar_url,
            role
          )
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.fieldType) {
        if (filters.fieldType === 'message') {
          query = query.in('field_name', ['message', 'internal_note']);
        } else if (filters.fieldType === 'tag') {
          query = query.in('field_name', ['tag_added', 'tag_removed']);
        } else if (filters.fieldType === 'custom_field') {
          query = query.like('field_name', 'custom_field:%');
        } else {
          query = query.eq('field_name', filters.fieldType);
        }
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      if (filters?.userId) {
        query = query.eq('changed_by', filters.userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching ticket history:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}

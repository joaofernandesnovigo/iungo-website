
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ============================================
// TYPES
// ============================================

export interface DashboardMetrics {
  totalNew: number;
  totalAwaitingResponse: number;
  resolvedToday: number;
  avgFirstResponseTime: number | null; // em minutos
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  ticketsByStatus: {
    new: number;
    open: number;
    pending: number;
    resolved: number;
    closed: number;
  };
  recentActivity: {
    date: string;
    count: number;
  }[];
}

export interface UseMetricsReturn {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================
// HOOK: useMetrics
// ============================================

export function useMetrics(): UseMetricsReturn {
  const { isAdmin, profile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    console.log('🔍 HD Metrics - Iniciando fetchMetrics...');
    console.log('👤 HD Metrics - Profile:', profile?.id);
    console.log('🔑 HD Metrics - isAdmin:', isAdmin);

    if (!profile) {
      console.log('⚠️ HD Metrics - Sem profile, abortando...');
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setIsLoading(false);
      setError('Supabase não configurado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 HD Metrics - Buscando dados...');

      // Data de hoje (início do dia)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Data de 7 dias atrás
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();

      // 1. Total de tickets novos
      console.log('📊 HD Metrics - Buscando tickets novos...');
      let newQuery = supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      
      if (!isAdmin) {
        newQuery = newQuery.eq('client_id', profile.id);
      }
      
      const { count: totalNew, error: newError } = await newQuery;
      if (newError) {
        console.error('❌ HD Metrics - Erro ao buscar novos:', newError);
        throw newError;
      }
      console.log('✅ HD Metrics - Tickets novos:', totalNew);

      // 2. Tickets aguardando resposta (pending)
      console.log('📊 HD Metrics - Buscando tickets pendentes...');
      let pendingQuery = supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (!isAdmin) {
        pendingQuery = pendingQuery.eq('client_id', profile.id);
      }
      
      const { count: totalAwaitingResponse, error: pendingError } = await pendingQuery;
      if (pendingError) {
        console.error('❌ HD Metrics - Erro ao buscar pendentes:', pendingError);
        throw pendingError;
      }
      console.log('✅ HD Metrics - Tickets pendentes:', totalAwaitingResponse);

      // 3. Tickets resolvidos hoje
      console.log('📊 HD Metrics - Buscando tickets resolvidos hoje...');
      let resolvedQuery = supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('resolved_at', todayISO);
      
      if (!isAdmin) {
        resolvedQuery = resolvedQuery.eq('client_id', profile.id);
      }
      
      const { count: resolvedToday, error: resolvedError } = await resolvedQuery;
      if (resolvedError) {
        console.error('❌ HD Metrics - Erro ao buscar resolvidos:', resolvedError);
        throw resolvedError;
      }
      console.log('✅ HD Metrics - Tickets resolvidos hoje:', resolvedToday);

      // 4. Tickets por prioridade
      console.log('📊 HD Metrics - Buscando tickets por prioridade...');
      const priorityPromises = ['low', 'medium', 'high', 'urgent'].map(async (priority) => {
        let query = supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('priority', priority)
          .not('status', 'eq', 'closed');
        
        if (!isAdmin) {
          query = query.eq('client_id', profile.id);
        }
        
        const { count, error } = await query;
        if (error) {
          console.error(`❌ HD Metrics - Erro ao buscar prioridade ${priority}:`, error);
        }
        return { priority, count: count || 0 };
      });

      const priorityResults = await Promise.all(priorityPromises);
      const ticketsByPriority = {
        low: priorityResults.find(p => p.priority === 'low')?.count || 0,
        medium: priorityResults.find(p => p.priority === 'medium')?.count || 0,
        high: priorityResults.find(p => p.priority === 'high')?.count || 0,
        urgent: priorityResults.find(p => p.priority === 'urgent')?.count || 0,
      };
      console.log('✅ HD Metrics - Tickets por prioridade:', ticketsByPriority);

      // 5. Tickets por status
      console.log('📊 HD Metrics - Buscando tickets por status...');
      const statusPromises = ['new', 'open', 'pending', 'resolved', 'closed'].map(async (status) => {
        let query = supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        
        if (!isAdmin) {
          query = query.eq('client_id', profile.id);
        }
        
        const { count, error } = await query;
        if (error) {
          console.error(`❌ HD Metrics - Erro ao buscar status ${status}:`, error);
        }
        return { status, count: count || 0 };
      });

      const statusResults = await Promise.all(statusPromises);
      const ticketsByStatus = {
        new: statusResults.find(s => s.status === 'new')?.count || 0,
        open: statusResults.find(s => s.status === 'open')?.count || 0,
        pending: statusResults.find(s => s.status === 'pending')?.count || 0,
        resolved: statusResults.find(s => s.status === 'resolved')?.count || 0,
        closed: statusResults.find(s => s.status === 'closed')?.count || 0,
      };
      console.log('✅ HD Metrics - Tickets por status:', ticketsByStatus);

      // 6. Atividade recente (últimos 7 dias)
      console.log('📊 HD Metrics - Buscando atividade recente...');
      let activityQuery = supabase
        .from('tickets')
        .select('created_at')
        .gte('created_at', sevenDaysAgoISO)
        .order('created_at', { ascending: true });
      
      if (!isAdmin) {
        activityQuery = activityQuery.eq('client_id', profile.id);
      }
      
      const { data: activityData, error: activityError } = await activityQuery;
      if (activityError) {
        console.error('❌ HD Metrics - Erro ao buscar atividade:', activityError);
        throw activityError;
      }

      // Agrupar por dia
      const activityByDay: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        activityByDay[dateStr] = 0;
      }

      activityData?.forEach(ticket => {
        const dateStr = ticket.created_at.split('T')[0];
        if (activityByDay[dateStr] !== undefined) {
          activityByDay[dateStr]++;
        }
      });

      const recentActivity = Object.entries(activityByDay).map(([date, count]) => ({
        date,
        count,
      }));
      console.log('✅ HD Metrics - Atividade recente:', recentActivity);

      // 7. Tempo médio de primeira resposta (apenas para admin)
      let avgFirstResponseTime: number | null = null;
      
      if (isAdmin) {
        console.log('📊 HD Metrics - Buscando tempo médio de resposta...');
        // Buscar tickets com pelo menos uma mensagem de admin
        const { data: ticketsWithResponse, error: responseError } = await supabase
          .from('tickets')
          .select(`
            id,
            created_at,
            ticket_messages!inner(created_at, sender_id)
          `)
          .not('status', 'eq', 'new')
          .limit(100);

        if (responseError) {
          console.error('❌ HD Metrics - Erro ao buscar tempo de resposta:', responseError);
        } else if (ticketsWithResponse && ticketsWithResponse.length > 0) {
          const responseTimes: number[] = [];
          
          for (const ticket of ticketsWithResponse) {
            const messages = ticket.ticket_messages as any[];
            if (messages && messages.length > 0) {
              // Encontrar primeira mensagem que não seja do cliente
              const ticketCreated = new Date(ticket.created_at).getTime();
              const firstResponse = messages
                .map(m => new Date(m.created_at).getTime())
                .filter(t => t > ticketCreated)
                .sort((a, b) => a - b)[0];
              
              if (firstResponse) {
                const diffMinutes = (firstResponse - ticketCreated) / (1000 * 60);
                if (diffMinutes > 0 && diffMinutes < 10080) { // Menos de 7 dias
                  responseTimes.push(diffMinutes);
                }
              }
            }
          }

          if (responseTimes.length > 0) {
            avgFirstResponseTime = Math.round(
              responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            );
          }
        }
        console.log('✅ HD Metrics - Tempo médio de resposta:', avgFirstResponseTime);
      }

      const finalMetrics = {
        totalNew: totalNew || 0,
        totalAwaitingResponse: totalAwaitingResponse || 0,
        resolvedToday: resolvedToday || 0,
        avgFirstResponseTime,
        ticketsByPriority,
        ticketsByStatus,
        recentActivity,
      };

      console.log('✅ HD Metrics - Carregadas com sucesso:', finalMetrics);
      setMetrics(finalMetrics);
    } catch (err) {
      console.error('❌ HD Metrics - Erro geral:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar métricas');
    } finally {
      console.log('🏁 HD Metrics - Finalizando...');
      setIsLoading(false);
    }
  }, [profile, isAdmin]);

  useEffect(() => {
    console.log('🔄 HD Metrics - useEffect disparado');
    fetchMetrics();
  }, [fetchMetrics]);

  // Real-time subscription para atualizar métricas
  useEffect(() => {
    if (!profile || !supabase) return;

    const channel = supabase
      .channel('metrics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => {
          console.log('🔔 HD Metrics - Atualizando...');
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [profile, fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}

export default useMetrics;

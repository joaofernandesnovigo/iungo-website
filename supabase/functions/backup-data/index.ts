import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar se é admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Apenas administradores podem fazer backup' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { format = 'json', filters = {} } = await req.json();

    // Buscar tickets com filtros
    let query = supabaseClient
      .from('tickets')
      .select(`
        *,
        customer:profiles!tickets_customer_id_fkey(id, full_name, email),
        assigned:profiles!tickets_assigned_to_fkey(id, full_name, email),
        messages:ticket_messages(id, content, created_at, is_internal, sender:profiles(full_name, email)),
        history:ticket_history(id, change_type, old_value, new_value, created_at, changed_by:profiles(full_name, email))
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    if (filters.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }
    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    const { data: tickets, error } = await query;

    if (error) throw error;

    let responseData: string;
    let contentType: string;
    let fileName: string;

    if (format === 'csv') {
      // Gerar CSV
      const headers = [
        'Número',
        'Assunto',
        'Status',
        'Prioridade',
        'Cliente',
        'Email Cliente',
        'Responsável',
        'Criado em',
        'Atualizado em',
        'Mensagens',
      ];

      const rows = tickets?.map(ticket => [
        ticket.ticket_number,
        `"${ticket.subject.replace(/"/g, '""')}"`,
        ticket.status,
        ticket.priority,
        ticket.customer?.full_name || '',
        ticket.customer?.email || '',
        ticket.assigned?.full_name || 'Não atribuído',
        new Date(ticket.created_at).toLocaleString('pt-BR'),
        new Date(ticket.updated_at).toLocaleString('pt-BR'),
        ticket.messages?.length || 0,
      ]) || [];

      responseData = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      contentType = 'text/csv';
      fileName = `backup-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // Gerar JSON
      responseData = JSON.stringify({
        exported_at: new Date().toISOString(),
        total_records: tickets?.length || 0,
        filters,
        tickets: tickets?.map(ticket => ({
          ticket_number: ticket.ticket_number,
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
          customer: {
            name: ticket.customer?.full_name,
            email: ticket.customer?.email,
          },
          assigned_to: ticket.assigned?.full_name || null,
          messages: ticket.messages?.map((msg: any) => ({
            content: msg.content,
            created_at: msg.created_at,
            sender: msg.sender?.full_name,
            is_internal: msg.is_internal,
          })) || [],
          history: ticket.history?.map((h: any) => ({
            change_type: h.change_type,
            old_value: h.old_value,
            new_value: h.new_value,
            created_at: h.created_at,
            changed_by: h.changed_by?.full_name,
          })) || [],
        })),
      }, null, 2);
      contentType = 'application/json';
      fileName = `backup-tickets-${new Date().toISOString().split('T')[0]}.json`;
    }

    // Salvar no Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('backups')
      .upload(`${new Date().getFullYear()}/${fileName}`, responseData, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Erro ao salvar backup:', uploadError);
    }

    return new Response(responseData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Erro no backup:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

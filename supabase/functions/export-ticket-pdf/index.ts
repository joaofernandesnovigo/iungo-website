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

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { ticketId } = await req.json();

    // Buscar ticket completo
    const { data: ticket, error } = await supabaseClient
      .from('tickets')
      .select(`
        *,
        customer:profiles!tickets_customer_id_fkey(id, full_name, email),
        assigned:profiles!tickets_assigned_to_fkey(id, full_name, email),
        messages:ticket_messages(
          id, content, created_at, is_internal,
          sender:profiles(full_name, email)
        ),
        history:ticket_history(
          id, change_type, old_value, new_value, created_at,
          changed_by:profiles(full_name, email)
        )
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;

    // Gerar HTML para PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { border-bottom: 3px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #8B5CF6; font-size: 28px; }
    .header .ticket-number { color: #666; font-size: 14px; margin-top: 5px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #8B5CF6; font-size: 18px; border-bottom: 2px solid #E9D5FF; padding-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: 150px 1fr; gap: 10px; margin-top: 15px; }
    .info-label { font-weight: bold; color: #666; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .badge-new { background: #DBEAFE; color: #1E40AF; }
    .badge-open { background: #FEF3C7; color: #92400E; }
    .badge-pending { background: #FED7AA; color: #9A3412; }
    .badge-resolved { background: #D1FAE5; color: #065F46; }
    .badge-closed { background: #E5E7EB; color: #374151; }
    .badge-low { background: #DBEAFE; color: #1E40AF; }
    .badge-medium { background: #FEF3C7; color: #92400E; }
    .badge-high { background: #FED7AA; color: #9A3412; }
    .badge-urgent { background: #FEE2E2; color: #991B1B; }
    .message { background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .message-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #666; }
    .message-internal { background: #FEF3C7; border-left: 4px solid #F59E0B; }
    .timeline-item { padding: 15px; border-left: 3px solid #E9D5FF; margin-bottom: 10px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${ticket.subject}</h1>
    <div class="ticket-number">Ticket #${ticket.ticket_number}</div>
  </div>

  <div class="section">
    <h2>Informações do Ticket</h2>
    <div class="info-grid">
      <div class="info-label">Status:</div>
      <div><span class="badge badge-${ticket.status}">${ticket.status.toUpperCase()}</span></div>
      
      <div class="info-label">Prioridade:</div>
      <div><span class="badge badge-${ticket.priority}">${ticket.priority.toUpperCase()}</span></div>
      
      <div class="info-label">Cliente:</div>
      <div>${ticket.customer?.full_name} (${ticket.customer?.email})</div>
      
      <div class="info-label">Responsável:</div>
      <div>${ticket.assigned?.full_name || 'Não atribuído'}</div>
      
      <div class="info-label">Criado em:</div>
      <div>${new Date(ticket.created_at).toLocaleString('pt-BR')}</div>
      
      <div class="info-label">Atualizado em:</div>
      <div>${new Date(ticket.updated_at).toLocaleString('pt-BR')}</div>
    </div>
  </div>

  <div class="section">
    <h2>Descrição</h2>
    <p>${ticket.description}</p>
  </div>

  <div class="section">
    <h2>Mensagens (${ticket.messages?.length || 0})</h2>
    ${ticket.messages?.map((msg: any) => `
      <div class="message ${msg.is_internal ? 'message-internal' : ''}">
        <div class="message-header">
          <strong>${msg.sender?.full_name || 'Usuário'}</strong>
          <span>${new Date(msg.created_at).toLocaleString('pt-BR')}</span>
        </div>
        <div>${msg.content}</div>
        ${msg.is_internal ? '<div style="margin-top: 8px; font-size: 12px; color: #92400E;">📝 Nota Interna</div>' : ''}
      </div>
    `).join('') || '<p>Nenhuma mensagem</p>'}
  </div>

  <div class="section">
    <h2>Histórico de Alterações</h2>
    ${ticket.history?.map((h: any) => `
      <div class="timeline-item">
        <div style="font-weight: 600; margin-bottom: 5px;">${h.change_type}</div>
        ${h.old_value ? `<div style="font-size: 13px; color: #666;">De: ${h.old_value} → Para: ${h.new_value}</div>` : ''}
        <div style="font-size: 12px; color: #999; margin-top: 5px;">
          ${h.changed_by?.full_name} • ${new Date(h.created_at).toLocaleString('pt-BR')}
        </div>
      </div>
    `).join('') || '<p>Nenhuma alteração registrada</p>'}
  </div>

  <div class="footer">
    Relatório gerado em ${new Date().toLocaleString('pt-BR')}
  </div>
</body>
</html>
    `;

    return new Response(JSON.stringify({ html, ticket }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

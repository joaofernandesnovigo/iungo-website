
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UrgentTicket {
  id: string;
  ticket_number: string;
  subject: string;
  created_at: string;
  customer: {
    full_name: string;
    email: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar tickets urgentes sem resposta há mais de 1 hora
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: urgentTickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        subject,
        created_at,
        customer:customer_id (
          full_name,
          email
        )
      `)
      .eq('priority', 'urgent')
      .in('status', ['new', 'open'])
      .lt('created_at', oneHourAgo)
      .order('created_at', { ascending: true });

    if (ticketsError) throw ticketsError;

    if (!urgentTickets || urgentTickets.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Nenhum ticket urgente pendente' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filtrar tickets que ainda não receberam alerta recente (últimas 2 horas)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const ticketsToAlert: UrgentTicket[] = [];

    for (const ticket of urgentTickets) {
      const { data: recentAlert } = await supabase
        .from('urgent_ticket_alerts')
        .select('id')
        .eq('ticket_id', ticket.id)
        .gte('created_at', twoHoursAgo)
        .single();

      if (!recentAlert) {
        ticketsToAlert.push(ticket as UrgentTicket);
      }
    }

    if (ticketsToAlert.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Todos os tickets urgentes já foram alertados recentemente' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar todos os admins ativos com notificações habilitadas
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id, email, full_name, notification_settings(notify_on_urgent, email_enabled)')
      .eq('role', 'admin')
      .eq('is_active', true);

    if (adminsError) throw adminsError;

    const adminsToNotify = admins?.filter(admin => {
      const settings = admin.notification_settings?.[0];
      return settings?.email_enabled !== false && settings?.notify_on_urgent !== false;
    }) || [];

    if (adminsToNotify.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Nenhum admin com notificações habilitadas' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar HTML da lista de tickets
    const ticketListHtml = ticketsToAlert.map(ticket => {
      const hoursAgo = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / (1000 * 60 * 60));
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #fee2e2;">
            <strong style="color: #dc2626;">#${ticket.ticket_number}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #fee2e2;">
            ${ticket.subject}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #fee2e2;">
            ${ticket.customer.full_name}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #fee2e2;">
            ${hoursAgo}h atrás
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #fee2e2;">
            <a href="${supabaseUrl.replace('.supabase.co', '')}/hd/ticket/${ticket.id}" 
               style="color: #dc2626; text-decoration: none; font-weight: 600;">
              Ver ticket →
            </a>
          </td>
        </tr>
      `;
    }).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
                    <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 40px;">🚨</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                      Tickets Urgentes Pendentes
                    </h1>
                    <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                      ${ticketsToAlert.length} ticket${ticketsToAlert.length > 1 ? 's' : ''} urgente${ticketsToAlert.length > 1 ? 's' : ''} aguardando atendimento
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                      Olá,
                    </p>
                    <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                      Os seguintes tickets urgentes estão aguardando atendimento há mais de 1 hora:
                    </p>

                    <!-- Tickets Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #fee2e2; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                      <thead>
                        <tr style="background-color: #fef2f2;">
                          <th style="padding: 12px; text-align: left; color: #991b1b; font-size: 14px; font-weight: 600; border-bottom: 2px solid #fee2e2;">
                            Ticket
                          </th>
                          <th style="padding: 12px; text-align: left; color: #991b1b; font-size: 14px; font-weight: 600; border-bottom: 2px solid #fee2e2;">
                            Assunto
                          </th>
                          <th style="padding: 12px; text-align: left; color: #991b1b; font-size: 14px; font-weight: 600; border-bottom: 2px solid #fee2e2;">
                            Cliente
                          </th>
                          <th style="padding: 12px; text-align: left; color: #991b1b; font-size: 14px; font-weight: 600; border-bottom: 2px solid #fee2e2;">
                            Tempo
                          </th>
                          <th style="padding: 12px; text-align: left; color: #991b1b; font-size: 14px; font-weight: 600; border-bottom: 2px solid #fee2e2;">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${ticketListHtml}
                      </tbody>
                    </table>

                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                        <strong>⚠️ Atenção:</strong> Tickets urgentes requerem resposta imediata. Por favor, atribua e responda o mais rápido possível.
                      </p>
                    </div>

                    <div style="text-align: center;">
                      <a href="${supabaseUrl.replace('.supabase.co', '')}/hd/tickets?priority=urgent" 
                         style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                        Ver Todos os Tickets Urgentes
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                      Sistema de Helpdesk
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Este é um alerta automático. Para gerenciar suas notificações, acesse as configurações.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar e-mail para cada admin
    const emailPromises = adminsToNotify.map(async (admin) => {
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: admin.email,
          subject: `🚨 ${ticketsToAlert.length} Ticket${ticketsToAlert.length > 1 ? 's' : ''} Urgente${ticketsToAlert.length > 1 ? 's' : ''} Pendente${ticketsToAlert.length > 1 ? 's' : ''}`,
          html: emailHtml,
        },
      });

      if (emailError) {
        console.error(`Erro ao enviar e-mail para ${admin.email}:`, emailError);
      }
    });

    await Promise.all(emailPromises);

    // Registrar alertas enviados
    const adminEmails = adminsToNotify.map(a => a.email);
    const alertPromises = ticketsToAlert.map(ticket =>
      supabase.from('urgent_ticket_alerts').insert({
        ticket_id: ticket.id,
        admin_emails: adminEmails,
      })
    );

    await Promise.all(alertPromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Alertas enviados para ${adminsToNotify.length} admin${adminsToNotify.length > 1 ? 's' : ''}`,
        tickets_alerted: ticketsToAlert.length,
        admins_notified: adminsToNotify.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao verificar tickets urgentes:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

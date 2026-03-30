import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { data: closingOpportunities, error } = await supabaseClient
      .from('opportunities')
      .select('*, assigned_to:profiles!opportunities_assigned_to_fkey(id, email, name), company:companies(name)')
      .lte('expected_close_date', sevenDaysFromNow.toISOString().split('T')[0])
      .gte('expected_close_date', new Date().toISOString().split('T')[0])
      .not('stage', 'in', '(closed,lost)');

    if (error) throw error;

    const notifications = [];
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    for (const opp of closingOpportunities || []) {
      if (opp.assigned_to) {
        const daysUntilClose = Math.ceil(
          (new Date(opp.expected_close_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        await supabaseClient
          .from('notifications')
          .insert([
            {
              user_id: opp.assigned_to.id,
              title: 'Oportunidade Próxima do Fechamento',
              message: `A oportunidade "${opp.title}" fecha em ${daysUntilClose} dia${daysUntilClose > 1 ? 's' : ''}.`,
              type: 'closing_soon',
              link: `/crm?opportunity=${opp.id}`
            }
          ]);

        if (RESEND_API_KEY) {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1f2e;">⏰ Oportunidade Próxima do Fechamento</h2>
              <p>Olá ${opp.assigned_to.name},</p>
              <p>A oportunidade <strong>${opp.title}</strong> da empresa <strong>${opp.company?.name}</strong> está próxima da data de fechamento:</p>
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0;"><strong>Data de Fechamento:</strong> ${new Date(opp.expected_close_date).toLocaleDateString('pt-BR')}</p>
                <p style="margin: 10px 0 0 0;"><strong>Faltam:</strong> ${daysUntilClose} dia${daysUntilClose > 1 ? 's' : ''}</p>
              </div>
              <p>Valor: <strong>R$ ${opp.value.toLocaleString('pt-BR')}</strong></p>
              <p>Probabilidade: <strong>${opp.probability}%</strong></p>
              <a href="https://iungo-ai.com/crm?opportunity=${opp.id}" style="display: inline-block; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Ver Oportunidade</a>
            </div>
          `;

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'CRM Iungo <noreply@iungo-ai.com>',
              to: opp.assigned_to.email,
              subject: `⏰ Oportunidade "${opp.title}" fecha em ${daysUntilClose} dia${daysUntilClose > 1 ? 's' : ''}`,
              html: emailHtml,
            }),
          });
        }

        notifications.push({
          user: opp.assigned_to.name,
          opportunity: opp.title,
          daysUntilClose
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: closingOpportunities?.length || 0,
        notifications: notifications.length,
        details: notifications
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
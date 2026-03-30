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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: stagnantOpportunities, error } = await supabaseClient
      .from('opportunities')
      .select('*, assigned_to:profiles!opportunities_assigned_to_fkey(id, email, name), company:companies(name)')
      .lte('updated_at', sevenDaysAgo.toISOString())
      .not('stage', 'in', '(closed,lost)');

    if (error) throw error;

    const notifications = [];
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    for (const opp of stagnantOpportunities || []) {
      if (opp.assigned_to) {
        const daysSinceUpdate = Math.floor(
          (new Date().getTime() - new Date(opp.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        await supabaseClient
          .from('notifications')
          .insert([
            {
              user_id: opp.assigned_to.id,
              title: 'Oportunidade Estagnada',
              message: `A oportunidade "${opp.title}" está sem atualização há ${daysSinceUpdate} dias.`,
              type: 'stagnant',
              link: `/crm?opportunity=${opp.id}`
            }
          ]);

        if (RESEND_API_KEY) {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1f2e;">⚠️ Oportunidade Estagnada</h2>
              <p>Olá ${opp.assigned_to.name},</p>
              <p>A oportunidade <strong>${opp.title}</strong> da empresa <strong>${opp.company?.name}</strong> está sem atualização há algum tempo:</p>
              <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                <p style="margin: 0;"><strong>Última atualização:</strong> ${new Date(opp.updated_at).toLocaleDateString('pt-BR')}</p>
                <p style="margin: 10px 0 0 0;"><strong>Dias sem atualização:</strong> ${daysSinceUpdate} dias</p>
              </div>
              <p>Valor: <strong>R$ ${opp.value.toLocaleString('pt-BR')}</strong></p>
              <p>Considere entrar em contato com o cliente para dar continuidade ao processo.</p>
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
              subject: `⚠️ Oportunidade "${opp.title}" está estagnada há ${daysSinceUpdate} dias`,
              html: emailHtml,
            }),
          });
        }

        notifications.push({
          user: opp.assigned_to.name,
          opportunity: opp.title,
          daysSinceUpdate
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: stagnantOpportunities?.length || 0,
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
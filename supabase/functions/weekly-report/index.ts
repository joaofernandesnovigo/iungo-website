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

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: users, error: usersError } = await supabaseClient
      .from('profiles')
      .select('*');

    if (usersError) throw usersError;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const reports = [];

    for (const user of users || []) {
      const { data: opportunities } = await supabaseClient
        .from('opportunities')
        .select('*, company:companies(name)')
        .eq('assigned_to', user.id);

      const { data: newOpportunities } = await supabaseClient
        .from('opportunities')
        .select('*')
        .eq('assigned_to', user.id)
        .gte('created_at', oneWeekAgo.toISOString());

      const { data: closedOpportunities } = await supabaseClient
        .from('opportunities')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('stage', 'closed')
        .gte('closed_at', oneWeekAgo.toISOString());

      const totalValue = opportunities?.reduce((sum, opp) => sum + Number(opp.value), 0) || 0;
      const closedValue = closedOpportunities?.reduce((sum, opp) => sum + Number(opp.value), 0) || 0;

      if (RESEND_API_KEY) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1f2e;">📊 Relatório Semanal de Vendas</h2>
            <p>Olá ${user.name},</p>
            <p>Aqui está o resumo da sua semana:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Resumo Geral</h3>
              <p><strong>Total de Oportunidades:</strong> ${opportunities?.length || 0}</p>
              <p><strong>Novas Oportunidades:</strong> ${newOpportunities?.length || 0}</p>
              <p><strong>Oportunidades Fechadas:</strong> ${closedOpportunities?.length || 0}</p>
              <p><strong>Valor Total em Pipeline:</strong> R$ ${totalValue.toLocaleString('pt-BR')}</p>
              <p><strong>Valor Fechado na Semana:</strong> R$ ${closedValue.toLocaleString('pt-BR')}</p>
            </div>

            ${closedOpportunities && closedOpportunities.length > 0 ? `
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="margin-top: 0; color: #155724;">🎉 Oportunidades Fechadas</h3>
                ${closedOpportunities.map(opp => `
                  <p style="margin: 5px 0;">• ${opp.title} - R$ ${Number(opp.value).toLocaleString('pt-BR')}</p>
                `).join('')}
              </div>
            ` : ''}

            <a href="https://iungo-ai.com/crm" style="display: inline-block; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Acessar CRM</a>
            
            <p style="margin-top: 30px; color: #666; font-size: 12px;">Continue o ótimo trabalho! 💪</p>
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
            to: user.email,
            subject: '📊 Seu Relatório Semanal de Vendas',
            html: emailHtml,
          }),
        });
      }

      reports.push({
        user: user.name,
        email: user.email,
        totalOpportunities: opportunities?.length || 0,
        newOpportunities: newOpportunities?.length || 0,
        closedOpportunities: closedOpportunities?.length || 0,
        totalValue,
        closedValue
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reportsSent: reports.length,
        details: reports
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
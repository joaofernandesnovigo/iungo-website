import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stageNames: Record<string, string> = {
  lead: 'Lead',
  prospecting: 'Prospecção',
  qualification: 'Qualificação',
  solution: 'Solução',
  pov: 'PoV',
  negotiation: 'Negociação',
  closed: 'Fechado',
  lost: 'Perdido'
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

    const { opportunityId, oldStage, newStage } = await req.json();

    const { data: opportunity, error: oppError } = await supabaseClient
      .from('opportunities')
      .select('*, assigned_to:profiles!opportunities_assigned_to_fkey(id, email, name), company:companies(name)')
      .eq('id', opportunityId)
      .single();

    if (oppError) throw oppError;

    if (opportunity && opportunity.assigned_to) {
      await supabaseClient
        .from('notifications')
        .insert([
          {
            user_id: opportunity.assigned_to.id,
            title: 'Oportunidade Atualizada',
            message: `A oportunidade "${opportunity.title}" mudou de ${stageNames[oldStage]} para ${stageNames[newStage]}.`,
            type: 'stage_changed',
            link: `/crm?opportunity=${opportunity.id}`
          }
        ]);

      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      
      if (RESEND_API_KEY) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1f2e;">Oportunidade Atualizada</h2>
            <p>Olá ${opportunity.assigned_to.name},</p>
            <p>A oportunidade <strong>${opportunity.title}</strong> da empresa <strong>${opportunity.company?.name}</strong> mudou de estágio:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>De:</strong> ${stageNames[oldStage]}</p>
              <p style="margin: 10px 0 0 0;"><strong>Para:</strong> ${stageNames[newStage]}</p>
            </div>
            <p>Valor: <strong>R$ ${opportunity.value.toLocaleString('pt-BR')}</strong></p>
            <a href="https://iungo-ai.com/crm?opportunity=${opportunity.id}" style="display: inline-block; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Ver Oportunidade</a>
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
            to: opportunity.assigned_to.email,
            subject: `Oportunidade "${opportunity.title}" mudou para ${stageNames[newStage]}`,
            html: emailHtml,
          }),
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
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
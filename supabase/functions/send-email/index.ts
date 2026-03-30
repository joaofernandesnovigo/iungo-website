import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('📧 ========================================');
    console.log('📧 INICIANDO ENVIO DE EMAIL');
    console.log('📧 ========================================');
    
    const { to, subject, html, from = 'CRM Iungo <noreply@iungo-ai.com>' }: EmailRequest = await req.json();

    console.log('📧 Destinatário:', to);
    console.log('📧 Assunto:', subject);
    console.log('📧 Remetente:', from);
    console.log('📧 Tamanho do HTML:', html.length, 'caracteres');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY não configurada!');
      throw new Error('⚠️ Configuração necessária: A chave RESEND_API_KEY precisa ser configurada nos secrets do Supabase.');
    }

    console.log('✅ RESEND_API_KEY encontrada');
    console.log('🔑 Primeiros 10 caracteres:', RESEND_API_KEY.substring(0, 10) + '...');
    console.log('📧 Enviando requisição para API Resend...');

    const requestBody = {
      from,
      to,
      subject,
      html,
    };

    console.log('📦 Corpo da requisição:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📧 Status da resposta:', response.status);
    console.log('📧 Status text:', response.statusText);

    const responseText = await response.text();
    console.log('📧 Resposta completa:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Erro ao fazer parse da resposta:', e);
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error('❌ ========================================');
      console.error('❌ ERRO NA API RESEND');
      console.error('❌ ========================================');
      console.error('❌ Status:', response.status);
      console.error('❌ Dados:', JSON.stringify(data, null, 2));
      
      let errorMessage = 'Erro ao enviar e-mail';
      
      if (response.status === 401) {
        errorMessage = '🔑 Erro de autenticação: Verifique se a chave RESEND_API_KEY está correta no Supabase. A chave deve começar com "re_" e ser válida.';
      } else if (response.status === 403) {
        errorMessage = '🚫 Acesso negado: Verifique as permissões da sua conta Resend.';
      } else if (response.status === 422) {
        errorMessage = '📧 Dados inválidos: ' + (data.message || 'Verifique o email do remetente e destinatário.');
      } else {
        errorMessage = data.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    console.log('✅ ========================================');
    console.log('✅ EMAIL ENVIADO COM SUCESSO!');
    console.log('✅ ========================================');
    console.log('✅ ID do email:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'E-mail enviado com sucesso',
        id: data.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERRO GERAL');
    console.error('❌ ========================================');
    console.error('❌ Mensagem:', error.message);
    console.error('❌ Stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Verifique os logs da Edge Function no Supabase Dashboard para mais detalhes'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
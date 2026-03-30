/**
 * ============================================
 * EDGE FUNCTION: AI Completion (OpenAI)
 * ============================================
 * 
 * 🔒 SEGURANÇA:
 * Esta Edge Function é necessária para proteger a API Key da OpenAI.
 * NUNCA exponha API Keys no frontend - sempre use Edge Functions para
 * chamadas a serviços externos que requerem autenticação.
 * 
 * 📋 CONFIGURAÇÃO NECESSÁRIA:
 * 
 * 1. Obtenha sua API Key da OpenAI:
 *    - Acesse: https://platform.openai.com/api-keys
 *    - Crie uma nova API Key
 *    - Copie a chave (ela só aparece uma vez!)
 * 
 * 2. Configure a API Key no Supabase:
 *    - Acesse: Supabase Dashboard > Edge Functions > Secrets
 *    - Adicione um novo secret:
 *      Nome: OPENAI_API_KEY
 *      Valor: sua-api-key-aqui
 * 
 * 3. Deploy da função:
 *    ```bash
 *    supabase functions deploy ai-completion
 *    ```
 * 
 * 💡 CASOS DE USO:
 * - Chatbot IA no CRM
 * - Sugestões de resposta no CX
 * - Análise de sentimento
 * - Resumo de conversas
 * - Geração de templates de email
 * - Previsões e insights
 * 
 * 🔧 COMO USAR NO FRONTEND:
 * ```typescript
 * const { data, error } = await supabase.functions.invoke('ai-completion', {
 *   body: {
 *     messages: [
 *       { role: 'system', content: 'Você é um assistente útil.' },
 *       { role: 'user', content: 'Olá!' }
 *     ],
 *     model: 'gpt-4o-mini',
 *     temperature: 0.7,
 *     max_tokens: 500
 *   }
 * });
 * ```
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Tipos para melhor type safety
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

serve(async (req) => {
  // CORS headers para permitir chamadas do frontend
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verificar autenticação do usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado: Token de autenticação ausente');
    }

    // Criar cliente Supabase para verificar o usuário
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar se o usuário está autenticado
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Não autorizado: Usuário inválido');
    }

    console.log(`✅ Usuário autenticado: ${user.id}`);

    // 2. Obter API Key da OpenAI dos secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error(
        '⚠️ OPENAI_API_KEY não configurada. Configure em: Supabase Dashboard > Edge Functions > Secrets'
      );
    }

    // 3. Parse do body da requisição
    const requestBody: RequestBody = await req.json();
    const {
      messages,
      model = 'gpt-4o-mini', // Modelo padrão (mais barato e rápido)
      temperature = 0.7,
      max_tokens = 500,
      stream = false,
    } = requestBody;

    // Validações
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Mensagens inválidas ou ausentes');
    }

    console.log(`🤖 Chamando OpenAI - Modelo: ${model}, Mensagens: ${messages.length}`);

    // 4. Chamar API da OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ Erro da OpenAI:', errorData);
      throw new Error(`Erro da OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data: OpenAIResponse = await openaiResponse.json();

    console.log(`✅ Resposta recebida - Tokens: ${data.usage.total_tokens}`);

    // 5. Retornar resposta
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('❌ Erro na Edge Function:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});

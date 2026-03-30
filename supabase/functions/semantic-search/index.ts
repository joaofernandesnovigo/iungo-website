import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar usuário
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('Perfil não encontrado');
    }

    // Receber dados do request
    const { query, matchThreshold = 0.7, matchCount = 5, useGPT = true } = await req.json();

    if (!query) {
      throw new Error('Query é obrigatória');
    }

    // Verificar se OpenAI API Key está configurada
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API Key não configurada');
    }

    // Gerar embedding da query
    console.log('Gerando embedding para query:', query);
    
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      const error = await embeddingResponse.text();
      console.error('Erro OpenAI:', error);
      throw new Error('Erro ao gerar embedding da query');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    console.log('Embedding da query gerado com sucesso');

    // Buscar documentos similares usando a função match_documents
    const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (searchError) {
      console.error('Erro ao buscar documentos:', searchError);
      throw new Error('Erro ao buscar documentos similares');
    }

    console.log(`Encontrados ${documents?.length || 0} documentos relevantes`);

    // Se não usar GPT, retornar apenas os documentos
    if (!useGPT) {
      return new Response(
        JSON.stringify({
          success: true,
          documents: documents || [],
          answer: null,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Preparar contexto para o GPT
    const context = documents && documents.length > 0
      ? documents.map((doc: any) => `Documento: ${doc.title}\n\n${doc.content}`).join('\n\n---\n\n')
      : 'Nenhum documento relevante encontrado na base de conhecimento.';

    // Gerar resposta com GPT-4
    console.log('Gerando resposta com GPT-4...');
    
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em responder perguntas baseado em documentos da base de conhecimento.

INSTRUÇÕES:
1. Use APENAS as informações dos documentos fornecidos para responder
2. Se a informação não estiver nos documentos, diga claramente que não encontrou
3. Cite os documentos usados na resposta
4. Seja claro, objetivo e profissional
5. Se houver múltiplas fontes, combine as informações de forma coerente

DOCUMENTOS DISPONÍVEIS:
${context}`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!gptResponse.ok) {
      const error = await gptResponse.text();
      console.error('Erro GPT:', error);
      throw new Error('Erro ao gerar resposta com GPT');
    }

    const gptData = await gptResponse.json();
    const answer = gptData.choices[0].message.content;

    console.log('Resposta gerada com sucesso');

    return new Response(
      JSON.stringify({
        success: true,
        answer,
        documents: documents || [],
        sources: documents?.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          similarity: doc.similarity,
        })) || [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
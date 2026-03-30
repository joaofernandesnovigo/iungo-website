-- ============================================
-- FUNÇÃO RPC: match_documents
-- ============================================
-- Função para busca semântica usando distância de cosseno
-- Retorna documentos mais similares ao vetor de consulta
-- Autor: Engenheiro de Dados
-- Data: 2024
-- ============================================

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),  -- Vetor da pergunta/consulta
  match_threshold float DEFAULT 0.7,  -- Limite mínimo de similaridade (0-1)
  match_count int DEFAULT 5  -- Número máximo de resultados
)
RETURNS TABLE (
  id uuid,
  tenant_id uuid,
  title text,
  content text,
  metadata jsonb,
  similarity float,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER  -- Executa com privilégios do criador da função
SET search_path = public
AS $$
DECLARE
  current_tenant_id uuid;
BEGIN
  -- ============================================
  -- SEGURANÇA: Validar usuário autenticado
  -- ============================================
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  -- ============================================
  -- SEGURANÇA: Obter tenant_id do usuário atual
  -- ============================================
  SELECT p.tenant_id INTO current_tenant_id
  FROM profiles p
  WHERE p.id = auth.uid();

  IF current_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant não encontrado para o usuário';
  END IF;

  -- ============================================
  -- BUSCA SEMÂNTICA COM ISOLAMENTO POR TENANT
  -- ============================================
  -- Usa distância de cosseno (<=>) para medir similaridade
  -- Quanto MENOR a distância, MAIOR a similaridade
  -- Similaridade = 1 - distância_cosseno
  RETURN QUERY
  SELECT
    kb.id,
    kb.tenant_id,
    kb.title,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) AS similarity,  -- Converte distância em similaridade
    kb.created_at
  FROM knowledge_base kb
  WHERE 
    -- ISOLAMENTO: Apenas documentos do tenant do usuário
    kb.tenant_id = current_tenant_id
    -- FILTRO: Apenas documentos acima do threshold de similaridade
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY 
    -- Ordena por similaridade (mais similar primeiro)
    kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================

-- COMO USAR:
-- 
-- 1. Gerar embedding da pergunta usando OpenAI:
--    const embedding = await openai.embeddings.create({
--      model: 'text-embedding-ada-002',
--      input: 'Como criar uma oportunidade no CRM?'
--    });
--
-- 2. Chamar a função no Supabase:
--    const { data } = await supabase.rpc('match_documents', {
--      query_embedding: embedding.data[0].embedding,
--      match_threshold: 0.7,  // 70% de similaridade mínima
--      match_count: 5  // Top 5 documentos
--    });
--
-- 3. Usar os documentos retornados como contexto para GPT:
--    const context = data.map(d => d.content).join('\n\n');
--    const response = await openai.chat.completions.create({
--      model: 'gpt-4',
--      messages: [
--        { role: 'system', content: `Contexto: ${context}` },
--        { role: 'user', content: pergunta }
--      ]
--    });

-- PARÂMETROS:
-- - query_embedding: Vetor de 1536 dimensões da pergunta (gerado pela OpenAI)
-- - match_threshold: Similaridade mínima (0-1). Padrão: 0.7 (70%)
--   * 0.9-1.0: Muito similar (quase idêntico)
--   * 0.7-0.9: Similar (relevante)
--   * 0.5-0.7: Moderadamente similar
--   * 0.0-0.5: Pouco similar (não relevante)
-- - match_count: Número máximo de documentos a retornar. Padrão: 5

-- RETORNO:
-- Tabela com colunas:
-- - id: UUID do documento
-- - tenant_id: UUID do tenant (empresa)
-- - title: Título do documento
-- - content: Conteúdo completo
-- - metadata: Metadados em JSON (tipo, tags, etc)
-- - similarity: Grau de similaridade (0-1, quanto maior melhor)
-- - created_at: Data de criação

-- SEGURANÇA:
-- - Valida se o usuário está autenticado
-- - Filtra automaticamente por tenant_id do usuário
-- - Não permite acesso cross-tenant (empresa A não vê docs da empresa B)
-- - SECURITY DEFINER garante execução segura

-- PERFORMANCE:
-- - Usa índice IVFFlat para busca vetorial rápida
-- - Distância de cosseno é otimizada pelo pgvector
-- - Limite de resultados evita sobrecarga

-- EXEMPLO DE RESULTADO:
-- [
--   {
--     "id": "uuid-1",
--     "tenant_id": "uuid-tenant",
--     "title": "Manual do CRM",
--     "content": "O CRM permite gerenciar clientes...",
--     "metadata": {"tipo": "manual", "tags": ["crm", "vendas"]},
--     "similarity": 0.92,
--     "created_at": "2024-01-15T10:30:00Z"
--   },
--   {
--     "id": "uuid-2",
--     "tenant_id": "uuid-tenant",
--     "title": "FAQ Atendimento",
--     "content": "Para atender um cliente...",
--     "metadata": {"tipo": "faq", "tags": ["atendimento"]},
--     "similarity": 0.87,
--     "created_at": "2024-01-14T09:20:00Z"
--   }
-- ]

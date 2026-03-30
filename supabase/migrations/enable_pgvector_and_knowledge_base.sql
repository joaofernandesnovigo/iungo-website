-- ============================================
-- INFRAESTRUTURA DE IA COM PGVECTOR
-- ============================================
-- Este script configura a base para busca semântica com IA
-- Autor: Engenheiro de Dados
-- Data: 2024
-- ============================================

-- ============================================
-- PARTE 1: Habilitar extensão pgvector
-- ============================================
-- A extensão pgvector adiciona suporte nativo para vetores no PostgreSQL
-- Permite armazenar embeddings e fazer busca por similaridade
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- PARTE 2: Criar tabela knowledge_base
-- ============================================
-- Tabela para armazenar documentos e seus embeddings vetoriais
-- Suporta busca semântica usando IA (OpenAI, etc)
CREATE TABLE IF NOT EXISTS knowledge_base (
  -- Identificador único do documento
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Tenant (empresa) dona do documento - isolamento multi-tenant
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Título do documento
  title TEXT NOT NULL,
  
  -- Conteúdo completo extraído do documento
  content TEXT NOT NULL,
  
  -- Vetor de embedding de 1536 dimensões (OpenAI text-embedding-ada-002)
  -- Este vetor representa o significado semântico do documento
  embedding vector(1536),
  
  -- Metadados extras em formato JSON (tipo, tags, autor, fonte, URL, etc)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps de auditoria
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PARTE 3: Criar índices otimizados
-- ============================================

-- Índice IVFFlat para busca vetorial RÁPIDA usando distância de cosseno
-- lists = 100 é adequado para até 100k documentos
-- Para mais documentos, ajustar: 100k-1M docs = lists 1000, 1M+ = sqrt(total_rows)
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Índice para filtrar por tenant (essencial para multi-tenancy)
CREATE INDEX IF NOT EXISTS knowledge_base_tenant_id_idx 
ON knowledge_base(tenant_id);

-- Índice full-text search para título (busca textual tradicional)
CREATE INDEX IF NOT EXISTS knowledge_base_title_idx 
ON knowledge_base 
USING gin(to_tsvector('portuguese', title));

-- Índice full-text search para conteúdo (busca textual tradicional)
CREATE INDEX IF NOT EXISTS knowledge_base_content_idx 
ON knowledge_base 
USING gin(to_tsvector('portuguese', content));

-- Índice para metadados JSONB (permite filtros avançados)
CREATE INDEX IF NOT EXISTS knowledge_base_metadata_idx 
ON knowledge_base 
USING gin(metadata);

-- ============================================
-- PARTE 4: Trigger para atualizar updated_at
-- ============================================
-- Atualiza automaticamente o campo updated_at quando o registro é modificado
CREATE OR REPLACE FUNCTION update_knowledge_base_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_base_updated_at
BEFORE UPDATE ON knowledge_base
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_base_updated_at();

-- ============================================
-- PARTE 5: Habilitar RLS (Row Level Security)
-- ============================================
-- RLS garante que cada tenant só acesse seus próprios documentos
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PARTE 6: Políticas de Segurança (RLS)
-- ============================================

-- Política SELECT: Usuários só veem documentos do próprio tenant
-- Garante isolamento total entre empresas
CREATE POLICY "Users can view documents from their tenant"
ON knowledge_base
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Política INSERT: Apenas admin e superadmin podem adicionar documentos
-- Previne que usuários comuns poluam a base de conhecimento
CREATE POLICY "Admins can insert documents"
ON knowledge_base
FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- Política UPDATE: Apenas admin e superadmin podem editar documentos do próprio tenant
CREATE POLICY "Admins can update documents from their tenant"
ON knowledge_base
FOR UPDATE
USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- Política DELETE: Apenas admin e superadmin podem deletar documentos do próprio tenant
CREATE POLICY "Admins can delete documents from their tenant"
ON knowledge_base
FOR DELETE
USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- ============================================
-- COMENTÁRIOS FINAIS
-- ============================================
-- A tabela knowledge_base está pronta para:
-- 1. Armazenar documentos com embeddings vetoriais
-- 2. Busca semântica usando distância de cosseno
-- 3. Isolamento total por tenant (RLS)
-- 4. Integração com OpenAI para gerar embeddings
-- 5. RAG (Retrieval-Augmented Generation) com GPT

-- Próximos passos:
-- 1. Criar função match_documents() para busca semântica
-- 2. Criar Edge Function para gerar embeddings
-- 3. Criar Edge Function para busca com IA (RAG)

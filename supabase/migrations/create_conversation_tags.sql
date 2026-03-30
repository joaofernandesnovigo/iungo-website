-- Tabela de tags coloridas
CREATE TABLE IF NOT EXISTS conversation_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversation_tags_tenant ON conversation_tags(tenant_id);

-- RLS Policies
ALTER TABLE conversation_tags ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver tags do próprio tenant
CREATE POLICY "Users can view tags from their tenant"
  ON conversation_tags FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Usuários podem criar tags no próprio tenant
CREATE POLICY "Users can create tags in their tenant"
  ON conversation_tags FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Usuários podem atualizar tags do próprio tenant
CREATE POLICY "Users can update tags from their tenant"
  ON conversation_tags FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Usuários podem deletar tags do próprio tenant
CREATE POLICY "Users can delete tags from their tenant"
  ON conversation_tags FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Tabela pivô para relacionar conversas e tags
CREATE TABLE IF NOT EXISTS conversation_tag_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES conversation_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, tag_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversation_tag_members_conversation ON conversation_tag_members(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_tag_members_tag ON conversation_tag_members(tag_id);

-- RLS Policies
ALTER TABLE conversation_tag_members ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver tags de conversas do próprio tenant
CREATE POLICY "Users can view conversation tags from their tenant"
  ON conversation_tag_members FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id IN (
        SELECT tenant_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Usuários podem adicionar tags em conversas do próprio tenant
CREATE POLICY "Users can add tags to conversations in their tenant"
  ON conversation_tag_members FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id IN (
        SELECT tenant_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Usuários podem remover tags de conversas do próprio tenant
CREATE POLICY "Users can remove tags from conversations in their tenant"
  ON conversation_tag_members FOR DELETE
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id IN (
        SELECT tenant_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Inserir tags de exemplo coloridas
INSERT INTO conversation_tags (tenant_id, name, color_hex)
SELECT 
  t.id as tenant_id,
  tag.name,
  tag.color_hex
FROM tenants t
CROSS JOIN (
  VALUES 
    ('Urgente', '#EF4444'),
    ('Importante', '#F59E0B'),
    ('Aguardando', '#3B82F6'),
    ('Resolvido', '#10B981'),
    ('Bug', '#8B5CF6'),
    ('Feedback', '#EC4899'),
    ('Dúvida', '#6366F1'),
    ('Suporte', '#14B8A6')
) AS tag(name, color_hex)
WHERE NOT EXISTS (
  SELECT 1 FROM conversation_tags ct 
  WHERE ct.tenant_id = t.id AND ct.name = tag.name
)
LIMIT 8;

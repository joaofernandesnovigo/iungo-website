-- Tabela de tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#14B8A6',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de relacionamento ticket_tags
CREATE TABLE IF NOT EXISTS ticket_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ticket_id, tag_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ticket_tags_ticket_id ON ticket_tags(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_tags_tag_id ON ticket_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tags_updated_at();

-- RLS Policies para tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Todos podem visualizar tags
CREATE POLICY "Tags são visíveis para todos autenticados"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

-- Apenas admins podem criar tags
CREATE POLICY "Apenas admins podem criar tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.is_active = true
    )
  );

-- Apenas admins podem atualizar tags
CREATE POLICY "Apenas admins podem atualizar tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.is_active = true
    )
  );

-- Apenas admins podem deletar tags
CREATE POLICY "Apenas admins podem deletar tags"
  ON tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.is_active = true
    )
  );

-- RLS Policies para ticket_tags
ALTER TABLE ticket_tags ENABLE ROW LEVEL SECURITY;

-- Todos podem visualizar tags de tickets
CREATE POLICY "Tags de tickets são visíveis para todos autenticados"
  ON ticket_tags FOR SELECT
  TO authenticated
  USING (true);

-- Admins podem adicionar tags a qualquer ticket
CREATE POLICY "Admins podem adicionar tags a tickets"
  ON ticket_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.is_active = true
    )
  );

-- Admins podem remover tags de tickets
CREATE POLICY "Admins podem remover tags de tickets"
  ON ticket_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.is_active = true
    )
  );

-- Inserir algumas tags padrão
INSERT INTO tags (name, color) VALUES
  ('Urgente', '#EF4444'),
  ('Bug', '#F59E0B'),
  ('Dúvida', '#3B82F6'),
  ('Solicitação', '#8B5CF6'),
  ('Financeiro', '#10B981')
ON CONFLICT (name) DO NOTHING;

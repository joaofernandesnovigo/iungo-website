-- Criação da tabela whatsapp_templates
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
  language TEXT NOT NULL DEFAULT 'pt_BR',
  body TEXT NOT NULL,
  header TEXT,
  footer TEXT,
  buttons JSONB DEFAULT '[]'::jsonb,
  variables JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  rejection_reason TEXT,
  whatsapp_template_id TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_whatsapp_templates_tenant ON whatsapp_templates(tenant_id);
CREATE INDEX idx_whatsapp_templates_status ON whatsapp_templates(status);
CREATE INDEX idx_whatsapp_templates_category ON whatsapp_templates(category);
CREATE INDEX idx_whatsapp_templates_created_by ON whatsapp_templates(created_by);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_whatsapp_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_whatsapp_templates_updated_at
  BEFORE UPDATE ON whatsapp_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_templates_updated_at();

-- Habilitar RLS
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver templates do seu tenant
CREATE POLICY "Users can view templates from their tenant"
  ON whatsapp_templates
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política: Usuários podem criar templates no seu tenant
CREATE POLICY "Users can create templates in their tenant"
  ON whatsapp_templates
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política: Usuários podem atualizar templates do seu tenant
CREATE POLICY "Users can update templates from their tenant"
  ON whatsapp_templates
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política: Usuários podem deletar templates do seu tenant
CREATE POLICY "Users can delete templates from their tenant"
  ON whatsapp_templates
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Comentários
COMMENT ON TABLE whatsapp_templates IS 'Templates de mensagens do WhatsApp Business API';
COMMENT ON COLUMN whatsapp_templates.category IS 'Categoria do template: MARKETING (promoções), UTILITY (notificações), AUTHENTICATION (códigos)';
COMMENT ON COLUMN whatsapp_templates.language IS 'Código do idioma (pt_BR, en_US, es_ES, etc)';
COMMENT ON COLUMN whatsapp_templates.body IS 'Corpo da mensagem com variáveis {{1}}, {{2}}, etc';
COMMENT ON COLUMN whatsapp_templates.variables IS 'Array com nomes das variáveis para facilitar preenchimento';
COMMENT ON COLUMN whatsapp_templates.status IS 'Status de aprovação: PENDING (aguardando), APPROVED (aprovado), REJECTED (rejeitado)';
COMMENT ON COLUMN whatsapp_templates.whatsapp_template_id IS 'ID do template no WhatsApp Business API após aprovação';

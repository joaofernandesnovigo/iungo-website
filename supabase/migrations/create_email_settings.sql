-- Criar tabela de configurações de email SMTP
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 587,
  smtp_secure BOOLEAN DEFAULT true,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_password TEXT NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  reply_to_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Habilitar RLS
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas configurações do seu tenant
CREATE POLICY "Users can view their tenant email settings"
  ON email_settings
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política: Apenas admins podem inserir/atualizar configurações
CREATE POLICY "Admins can manage email settings"
  ON email_settings
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Criar índice
CREATE INDEX idx_email_settings_tenant ON email_settings(tenant_id);

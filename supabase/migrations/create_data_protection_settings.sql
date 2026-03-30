-- Criar tabela de configuração de proteção de dados
CREATE TABLE IF NOT EXISTS data_protection_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  mask_cpf BOOLEAN DEFAULT true,
  mask_credit_card BOOLEAN DEFAULT true,
  mask_phone BOOLEAN DEFAULT false,
  mask_email BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Habilitar RLS
ALTER TABLE data_protection_settings ENABLE ROW LEVEL SECURITY;

-- Política para visualizar configurações do próprio tenant
CREATE POLICY "Users can view their tenant data protection settings"
  ON data_protection_settings
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política para atualizar configurações (apenas admin)
CREATE POLICY "Admins can update data protection settings"
  ON data_protection_settings
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Inserir configurações padrão para tenants existentes
INSERT INTO data_protection_settings (tenant_id, mask_cpf, mask_credit_card, mask_phone, mask_email)
SELECT id, true, true, false, false
FROM tenants
ON CONFLICT (tenant_id) DO NOTHING;

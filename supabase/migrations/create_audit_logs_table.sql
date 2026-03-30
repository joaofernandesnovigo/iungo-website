-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Comentários
COMMENT ON TABLE audit_logs IS 'Registro de auditoria de ações críticas no sistema';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de ação: force_logout, delete_contact, export_data, etc';
COMMENT ON COLUMN audit_logs.resource_type IS 'Tipo de recurso afetado: contact, conversation, user, etc';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID do recurso afetado';
COMMENT ON COLUMN audit_logs.metadata IS 'Dados adicionais sobre a ação em formato JSON';

-- Habilitar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas superadmin e admin podem visualizar logs
CREATE POLICY "Superadmin e Admin podem visualizar logs"
ON audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('superadmin', 'admin')
    AND (
      profiles.tenant_id = audit_logs.tenant_id 
      OR profiles.role = 'superadmin'
    )
  )
);

-- Policy: Sistema pode inserir logs (via service role)
CREATE POLICY "Sistema pode inserir logs"
ON audit_logs
FOR INSERT
WITH CHECK (true);

-- Policy: Ninguém pode atualizar ou deletar logs (imutável)
CREATE POLICY "Logs são imutáveis"
ON audit_logs
FOR UPDATE
USING (false);

CREATE POLICY "Logs não podem ser deletados"
ON audit_logs
FOR DELETE
USING (false);

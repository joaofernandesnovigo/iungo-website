-- Criar tabela de permissões customizadas
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('agent', 'admin', 'superadmin')),
  
  -- Permissões de Conversas
  can_view_conversations BOOLEAN DEFAULT true,
  can_reply_conversations BOOLEAN DEFAULT true,
  can_assign_conversations BOOLEAN DEFAULT false,
  can_close_conversations BOOLEAN DEFAULT true,
  can_delete_conversations BOOLEAN DEFAULT false,
  can_export_conversations BOOLEAN DEFAULT false,
  
  -- Permissões de Contatos
  can_view_contacts BOOLEAN DEFAULT true,
  can_create_contacts BOOLEAN DEFAULT true,
  can_edit_contacts BOOLEAN DEFAULT true,
  can_delete_contacts BOOLEAN DEFAULT false,
  can_export_contacts BOOLEAN DEFAULT false,
  
  -- Permissões de Relatórios
  can_view_reports BOOLEAN DEFAULT false,
  can_view_analytics BOOLEAN DEFAULT false,
  can_export_reports BOOLEAN DEFAULT false,
  
  -- Permissões de Configurações
  can_manage_team BOOLEAN DEFAULT false,
  can_manage_channels BOOLEAN DEFAULT false,
  can_manage_automation BOOLEAN DEFAULT false,
  can_manage_sla BOOLEAN DEFAULT false,
  can_manage_billing BOOLEAN DEFAULT false,
  
  -- Permissões de Sistema
  can_view_audit_logs BOOLEAN DEFAULT false,
  can_manage_roles BOOLEAN DEFAULT false,
  can_force_logout BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tenant_id, role)
);

-- Índices para performance
CREATE INDEX idx_role_permissions_tenant ON role_permissions(tenant_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role);

-- RLS Policies
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Apenas superadmin e admin podem visualizar permissões
CREATE POLICY "Users can view role permissions of their tenant"
  ON role_permissions FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Apenas superadmin pode editar permissões
CREATE POLICY "Only superadmin can update role permissions"
  ON role_permissions FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'superadmin'
    )
  );

-- Apenas superadmin pode criar permissões
CREATE POLICY "Only superadmin can insert role permissions"
  ON role_permissions FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'superadmin'
    )
  );

-- Inserir permissões padrão para cada role
INSERT INTO role_permissions (tenant_id, role, 
  can_view_conversations, can_reply_conversations, can_assign_conversations, can_close_conversations, can_delete_conversations, can_export_conversations,
  can_view_contacts, can_create_contacts, can_edit_contacts, can_delete_contacts, can_export_contacts,
  can_view_reports, can_view_analytics, can_export_reports,
  can_manage_team, can_manage_channels, can_manage_automation, can_manage_sla, can_manage_billing,
  can_view_audit_logs, can_manage_roles, can_force_logout
)
SELECT 
  t.id as tenant_id,
  'agent' as role,
  true, true, false, true, false, false,  -- Conversas
  true, true, true, false, false,          -- Contatos
  false, false, false,                     -- Relatórios
  false, false, false, false, false,       -- Configurações
  false, false, false                      -- Sistema
FROM tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions rp 
  WHERE rp.tenant_id = t.id AND rp.role = 'agent'
);

INSERT INTO role_permissions (tenant_id, role,
  can_view_conversations, can_reply_conversations, can_assign_conversations, can_close_conversations, can_delete_conversations, can_export_conversations,
  can_view_contacts, can_create_contacts, can_edit_contacts, can_delete_contacts, can_export_contacts,
  can_view_reports, can_view_analytics, can_export_reports,
  can_manage_team, can_manage_channels, can_manage_automation, can_manage_sla, can_manage_billing,
  can_view_audit_logs, can_manage_roles, can_force_logout
)
SELECT 
  t.id as tenant_id,
  'admin' as role,
  true, true, true, true, true, true,      -- Conversas
  true, true, true, true, true,            -- Contatos
  true, true, true,                        -- Relatórios
  true, true, true, true, false,           -- Configurações
  true, false, true                        -- Sistema
FROM tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions rp 
  WHERE rp.tenant_id = t.id AND rp.role = 'admin'
);

INSERT INTO role_permissions (tenant_id, role,
  can_view_conversations, can_reply_conversations, can_assign_conversations, can_close_conversations, can_delete_conversations, can_export_conversations,
  can_view_contacts, can_create_contacts, can_edit_contacts, can_delete_contacts, can_export_contacts,
  can_view_reports, can_view_analytics, can_export_reports,
  can_manage_team, can_manage_channels, can_manage_automation, can_manage_sla, can_manage_billing,
  can_view_audit_logs, can_manage_roles, can_force_logout
)
SELECT 
  t.id as tenant_id,
  'superadmin' as role,
  true, true, true, true, true, true,      -- Conversas
  true, true, true, true, true,            -- Contatos
  true, true, true,                        -- Relatórios
  true, true, true, true, true,            -- Configurações
  true, true, true                         -- Sistema
FROM tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions rp 
  WHERE rp.tenant_id = t.id AND rp.role = 'superadmin'
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_role_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_permissions_updated_at
  BEFORE UPDATE ON role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_role_permissions_updated_at();

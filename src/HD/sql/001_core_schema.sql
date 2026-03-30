-- =====================================================
-- READDY HELPDESK - CORE DATABASE SCHEMA
-- Versão: 1.0.0
-- Descrição: Schema completo com tabelas, índices, functions e triggers
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: profiles
-- Descrição: Perfis de usuários (admins e clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  company_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- =====================================================
-- TABELA: tickets
-- Descrição: Tickets de suporte
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'open', 'pending', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Índices para tickets (otimização de queries)
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

-- =====================================================
-- TABELA: ticket_messages
-- Descrição: Mensagens e notas internas dos tickets
-- =====================================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para ticket_messages
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_sender_id ON ticket_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON ticket_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_is_internal ON ticket_messages(is_internal);

-- =====================================================
-- TABELA: ticket_history
-- Descrição: Histórico de alterações dos tickets
-- =====================================================
CREATE TABLE IF NOT EXISTS ticket_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para ticket_history
CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket_id ON ticket_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_history_created_at ON ticket_history(created_at DESC);

-- =====================================================
-- FUNCTION: generate_ticket_number
-- Descrição: Gera números de ticket no formato TKT-000001
-- =====================================================
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  ticket_num TEXT;
BEGIN
  -- Busca o maior número existente
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 
    0
  ) + 1 INTO next_number
  FROM tickets
  WHERE ticket_number ~ '^TKT-[0-9]+$';
  
  -- Formata com zeros à esquerda (6 dígitos)
  ticket_num := 'TKT-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: set_ticket_number
-- Descrição: Atribui automaticamente o ticket_number no INSERT
-- =====================================================
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
BEFORE INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION set_ticket_number();

-- =====================================================
-- TRIGGER: update_updated_at
-- Descrição: Atualiza automaticamente o campo updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- TRIGGER: track_ticket_changes
-- Descrição: Registra alterações de status e prioridade
-- =====================================================
CREATE OR REPLACE FUNCTION track_ticket_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Registra mudança de status
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO ticket_history (ticket_id, changed_by, field_name, old_value, new_value)
    VALUES (NEW.id, NEW.assigned_to, 'status', OLD.status, NEW.status);
  END IF;
  
  -- Registra mudança de prioridade
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO ticket_history (ticket_id, changed_by, field_name, old_value, new_value)
    VALUES (NEW.id, NEW.assigned_to, 'priority', OLD.priority, NEW.priority);
  END IF;
  
  -- Registra mudança de atribuição
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO ticket_history (ticket_id, changed_by, field_name, old_value, new_value)
    VALUES (NEW.id, NEW.assigned_to, 'assigned_to', OLD.assigned_to::TEXT, NEW.assigned_to::TEXT);
  END IF;
  
  -- Atualiza timestamps de resolução/fechamento
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
  END IF;
  
  IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
    NEW.closed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_ticket_changes
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION track_ticket_changes();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Descrição: Políticas de segurança por linha
-- =====================================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para tickets
CREATE POLICY "Clientes veem apenas seus tickets"
  ON tickets FOR SELECT
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clientes podem criar tickets"
  ON tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins podem atualizar tickets"
  ON tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para ticket_messages
CREATE POLICY "Usuários veem mensagens de seus tickets"
  ON ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_messages.ticket_id
      AND (tickets.client_id = auth.uid() OR tickets.assigned_to = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Usuários podem criar mensagens"
  ON ticket_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Políticas para ticket_history
CREATE POLICY "Admins veem histórico completo"
  ON ticket_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: tickets com informações completas
CREATE OR REPLACE VIEW tickets_full AS
SELECT 
  t.*,
  c.full_name AS client_name,
  c.email AS client_email,
  c.company_name AS client_company,
  a.full_name AS assigned_to_name,
  a.email AS assigned_to_email,
  (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) AS message_count,
  (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id AND is_internal = false) AS public_message_count
FROM tickets t
LEFT JOIN profiles c ON t.client_id = c.id
LEFT JOIN profiles a ON t.assigned_to = a.id;

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir perfil admin padrão (senha: admin123)
-- NOTA: Em produção, use o Supabase Auth para criar usuários
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@readdy.com', 'Administrador', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

COMMENT ON TABLE profiles IS 'Perfis de usuários do sistema (admins e clientes)';
COMMENT ON TABLE tickets IS 'Tickets de suporte com numeração automática';
COMMENT ON TABLE ticket_messages IS 'Mensagens e notas internas dos tickets';
COMMENT ON TABLE ticket_history IS 'Histórico de alterações dos tickets';
COMMENT ON FUNCTION generate_ticket_number() IS 'Gera números sequenciais no formato TKT-000001';

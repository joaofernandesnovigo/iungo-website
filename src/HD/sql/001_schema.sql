
-- ============================================
-- READDY HELPDESK - DATABASE SCHEMA
-- Execute este script no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. EXTENSÕES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TIPOS ENUM
-- ============================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'client');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('new', 'open', 'pending', 'resolved', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 3. TABELA: hd_profiles
-- ============================================

CREATE TABLE IF NOT EXISTS hd_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  company_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para hd_profiles
CREATE INDEX IF NOT EXISTS idx_hd_profiles_email ON hd_profiles(email);
CREATE INDEX IF NOT EXISTS idx_hd_profiles_role ON hd_profiles(role);
CREATE INDEX IF NOT EXISTS idx_hd_profiles_is_active ON hd_profiles(is_active);

-- ============================================
-- 4. TABELA: hd_tickets
-- ============================================

CREATE TABLE IF NOT EXISTS hd_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES hd_profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES hd_profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'new',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  solution TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Índices B-Tree para otimização de buscas
CREATE INDEX IF NOT EXISTS idx_hd_tickets_status ON hd_tickets(status);
CREATE INDEX IF NOT EXISTS idx_hd_tickets_priority ON hd_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_hd_tickets_client_id ON hd_tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_hd_tickets_assigned_to ON hd_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_hd_tickets_ticket_number ON hd_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_hd_tickets_created_at ON hd_tickets(created_at DESC);

-- ============================================
-- 5. TABELA: hd_ticket_messages
-- ============================================

CREATE TABLE IF NOT EXISTS hd_ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES hd_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES hd_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para hd_ticket_messages
CREATE INDEX IF NOT EXISTS idx_hd_ticket_messages_ticket_id ON hd_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_hd_ticket_messages_sender_id ON hd_ticket_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_hd_ticket_messages_created_at ON hd_ticket_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_hd_ticket_messages_is_internal ON hd_ticket_messages(is_internal);

-- ============================================
-- 6. FUNCTION: generate_ticket_number
-- ============================================

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  ticket_num TEXT;
BEGIN
  -- Obter o próximo número sequencial
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM hd_tickets;
  
  -- Formatar como TKT-000001
  ticket_num := 'TKT-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. TRIGGER: auto_generate_ticket_number
-- ============================================

CREATE OR REPLACE FUNCTION trigger_set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger se existir e recriar
DROP TRIGGER IF EXISTS set_ticket_number ON hd_tickets;

CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON hd_tickets
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_ticket_number();

-- ============================================
-- 8. TRIGGER: auto_update_updated_at
-- ============================================

CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_hd_profiles_timestamp ON hd_profiles;
CREATE TRIGGER update_hd_profiles_timestamp
  BEFORE UPDATE ON hd_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

DROP TRIGGER IF EXISTS update_hd_tickets_timestamp ON hd_tickets;
CREATE TRIGGER update_hd_tickets_timestamp
  BEFORE UPDATE ON hd_tickets
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

DROP TRIGGER IF EXISTS update_hd_ticket_messages_timestamp ON hd_ticket_messages;
CREATE TRIGGER update_hd_ticket_messages_timestamp
  BEFORE UPDATE ON hd_ticket_messages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE hd_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hd_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hd_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para hd_profiles
CREATE POLICY "Users can view their own profile"
  ON hd_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON hd_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hd_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile"
  ON hd_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow insert during signup"
  ON hd_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para hd_tickets
CREATE POLICY "Clients can view their own tickets"
  ON hd_tickets FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Admins can view all tickets"
  ON hd_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hd_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can create tickets"
  ON hd_tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can update any ticket"
  ON hd_tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hd_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can update their own tickets"
  ON hd_tickets FOR UPDATE
  USING (client_id = auth.uid());

CREATE POLICY "Admins can delete tickets"
  ON hd_tickets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hd_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para hd_ticket_messages
CREATE POLICY "Users can view messages of their tickets"
  ON hd_ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hd_tickets
      WHERE hd_tickets.id = ticket_id
      AND (hd_tickets.client_id = auth.uid() OR hd_tickets.assigned_to = auth.uid())
    )
    AND (
      is_internal = false
      OR EXISTS (
        SELECT 1 FROM hd_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Admins can view all messages"
  ON hd_ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hd_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can send messages to their tickets"
  ON hd_ticket_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM hd_tickets
      WHERE hd_tickets.id = ticket_id
      AND (hd_tickets.client_id = auth.uid() OR hd_tickets.assigned_to = auth.uid())
    )
  );

CREATE POLICY "Admins can send messages to any ticket"
  ON hd_ticket_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hd_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 10. COMENTÁRIOS NAS TABELAS
-- ============================================

COMMENT ON TABLE hd_profiles IS 'Perfis de usuários do Helpdesk (admins e clientes)';
COMMENT ON TABLE hd_tickets IS 'Tickets de suporte do Helpdesk';
COMMENT ON TABLE hd_ticket_messages IS 'Mensagens e notas internas dos tickets';

COMMENT ON COLUMN hd_tickets.ticket_number IS 'Número único do ticket no formato TKT-000001';
COMMENT ON COLUMN hd_ticket_messages.is_internal IS 'Se true, mensagem visível apenas para admins';
COMMENT ON COLUMN hd_ticket_messages.attachments IS 'Array JSON de anexos {name, url, size, type}';

-- ============================================
-- FIM DO SCRIPT
-- ============================================
</file>

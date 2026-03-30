-- =====================================================
-- CORREÇÃO COMPLETA DE AUTENTICAÇÃO E RLS
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- 1. CRIAR TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir profile básico para o novo usuário
  INSERT INTO public.profiles (id, full_name, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'agent'),
    'online'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função após inserção de usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CRIAR FUNÇÃO PARA SINCRONIZAR CONTACT COM PROFILE
-- =====================================================
CREATE OR REPLACE FUNCTION public.sync_contact_from_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário não tem tenant_id, é um cliente do portal
  IF NEW.tenant_id IS NULL THEN
    -- Criar ou atualizar contact
    INSERT INTO public.contacts (id, name, email, tenant_id)
    VALUES (
      NEW.id,
      NEW.full_name,
      (SELECT email FROM auth.users WHERE id = NEW.id),
      'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' -- Tenant padrão
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronizar contact após inserção ou atualização de profile
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_contact_from_profile();

-- 3. POLÍTICAS RLS PARA PROFILES
-- =====================================================
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view tenant profiles" ON profiles;

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Política: Usuários podem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Política: Admins e superadmins podem ver todos os perfis do mesmo tenant
CREATE POLICY "Admins can view tenant profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = profiles.tenant_id
    AND p.role IN ('admin', 'superadmin')
  )
);

-- 4. POLÍTICAS RLS PARA CONTACTS
-- =====================================================
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own contact" ON contacts;
DROP POLICY IF EXISTS "Users can insert own contact" ON contacts;
DROP POLICY IF EXISTS "Users can update own contact" ON contacts;
DROP POLICY IF EXISTS "Agents can view tenant contacts" ON contacts;

-- Habilitar RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seu próprio contato
CREATE POLICY "Users can view own contact"
ON contacts FOR SELECT
USING (auth.uid() = id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Política: Usuários podem inserir seu próprio contato
CREATE POLICY "Users can insert own contact"
ON contacts FOR INSERT
WITH CHECK (auth.uid() = id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Política: Usuários podem atualizar seu próprio contato
CREATE POLICY "Users can update own contact"
ON contacts FOR UPDATE
USING (auth.uid() = id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Política: Agentes podem ver todos os contatos do mesmo tenant
CREATE POLICY "Agents can view tenant contacts"
ON contacts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = contacts.tenant_id
  )
);

-- 5. POLÍTICAS RLS PARA TICKETS
-- =====================================================
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON tickets;
DROP POLICY IF EXISTS "Agents can view tenant tickets" ON tickets;
DROP POLICY IF EXISTS "Agents can update tenant tickets" ON tickets;

-- Habilitar RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios tickets
CREATE POLICY "Users can view own tickets"
ON tickets FOR SELECT
USING (
  contact_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM contacts c
    WHERE c.id = tickets.contact_id
    AND (c.id = auth.uid() OR c.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

-- Política: Usuários podem criar seus próprios tickets
CREATE POLICY "Users can create own tickets"
ON tickets FOR INSERT
WITH CHECK (
  contact_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM contacts c
    WHERE c.id = tickets.contact_id
    AND (c.id = auth.uid() OR c.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

-- Política: Agentes podem ver todos os tickets do mesmo tenant
CREATE POLICY "Agents can view tenant tickets"
ON tickets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tickets.tenant_id
  )
);

-- Política: Agentes podem atualizar tickets do mesmo tenant
CREATE POLICY "Agents can update tenant tickets"
ON tickets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tickets.tenant_id
  )
);

-- 6. POLÍTICAS RLS PARA TICKET_COMMENTS
-- =====================================================
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own ticket comments" ON ticket_comments;
DROP POLICY IF EXISTS "Users can create own ticket comments" ON ticket_comments;
DROP POLICY IF EXISTS "Agents can view tenant ticket comments" ON ticket_comments;

-- Habilitar RLS
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver comentários dos seus tickets
CREATE POLICY "Users can view own ticket comments"
ON ticket_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tickets t
    WHERE t.id = ticket_comments.ticket_id
    AND (
      t.contact_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM contacts c
        WHERE c.id = t.contact_id
        AND (c.id = auth.uid() OR c.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
      )
    )
  )
);

-- Política: Usuários podem criar comentários nos seus tickets
CREATE POLICY "Users can create own ticket comments"
ON ticket_comments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM tickets t
    WHERE t.id = ticket_comments.ticket_id
    AND (
      t.contact_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM contacts c
        WHERE c.id = t.contact_id
        AND (c.id = auth.uid() OR c.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
      )
    )
  )
);

-- Política: Agentes podem ver comentários de tickets do mesmo tenant
CREATE POLICY "Agents can view tenant ticket comments"
ON ticket_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tickets t
    JOIN profiles p ON p.id = auth.uid()
    WHERE t.id = ticket_comments.ticket_id
    AND p.tenant_id = t.tenant_id
  )
);

-- 7. CRIAR ÍNDICES PARA MELHORAR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_contact_id ON tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_id ON tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================

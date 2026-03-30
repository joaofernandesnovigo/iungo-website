-- =====================================================
-- CORRECAO COMPLETA DE AUTENTICACAO E RLS - V2
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- 1. REMOVER TRIGGERS ANTIGOS
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.sync_contact_from_profile();

-- 2. CRIAR FUNCAO PARA CRIAR PROFILE AUTOMATICAMENTE
-- =====================================================
-- Esta função NÃO cria o profile automaticamente
-- O profile será criado pelo código da aplicação
-- Isso evita o erro "Database error saving new user"

-- 3. POLITICAS RLS PARA PROFILES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view tenant profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Service role pode inserir qualquer perfil (para o código da aplicação)
CREATE POLICY "Service role can insert profiles"
ON profiles FOR INSERT
WITH CHECK (true);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins podem ver todos os perfis do mesmo tenant
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

-- 4. POLITICAS RLS PARA TENANTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own tenant" ON tenants;
DROP POLICY IF EXISTS "Users can insert tenant" ON tenants;
DROP POLICY IF EXISTS "Users can update own tenant" ON tenants;

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver seu próprio tenant
CREATE POLICY "Users can view own tenant"
ON tenants FOR SELECT
USING (
  owner_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tenants.id
  )
);

-- Usuários podem criar tenant
CREATE POLICY "Users can insert tenant"
ON tenants FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Owners podem atualizar seu tenant
CREATE POLICY "Users can update own tenant"
ON tenants FOR UPDATE
USING (owner_id = auth.uid());

-- 5. POLITICAS RLS PARA CONTACTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own contact" ON contacts;
DROP POLICY IF EXISTS "Users can insert own contact" ON contacts;
DROP POLICY IF EXISTS "Users can update own contact" ON contacts;
DROP POLICY IF EXISTS "Agents can view tenant contacts" ON contacts;
DROP POLICY IF EXISTS "Service role can manage contacts" ON contacts;

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver seu próprio contato
CREATE POLICY "Users can view own contact"
ON contacts FOR SELECT
USING (
  auth.uid() = id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Usuários podem inserir seu próprio contato
CREATE POLICY "Users can insert own contact"
ON contacts FOR INSERT
WITH CHECK (
  auth.uid() = id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Service role pode gerenciar qualquer contato
CREATE POLICY "Service role can manage contacts"
ON contacts FOR ALL
USING (true)
WITH CHECK (true);

-- Usuários podem atualizar seu próprio contato
CREATE POLICY "Users can update own contact"
ON contacts FOR UPDATE
USING (
  auth.uid() = id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Agentes podem ver todos os contatos do mesmo tenant
CREATE POLICY "Agents can view tenant contacts"
ON contacts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = contacts.tenant_id
  )
);

-- 6. POLITICAS RLS PARA TICKETS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON tickets;
DROP POLICY IF EXISTS "Agents can view tenant tickets" ON tickets;
DROP POLICY IF EXISTS "Agents can update tenant tickets" ON tickets;

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver seus próprios tickets
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

-- Usuários podem criar seus próprios tickets
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

-- Agentes podem ver todos os tickets do mesmo tenant
CREATE POLICY "Agents can view tenant tickets"
ON tickets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tickets.tenant_id
  )
);

-- Agentes podem atualizar tickets do mesmo tenant
CREATE POLICY "Agents can update tenant tickets"
ON tickets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tickets.tenant_id
  )
);

-- 7. POLITICAS RLS PARA TICKET_COMMENTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own ticket comments" ON ticket_comments;
DROP POLICY IF EXISTS "Users can create own ticket comments" ON ticket_comments;
DROP POLICY IF EXISTS "Agents can view tenant ticket comments" ON ticket_comments;

ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver comentários dos seus tickets
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

-- Usuários podem criar comentários nos seus tickets
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

-- Agentes podem ver comentários de tickets do mesmo tenant
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

-- 8. CRIAR INDICES PARA MELHORAR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_contact_id ON tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_id ON tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON tenants(owner_id);

-- =====================================================
-- FIM DA MIGRACAO
-- =====================================================

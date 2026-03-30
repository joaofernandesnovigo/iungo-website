-- =====================================================
-- CORRECAO COMPLETA DE AUTENTICACAO E RLS
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- 1. CRIAR TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CRIAR FUNCAO PARA SINCRONIZAR CONTACT COM PROFILE
-- =====================================================
CREATE OR REPLACE FUNCTION public.sync_contact_from_profile()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  default_tenant_id UUID;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  IF NEW.tenant_id IS NULL THEN
    SELECT id INTO default_tenant_id FROM tenants ORDER BY created_at LIMIT 1;
    
    INSERT INTO public.contacts (id, name, email, tenant_id)
    VALUES (
      NEW.id,
      NEW.full_name,
      user_email,
      COALESCE(default_tenant_id, NEW.tenant_id)
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_contact_from_profile();

-- 3. POLITICAS RLS PARA PROFILES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view tenant profiles" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

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

-- 4. POLITICAS RLS PARA CONTACTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own contact" ON contacts;
DROP POLICY IF EXISTS "Users can insert own contact" ON contacts;
DROP POLICY IF EXISTS "Users can update own contact" ON contacts;
DROP POLICY IF EXISTS "Agents can view tenant contacts" ON contacts;

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contact"
ON contacts FOR SELECT
USING (auth.uid() = id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own contact"
ON contacts FOR INSERT
WITH CHECK (auth.uid() = id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own contact"
ON contacts FOR UPDATE
USING (auth.uid() = id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Agents can view tenant contacts"
ON contacts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = contacts.tenant_id
  )
);

-- 5. POLITICAS RLS PARA TICKETS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON tickets;
DROP POLICY IF EXISTS "Agents can view tenant tickets" ON tickets;
DROP POLICY IF EXISTS "Agents can update tenant tickets" ON tickets;

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Agents can view tenant tickets"
ON tickets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tickets.tenant_id
  )
);

CREATE POLICY "Agents can update tenant tickets"
ON tickets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.tenant_id = tickets.tenant_id
  )
);

-- 6. POLITICAS RLS PARA TICKET_COMMENTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own ticket comments" ON ticket_comments;
DROP POLICY IF EXISTS "Users can create own ticket comments" ON ticket_comments;
DROP POLICY IF EXISTS "Agents can view tenant ticket comments" ON ticket_comments;

ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

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

-- 7. CRIAR INDICES PARA MELHORAR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_contact_id ON tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_id ON tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);

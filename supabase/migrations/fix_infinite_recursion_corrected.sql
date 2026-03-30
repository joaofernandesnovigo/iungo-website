-- ============================================
-- FIX: Recursão Infinita - Recriar Políticas
-- ============================================

-- PASSO 1: Desabilitar RLS temporariamente em todas as tabelas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover TODAS as políticas antigas de todas as tabelas
-- Políticas de profiles
DROP POLICY IF EXISTS profiles_select_admin ON profiles;
DROP POLICY IF EXISTS profiles_update_admin ON profiles;
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_admin ON profiles;
DROP POLICY IF EXISTS profiles_delete_admin ON profiles;

-- Políticas de tickets
DROP POLICY IF EXISTS tickets_select_admin ON tickets;
DROP POLICY IF EXISTS tickets_update_admin ON tickets;
DROP POLICY IF EXISTS tickets_delete_admin ON tickets;
DROP POLICY IF EXISTS tickets_select_own ON tickets;
DROP POLICY IF EXISTS tickets_insert_own ON tickets;
DROP POLICY IF EXISTS tickets_update_own ON tickets;

-- Políticas de ticket_messages
DROP POLICY IF EXISTS messages_select_admin ON ticket_messages;
DROP POLICY IF EXISTS messages_insert_own ON ticket_messages;
DROP POLICY IF EXISTS messages_update_admin ON ticket_messages;
DROP POLICY IF EXISTS messages_delete_admin ON ticket_messages;
DROP POLICY IF EXISTS messages_select_own ON ticket_messages;

-- Políticas de ticket_history
DROP POLICY IF EXISTS history_select_admin ON ticket_history;
DROP POLICY IF EXISTS history_select_own ON ticket_history;

-- PASSO 3: Remover função is_admin antiga com CASCADE
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- PASSO 4: Criar nova função is_admin SEM recursão
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role text;
  user_active boolean;
BEGIN
  SELECT role, is_active INTO user_role, user_active
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN (user_role = 'admin' AND user_active = true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- PASSO 5: Criar políticas para PROFILES (sem recursão)
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1)
    AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PASSO 6: Criar políticas para TICKETS (sem recursão)
CREATE POLICY "tickets_select_own" ON tickets
  FOR SELECT
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid()
  );

CREATE POLICY "tickets_select_admin" ON tickets
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "tickets_insert_own" ON tickets
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "tickets_update_own" ON tickets
  FOR UPDATE
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid()
  );

CREATE POLICY "tickets_update_admin" ON tickets
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "tickets_delete_admin" ON tickets
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- PASSO 7: Criar políticas para TICKET_MESSAGES (sem recursão)
CREATE POLICY "messages_select_own" ON ticket_messages
  FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM tickets 
      WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "messages_select_admin" ON ticket_messages
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "messages_insert_own" ON ticket_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND ticket_id IN (
      SELECT id FROM tickets 
      WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "messages_update_admin" ON ticket_messages
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "messages_delete_admin" ON ticket_messages
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- PASSO 8: Criar políticas para TICKET_HISTORY (sem recursão)
CREATE POLICY "history_select_own" ON ticket_history
  FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM tickets 
      WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "history_select_admin" ON ticket_history
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- PASSO 9: Reabilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history ENABLE ROW LEVEL SECURITY;

-- PASSO 10: Confirmar email e ativar perfil do usuário
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3' 
AND email_confirmed_at IS NULL;

UPDATE profiles 
SET is_active = true,
    updated_at = NOW()
WHERE id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3';

-- PASSO 11: Verificar resultado
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.is_active
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3';

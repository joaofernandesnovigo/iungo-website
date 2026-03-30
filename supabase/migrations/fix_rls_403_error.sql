-- ============================================
-- FIX: Erro 403 ao buscar perfil
-- ============================================
-- Este script corrige as políticas RLS que estão
-- bloqueando o acesso aos perfis dos usuários
-- ============================================

-- PASSO 1: Remover políticas antigas
DROP POLICY IF EXISTS profiles_select_admin ON profiles;
DROP POLICY IF EXISTS profiles_update_admin ON profiles;
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_admin ON profiles;
DROP POLICY IF EXISTS profiles_delete_admin ON profiles;

-- PASSO 2: Recriar função is_admin corretamente
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  );
$$;

-- PASSO 3: Criar políticas RLS permissivas

-- Usuários podem ver seu próprio perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Usuários podem atualizar seu próprio perfil (sem mudar role/is_active)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid())
  );

-- Admins podem atualizar qualquer perfil
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Permitir inserção de perfil próprio durante registro
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PASSO 4: Confirmar email do usuário atual
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3' 
AND email_confirmed_at IS NULL;

-- PASSO 5: Ativar perfil do usuário
UPDATE profiles 
SET is_active = true,
    updated_at = NOW()
WHERE id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3';

-- PASSO 6: Verificar se tudo está correto
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

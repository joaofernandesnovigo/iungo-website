-- ============================================
-- FIX: Recursão Infinita nas Políticas RLS
-- ============================================
-- Execute este SQL no Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Cole e Execute

-- PASSO 1: Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover TODAS as políticas antigas
DROP POLICY IF EXISTS profiles_select_admin ON profiles;
DROP POLICY IF EXISTS profiles_update_admin ON profiles;
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_admin ON profiles;
DROP POLICY IF EXISTS profiles_delete_admin ON profiles;

-- PASSO 3: Remover função is_admin antiga
DROP FUNCTION IF EXISTS public.is_admin();

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
  -- Buscar role e status diretamente sem usar políticas RLS
  SELECT role, is_active INTO user_role, user_active
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  -- Retornar true se for admin ativo
  RETURN (user_role = 'admin' AND user_active = true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- PASSO 5: Criar políticas RLS SIMPLES sem recursão

-- Política 1: Usuários podem ver seu próprio perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Admins podem ver todos os perfis (SEM chamar is_admin)
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- Política 3: Usuários podem atualizar seu próprio perfil (sem mudar role/status)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1)
    AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

-- Política 4: Admins podem atualizar qualquer perfil
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- Política 5: Permitir inserção de perfil próprio durante registro
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PASSO 6: Reabilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Confirmar email e ativar perfil do usuário
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3' 
AND email_confirmed_at IS NULL;

UPDATE profiles 
SET is_active = true,
    updated_at = NOW()
WHERE id = 'ed612ad7-8e2d-461d-915f-e9d4725b12b3';

-- PASSO 8: Verificar resultado
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

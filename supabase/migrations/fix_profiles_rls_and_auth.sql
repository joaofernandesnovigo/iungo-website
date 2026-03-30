-- ============================================
-- FIX: Políticas RLS e Autenticação de Perfis
-- ============================================

-- 1. Remover políticas antigas que estão causando erro
DROP POLICY IF EXISTS profiles_select_admin ON profiles;
DROP POLICY IF EXISTS profiles_update_admin ON profiles;
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_own ON profiles;

-- 2. Recriar a função is_admin corretamente
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

-- 3. Criar políticas RLS corretas

-- Permitir que usuários vejam seu próprio perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Permitir que admins vejam todos os perfis
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (is_admin());

-- Permitir que usuários atualizem seu próprio perfil (exceto role e is_active)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid())
  );

-- Permitir que admins atualizem qualquer perfil
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (is_admin());

-- Permitir que novos usuários criem seu próprio perfil durante o registro
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Garantir que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Confirmar email de usuários criados manualmente (OPCIONAL - descomente se necessário)
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'seu-email@exemplo.com' AND email_confirmed_at IS NULL;

-- 6. Ativar perfis criados manualmente (OPCIONAL - descomente se necessário)
-- UPDATE profiles 
-- SET is_active = true 
-- WHERE email = 'seu-email@exemplo.com' AND is_active = false;

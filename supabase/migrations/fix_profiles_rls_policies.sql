-- =====================================================
-- FIX: Políticas RLS da tabela profiles
-- =====================================================
-- Este script corrige as políticas RLS para permitir que
-- usuários recém-registrados possam criar e acessar seus perfis
-- após confirmação de email
-- =====================================================

-- Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;

-- =====================================================
-- POLÍTICAS PARA USUÁRIOS COMUNS
-- =====================================================

-- Permitir que usuários autenticados criem seu próprio perfil
-- Isso é essencial para o processo de registro funcionar
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Permitir que usuários autenticados vejam seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Permitir que usuários autenticados atualizem seu próprio perfil
-- Mas não podem mudar o role (isso é controlado pelo WITH CHECK)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Usuários comuns não podem se promover a admin
  (role = 'client' OR role = (SELECT role FROM profiles WHERE id = auth.uid()))
);

-- =====================================================
-- POLÍTICAS PARA ADMINISTRADORES
-- =====================================================

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- Admins podem atualizar todos os perfis
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- Admins podem deletar perfis (soft delete via is_active)
CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- =====================================================
-- TRIGGER: Criar perfil automaticamente após registro
-- =====================================================

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger que executa após confirmação de email
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VERIFICAÇÃO: Garantir que RLS está habilitado
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON POLICY "Users can insert own profile" ON profiles IS 
'Permite que usuários autenticados criem seu próprio perfil após registro';

COMMENT ON POLICY "Users can view own profile" ON profiles IS 
'Permite que usuários vejam apenas seu próprio perfil';

COMMENT ON POLICY "Users can update own profile" ON profiles IS 
'Permite que usuários atualizem seu próprio perfil, mas não podem mudar o role';

COMMENT ON POLICY "Admins can view all profiles" ON profiles IS 
'Permite que administradores ativos vejam todos os perfis';

COMMENT ON POLICY "Admins can update all profiles" ON profiles IS 
'Permite que administradores ativos atualizem qualquer perfil';

COMMENT ON FUNCTION public.handle_new_user() IS 
'Cria automaticamente um perfil quando um novo usuário confirma o email';

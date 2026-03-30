-- =====================================================
-- CORRIGIR REGISTRO DO PORTAL
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. REMOVER TRIGGERS QUE CAUSAM ERRO
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.sync_contact_from_profile();

-- 2. ADICIONAR POLITICA PARA SERVICE ROLE CRIAR PROFILES
-- =====================================================
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

CREATE POLICY "Service role can insert profiles"
ON profiles FOR INSERT
WITH CHECK (true);

-- 3. ADICIONAR POLITICA PARA SERVICE ROLE CRIAR CONTACTS
-- =====================================================
DROP POLICY IF EXISTS "Service role can insert contacts" ON contacts;

CREATE POLICY "Service role can insert contacts"
ON contacts FOR INSERT
WITH CHECK (true);

-- 4. ADICIONAR POLITICA PARA USUARIOS CRIAREM SEUS PROPRIOS CONTACTS
-- =====================================================
DROP POLICY IF EXISTS "Users can create own contact" ON contacts;

CREATE POLICY "Users can create own contact"
ON contacts FOR INSERT
WITH CHECK (
  auth.uid() = id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

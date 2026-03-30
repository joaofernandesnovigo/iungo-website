-- Adicionar campos de branding
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- 1. Adicionar campo logo_url na tabela tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Adicionar campo avatar_url na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Criar bucket para logos da empresa (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('company-logos', 'company-logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- 4. Criar bucket para avatares de perfil (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-avatars', 'profile-avatars', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de acesso para company-logos
CREATE POLICY IF NOT EXISTS "Qualquer um pode ver logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

CREATE POLICY IF NOT EXISTS "Admin pode fazer upload de logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' 
  AND auth.uid() IN (
    SELECT id FROM profiles 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY IF NOT EXISTS "Admin pode atualizar logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-logos'
  AND auth.uid() IN (
    SELECT id FROM profiles 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY IF NOT EXISTS "Admin pode deletar logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-logos'
  AND auth.uid() IN (
    SELECT id FROM profiles 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- 6. Políticas de acesso para profile-avatars
CREATE POLICY IF NOT EXISTS "Qualquer um pode ver avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-avatars');

CREATE POLICY IF NOT EXISTS "Usuário pode fazer upload do próprio avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Usuário pode atualizar próprio avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Usuário pode deletar próprio avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

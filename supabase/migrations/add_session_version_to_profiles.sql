-- Adicionar campo session_version para controle de logout forçado
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS session_version INTEGER DEFAULT 1;

-- Adicionar comentário explicativo
COMMENT ON COLUMN profiles.session_version IS 'Versão da sessão - incrementada ao forçar logout em todos os dispositivos';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_session_version ON profiles(session_version);

-- Criar função para verificar se a sessão é válida
CREATE OR REPLACE FUNCTION is_session_valid()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica se existe um perfil ativo com a versão de sessão correta
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND status != 'inactive'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário
COMMENT ON FUNCTION is_session_valid IS 'Verifica se a sessão do usuário atual é válida e o perfil está ativo';

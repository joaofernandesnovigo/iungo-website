
-- ============================================
-- READDY HELPDESK - ROW LEVEL SECURITY (RLS)
-- ============================================
-- Execute este script no Supabase SQL Editor
-- para configurar todas as políticas de segurança

-- ============================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. FUNÇÃO AUXILIAR PARA VERIFICAR ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. POLÍTICAS PARA PROFILES
-- ============================================

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Admins podem atualizar qualquer perfil" ON profiles;
DROP POLICY IF EXISTS "Novos usuários podem criar perfil" ON profiles;

-- SELECT: Usuários veem seu próprio perfil
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- SELECT: Admins veem todos os perfis
CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING (is_admin());

-- INSERT: Novos usuários podem criar seu perfil
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Usuários podem atualizar seu próprio perfil
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- UPDATE: Admins podem atualizar qualquer perfil
CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (is_admin());

-- ============================================
-- 4. POLÍTICAS PARA TICKETS
-- ============================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Clientes veem apenas seus tickets" ON tickets;
DROP POLICY IF EXISTS "Clientes podem criar tickets" ON tickets;
DROP POLICY IF EXISTS "Admins podem atualizar tickets" ON tickets;
DROP POLICY IF EXISTS "Clientes podem atualizar seus tickets" ON tickets;

-- SELECT: Clientes veem apenas seus tickets
CREATE POLICY "tickets_select_client"
  ON tickets FOR SELECT
  USING (client_id = auth.uid());

-- SELECT: Admins veem todos os tickets
CREATE POLICY "tickets_select_admin"
  ON tickets FOR SELECT
  USING (is_admin());

-- INSERT: Clientes podem criar tickets
CREATE POLICY "tickets_insert_client"
  ON tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- UPDATE: Clientes podem atualizar seus próprios tickets
CREATE POLICY "tickets_update_client"
  ON tickets FOR UPDATE
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- UPDATE: Admins podem atualizar qualquer ticket
CREATE POLICY "tickets_update_admin"
  ON tickets FOR UPDATE
  USING (is_admin());

-- DELETE: Apenas admins podem deletar tickets
CREATE POLICY "tickets_delete_admin"
  ON tickets FOR DELETE
  USING (is_admin());

-- ============================================
-- 5. POLÍTICAS PARA TICKET_MESSAGES
-- ============================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários veem mensagens de seus tickets" ON ticket_messages;
DROP POLICY IF EXISTS "Clientes veem mensagens públicas de seus tickets" ON ticket_messages;
DROP POLICY IF EXISTS "Usuários podem criar mensagens" ON ticket_messages;
DROP POLICY IF EXISTS "Admins podem atualizar mensagens" ON ticket_messages;
DROP POLICY IF EXISTS "Admins podem deletar mensagens" ON ticket_messages;

-- SELECT: Admins veem TODAS as mensagens (incluindo internas)
CREATE POLICY "messages_select_admin"
  ON ticket_messages FOR SELECT
  USING (is_admin());

-- SELECT: Clientes veem apenas mensagens NÃO INTERNAS de seus tickets
CREATE POLICY "messages_select_client"
  ON ticket_messages FOR SELECT
  USING (
    is_internal = FALSE
    AND EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_messages.ticket_id
      AND tickets.client_id = auth.uid()
    )
  );

-- INSERT: Usuários podem criar mensagens em seus tickets
CREATE POLICY "messages_insert_own"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      -- Admin pode enviar em qualquer ticket
      is_admin()
      OR
      -- Cliente só pode enviar em seus tickets
      EXISTS (
        SELECT 1 FROM tickets
        WHERE tickets.id = ticket_messages.ticket_id
        AND tickets.client_id = auth.uid()
      )
    )
  );

-- UPDATE: Apenas admins podem atualizar mensagens
CREATE POLICY "messages_update_admin"
  ON ticket_messages FOR UPDATE
  USING (is_admin());

-- DELETE: Apenas admins podem deletar mensagens
CREATE POLICY "messages_delete_admin"
  ON ticket_messages FOR DELETE
  USING (is_admin());

-- ============================================
-- 6. POLÍTICAS PARA TICKET_HISTORY
-- ============================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins veem histórico completo" ON ticket_history;
DROP POLICY IF EXISTS "Clientes veem histórico de seus tickets" ON ticket_history;
DROP POLICY IF EXISTS "Sistema pode inserir histórico" ON ticket_history;

-- SELECT: Admins veem todo o histórico
CREATE POLICY "history_select_admin"
  ON ticket_history FOR SELECT
  USING (is_admin());

-- SELECT: Clientes veem histórico de seus tickets
CREATE POLICY "history_select_client"
  ON ticket_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_history.ticket_id
      AND tickets.client_id = auth.uid()
    )
  );

-- INSERT: Sistema pode inserir histórico (via trigger)
CREATE POLICY "history_insert_system"
  ON ticket_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 7. VERIFICAÇÃO FINAL
-- ============================================

-- Listar todas as políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
</file>

-- Migração: Sistema de Campos Personalizados por Categoria
-- Descrição: Permite que admins definam campos extras dinâmicos conforme o tipo/categoria do ticket

-- Tabela de categorias de tickets
CREATE TABLE IF NOT EXISTS ticket_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de campos personalizados
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES ticket_categories(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'select', 'date', 'checkbox')),
  options JSONB,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de valores dos campos personalizados
CREATE TABLE IF NOT EXISTS ticket_custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  custom_field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ticket_id, custom_field_id)
);

-- Adicionar coluna category_id na tabela tickets
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES ticket_categories(id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_custom_fields_category ON custom_fields(category_id);
CREATE INDEX IF NOT EXISTS idx_ticket_custom_values_ticket ON ticket_custom_field_values(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category_id);

-- Habilitar RLS
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_custom_field_values ENABLE ROW LEVEL SECURITY;

-- Políticas para ticket_categories
DROP POLICY IF EXISTS "Todos podem visualizar categorias ativas" ON ticket_categories;
CREATE POLICY "Todos podem visualizar categorias ativas" ON ticket_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins podem gerenciar categorias" ON ticket_categories;
CREATE POLICY "Admins podem gerenciar categorias" ON ticket_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Políticas para custom_fields
DROP POLICY IF EXISTS "Todos podem visualizar campos personalizados" ON custom_fields;
CREATE POLICY "Todos podem visualizar campos personalizados" ON custom_fields
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins podem gerenciar campos personalizados" ON custom_fields;
CREATE POLICY "Admins podem gerenciar campos personalizados" ON custom_fields
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Políticas para ticket_custom_field_values
DROP POLICY IF EXISTS "Usuários podem visualizar valores dos seus tickets" ON ticket_custom_field_values;
CREATE POLICY "Usuários podem visualizar valores dos seus tickets" ON ticket_custom_field_values
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = ticket_custom_field_values.ticket_id 
      AND (tickets.client_id = auth.uid() OR tickets.assigned_to = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Clientes podem inserir valores ao criar ticket" ON ticket_custom_field_values;
CREATE POLICY "Clientes podem inserir valores ao criar ticket" ON ticket_custom_field_values
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = ticket_custom_field_values.ticket_id 
      AND tickets.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins podem gerenciar todos os valores" ON ticket_custom_field_values;
CREATE POLICY "Admins podem gerenciar todos os valores" ON ticket_custom_field_values
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Inserir categorias padrão
INSERT INTO ticket_categories (name, description, icon) VALUES
  ('Bug', 'Problemas técnicos ou erros no sistema', 'ri-bug-line'),
  ('Dúvida', 'Perguntas e esclarecimentos', 'ri-question-line'),
  ('Solicitação', 'Pedidos de novos recursos ou melhorias', 'ri-lightbulb-line'),
  ('Financeiro', 'Questões relacionadas a pagamentos e cobranças', 'ri-money-dollar-circle-line'),
  ('Suporte Técnico', 'Assistência técnica geral', 'ri-tools-line')
ON CONFLICT (name) DO NOTHING;

-- Inserir alguns campos personalizados de exemplo
DO $$
DECLARE
  bug_category_id UUID;
  financial_category_id UUID;
BEGIN
  -- Buscar IDs das categorias
  SELECT id INTO bug_category_id FROM ticket_categories WHERE name = 'Bug';
  SELECT id INTO financial_category_id FROM ticket_categories WHERE name = 'Financeiro';

  -- Campos para categoria Bug
  IF bug_category_id IS NOT NULL THEN
    INSERT INTO custom_fields (category_id, field_name, field_type, is_required, display_order) VALUES
      (bug_category_id, 'Navegador', 'select', true, 1),
      (bug_category_id, 'Versão do Sistema', 'text', false, 2),
      (bug_category_id, 'Passos para Reproduzir', 'text', true, 3);
    
    -- Adicionar opções para o campo select
    UPDATE custom_fields 
    SET options = '["Chrome", "Firefox", "Safari", "Edge", "Outro"]'::jsonb
    WHERE category_id = bug_category_id AND field_name = 'Navegador';
  END IF;

  -- Campos para categoria Financeiro
  IF financial_category_id IS NOT NULL THEN
    INSERT INTO custom_fields (category_id, field_name, field_type, is_required, display_order) VALUES
      (financial_category_id, 'Número do Pedido', 'text', true, 1),
      (financial_category_id, 'Valor', 'number', false, 2),
      (financial_category_id, 'Data da Transação', 'date', false, 3),
      (financial_category_id, 'Reembolso Solicitado', 'checkbox', false, 4);
  END IF;
END $$;

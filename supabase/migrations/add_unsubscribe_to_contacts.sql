-- Adicionar colunas de opt-out na tabela contacts
-- Migração: add_unsubscribe_to_contacts.sql

-- Adicionar coluna unsubscribed (boolean)
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT false;

-- Adicionar coluna unsubscribed_at (timestamp)
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

-- Adicionar coluna unsubscribe_reason (motivo)
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS unsubscribe_reason TEXT;

-- Criar índice para performance em queries de campanhas
CREATE INDEX IF NOT EXISTS idx_contacts_unsubscribed 
ON contacts(tenant_id, unsubscribed) 
WHERE unsubscribed = false;

-- Comentários para documentação
COMMENT ON COLUMN contacts.unsubscribed IS 'Indica se o contato cancelou o recebimento de mensagens';
COMMENT ON COLUMN contacts.unsubscribed_at IS 'Data e hora em que o contato cancelou';
COMMENT ON COLUMN contacts.unsubscribe_reason IS 'Motivo do cancelamento (palavra-chave usada: PARE, STOP, SAIR)';

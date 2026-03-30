-- Remove o constraint conflitante que impede o status 'closed'
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_status_check;

-- Verifica se o constraint correto existe, se não, cria
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_ticket_status'
  ) THEN
    ALTER TABLE tickets ADD CONSTRAINT check_ticket_status 
    CHECK (status IN ('new', 'open', 'pending', 'resolved', 'closed'));
  END IF;
END $$;

-- Atualiza o constraint de prioridade para incluir 'urgent'
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_priority_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

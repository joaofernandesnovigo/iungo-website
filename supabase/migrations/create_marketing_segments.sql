-- Criar tabela marketing_segments
CREATE TABLE IF NOT EXISTS marketing_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB NOT NULL DEFAULT '[]'::jsonb,
  contact_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_segment_name_per_tenant UNIQUE (tenant_id, name)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_marketing_segments_tenant ON marketing_segments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_segments_created_by ON marketing_segments(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_segments_created_at ON marketing_segments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_segments_filters ON marketing_segments USING gin(filters);

-- Habilitar RLS
ALTER TABLE marketing_segments ENABLE ROW LEVEL SECURITY;

-- Política: Usuários veem apenas segmentos do seu tenant
CREATE POLICY marketing_segments_tenant_isolation ON marketing_segments
  FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  ));

-- Comentários
COMMENT ON TABLE marketing_segments IS 'Segmentos de audiência para campanhas de marketing';
COMMENT ON COLUMN marketing_segments.filters IS 'Filtros aplicados no formato JSON';
COMMENT ON COLUMN marketing_segments.contact_count IS 'Número de contatos que atendem aos filtros';

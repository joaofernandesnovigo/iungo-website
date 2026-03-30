import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { BackupLog } from '../types/backup.types';

export function useBackupLogs() {
  const [logs, setLogs] = useState<BackupLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('backup_logs')
        .select(`
          *,
          creator:profiles!backup_logs_created_by_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setLogs(data || []);
    } catch (err) {
      console.error('Erro ao buscar logs de backup:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, error, refetch: fetchLogs };
}

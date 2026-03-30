import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ExportModal } from '../../../components/backup/ExportModal';
import { BackupHistory } from '../../../components/backup/BackupHistory';
import { useBackupLogs } from '../../../hooks/useBackupLogs';
import { supabase } from '../../../lib/supabase';
import type { BackupFormat, BackupFilters } from '../../../types/backup.types';

export function BackupSection() {
  const [showExportModal, setShowExportModal] = useState(false);
  const { logs, loading, refetch } = useBackupLogs();
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: BackupFormat, filters: BackupFilters) => {
    try {
      setExporting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/backup-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ format, filters }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      // Download do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-tickets-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Atualizar histórico
      await refetch();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  const lastBackup = logs[0];

  return (
    <div className="space-y-6">
      {/* Card de Ações */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Backup e Exportação
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Exporte seus dados para backup ou análise externa
          </p>
        </div>

        <div className="p-6">
          {/* Último Backup */}
          {lastBackup && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-checkbox-circle-line text-purple-600"></i>
                    <span className="font-medium text-purple-900">
                      Último backup realizado
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {new Date(lastBackup.created_at).toLocaleString('pt-BR')} • 
                    {' '}{lastBackup.format.toUpperCase()} • 
                    {' '}{lastBackup.records_count || 0} tickets
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-purple-600 font-medium">
                    {lastBackup.creator?.full_name || 'Sistema'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-download-cloud-2-line text-xl text-purple-600"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Exportar Todos os Tickets
                  </h4>
                  <p className="text-sm text-gray-500">
                    Baixe todos os tickets com mensagens e histórico
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowExportModal(true)}
                disabled={exporting}
                className="w-full"
              >
                <i className="ri-file-download-line mr-2"></i>
                Exportar Agora
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-time-line text-xl text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Backup Automático
                  </h4>
                  <p className="text-sm text-gray-500">
                    Backup semanal automático (em breve)
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                disabled
                className="w-full"
              >
                <i className="ri-settings-3-line mr-2"></i>
                Configurar
              </Button>
            </div>
          </div>

          {/* Informações */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <i className="ri-information-line text-blue-600 text-xl flex-shrink-0"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Sobre os backups:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Backups são armazenados com segurança no Supabase Storage</li>
                  <li>Retenção automática de 30 dias</li>
                  <li>Formatos disponíveis: JSON (completo), CSV (planilha), PDF (relatório)</li>
                  <li>Você pode aplicar filtros por período, status e prioridade</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Histórico */}
      <BackupHistory logs={logs} loading={loading} />

      {/* Modal de Exportação */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
}

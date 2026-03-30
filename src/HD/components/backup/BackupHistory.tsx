import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import type { BackupLog } from '../../types/backup.types';

interface BackupHistoryProps {
  logs: BackupLog[];
  loading: boolean;
}

export function BackupHistory({ logs, loading }: BackupHistoryProps) {
  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="ri-file-list-3-line"
          title="Nenhum backup realizado"
          description="Quando você exportar dados, o histórico aparecerá aqui"
        />
      </Card>
    );
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json': return 'ri-file-code-line';
      case 'csv': return 'ri-file-excel-2-line';
      case 'pdf': return 'ri-file-pdf-line';
      default: return 'ri-file-line';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'failed': return 'Falhou';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Backups
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Últimos 50 backups realizados
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <i className={`${getFormatIcon(log.format)} text-xl text-purple-600`}></i>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      Backup {log.format.toUpperCase()}
                    </span>
                    <Badge variant={getStatusColor(log.status) as any}>
                      {getStatusLabel(log.status)}
                    </Badge>
                    {log.backup_type === 'automatic' && (
                      <Badge variant="default">
                        <i className="ri-time-line mr-1"></i>
                        Automático
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      <i className="ri-user-line mr-1"></i>
                      {log.creator?.full_name || 'Sistema'}
                    </span>
                    {log.records_count !== undefined && (
                      <span>
                        <i className="ri-file-list-line mr-1"></i>
                        {log.records_count} tickets
                      </span>
                    )}
                    {log.file_size && (
                      <span>
                        <i className="ri-hard-drive-line mr-1"></i>
                        {formatFileSize(log.file_size)}
                      </span>
                    )}
                  </div>

                  {log.error_message && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                      <i className="ri-error-warning-line mr-1"></i>
                      {log.error_message}
                    </div>
                  )}

                  {log.filters && Object.keys(log.filters).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {log.filters.startDate && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          De: {new Date(log.filters.startDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {log.filters.endDate && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Até: {new Date(log.filters.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {log.filters.status && log.filters.status.length > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Status: {log.filters.status.join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right ml-4 flex-shrink-0">
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(log.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

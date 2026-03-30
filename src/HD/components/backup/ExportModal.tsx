import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { BackupFormat, BackupFilters } from '../../types/backup.types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: BackupFormat, filters: BackupFilters) => Promise<void>;
  title?: string;
}

export function ExportModal({ isOpen, onClose, onExport, title = 'Exportar Tickets' }: ExportModalProps) {
  const [format, setFormat] = useState<BackupFormat>('json');
  const [filters, setFilters] = useState<BackupFilters>({});
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      await onExport(format, filters);
      onClose();
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormat('json');
    setFilters({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {/* Formato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato de Exportação
          </label>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value as BackupFormat)}
          >
            <option value="json">JSON (Completo)</option>
            <option value="csv">CSV (Planilha)</option>
            <option value="pdf">PDF (Relatório)</option>
          </Select>
          <p className="mt-1 text-xs text-gray-500">
            {format === 'json' && 'Inclui todos os dados: tickets, mensagens e histórico'}
            {format === 'csv' && 'Formato de planilha para análise em Excel'}
            {format === 'pdf' && 'Relatório formatado para impressão'}
          </p>
        </div>

        {/* Filtros */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Filtros (Opcional)</h3>
          
          <div className="space-y-4">
            {/* Período */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                multiple
                value={filters.status || []}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters({ ...filters, status: options });
                }}
                className="h-24"
              >
                <option value="new">Novo</option>
                <option value="open">Aberto</option>
                <option value="pending">Pendente</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Segure Ctrl/Cmd para selecionar múltiplos
              </p>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <Select
                multiple
                value={filters.priority || []}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters({ ...filters, priority: options });
                }}
                className="h-20"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </Select>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          {(filters.startDate || filters.endDate || filters.status?.length || filters.priority?.length) && (
            <button
              onClick={handleReset}
              className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <i className="ri-close-circle-line mr-1"></i>
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Exportando...
              </>
            ) : (
              <>
                <i className="ri-download-2-line mr-2"></i>
                Exportar
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

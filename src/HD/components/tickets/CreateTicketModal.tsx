
import { useState, useCallback, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { TicketPriority, Attachment } from '../../types/database.types';
import { FileUpload } from '../ui/FileUpload';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subject: string;
    description: string;
    priority: TicketPriority;
    category_id?: string;
    solution?: string;
    customFieldValues?: { field_id: string; value: string }[];
  }) => Promise<{ error: string | null }>;
}

const priorityOptions = [
  { value: 'low', label: 'Baixa - Pode aguardar' },
  { value: 'medium', label: 'Média - Precisa de atenção' },
  { value: 'high', label: 'Alta - Urgente' },
  { value: 'urgent', label: 'Urgente - Crítico' },
];

const solutionOptions = [
  { id: 'organizer', name: 'Organizer', icon: 'ri-folder-chart-line', color: 'bg-violet-500', description: 'Organização e gestão de dados' },
  { id: 'behavior', name: 'Behavior', icon: 'ri-line-chart-line', color: 'bg-amber-500', description: 'Análise comportamental' },
  { id: 'concierge', name: 'Concierge', icon: 'ri-customer-service-2-line', color: 'bg-slate-600', description: 'Atendimento personalizado' },
  { id: 'resolve', name: 'Resolve', icon: 'ri-shield-check-line', color: 'bg-emerald-500', description: 'Resolução de problemas' },
  { id: 'convert', name: 'Convert', icon: 'ri-exchange-funds-line', color: 'bg-sky-500', description: 'Conversão e vendas' },
  { id: 'attendant', name: 'Attendant', icon: 'ri-robot-line', color: 'bg-rose-500', description: 'Assistente virtual' },
];

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [selectedSolution, setSelectedSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const resetForm = useCallback(() => {
    setSubject('');
    setDescription('');
    setPriority('medium');
    setSelectedSolution('');
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação da solução
    if (!selectedSolution) {
      setError('Por favor, selecione qual solução está com problema');
      return;
    }

    // Validação
    if (!subject.trim()) {
      setError('Por favor, informe o assunto do chamado');
      return;
    }

    if (subject.trim().length < 5) {
      setError('O assunto deve ter pelo menos 5 caracteres');
      return;
    }

    if (!description.trim()) {
      setError('Por favor, descreva o problema');
      return;
    }

    if (description.trim().length < 20) {
      setError('A descrição deve ter pelo menos 20 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        solution: selectedSolution,
      });

      if (result.error) {
        setError(result.error);
      } else {
        handleClose();
      }
    } catch (err) {
      setError('Erro ao criar chamado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [subject, description, priority, selectedSolution, onSubmit, handleClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Chamado"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Erro */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2">
            <i className="ri-error-warning-line text-rose-500 mt-0.5"></i>
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Seleção de Solução */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qual solução está com problema? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {solutionOptions.map((solution) => {
              const isSelected = selectedSolution === solution.id;
              return (
                <button
                  key={solution.id}
                  type="button"
                  onClick={() => setSelectedSolution(solution.id)}
                  disabled={isSubmitting}
                  className={`
                    relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                    ${isSelected 
                      ? 'border-slate-700 bg-slate-50 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <i className="ri-checkbox-circle-fill text-slate-700 text-lg"></i>
                    </div>
                  )}
                  <div className={`w-12 h-12 ${solution.color} rounded-xl flex items-center justify-center mb-2`}>
                    <i className={`${solution.icon} text-white text-2xl`}></i>
                  </div>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                    {solution.name}
                  </span>
                  <span className="text-[10px] text-slate-400 text-center mt-0.5 leading-tight">
                    {solution.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assunto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assunto <span className="text-rose-500">*</span>
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Erro ao acessar o sistema"
            maxLength={200}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-400 mt-1">
            {subject.length}/200 caracteres
          </p>
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Prioridade
          </label>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            options={priorityOptions}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-400 mt-1">
            Selecione a urgência do seu problema
          </p>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Descrição do Problema <span className="text-rose-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            placeholder="Descreva detalhadamente o problema que você está enfrentando. Inclua passos para reproduzir, mensagens de erro, etc."
            rows={5}
            maxLength={500}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-400 mt-1">
            {description.length}/500 caracteres (mínimo 20)
          </p>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Anexos (opcional)
          </label>
          <FileUpload
            files={attachments}
            onFilesChange={setAttachments}
            maxFiles={10}
            maxSizeMB={10}
            disabled={isSubmitting}
          />
        </div>

        {/* Dicas */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-start gap-2">
            <i className="ri-lightbulb-line text-slate-600 mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-slate-800">Dicas para um bom chamado:</p>
              <ul className="text-xs text-slate-600 mt-1 space-y-0.5">
                <li>• Seja específico sobre o problema</li>
                <li>• Inclua passos para reproduzir o erro</li>
                <li>• Mencione quando o problema começou</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            <i className="ri-send-plane-line mr-1.5"></i>
            Enviar Chamado
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTicketModal;

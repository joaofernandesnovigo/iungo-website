import { useState, useRef, useEffect } from 'react';
import { FileUpload } from '../../../components/ui/FileUpload';
import type { Attachment } from '../../../types/database.types';

interface MessageInputProps {
  onSend: (message: string, isInternal?: boolean, attachments?: Attachment[]) => Promise<{ error: string | null }>;
  isSending: boolean;
  isAdmin: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  isSending,
  isAdmin,
  disabled = false,
  placeholder = 'Digite sua mensagem...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && attachments.length === 0) || isSending || disabled) return;

    setError(null);
    const result = await onSend(message.trim(), isInternal, attachments);
    
    if (result.error) {
      setError(result.error);
    } else {
      // Limpar tudo após envio bem-sucedido
      setMessage('');
      setIsInternal(false);
      setAttachments([]);
      setShowAttachments(false);
      setError(null); // Garantir que o erro seja limpo
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = message.trim() || attachments.length > 0;

  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      {/* Internal note toggle for admins */}
      {isAdmin && (
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setIsInternal(!isInternal)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isInternal
                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className={isInternal ? 'ri-lock-line' : 'ri-lock-unlock-line'}></i>
            {isInternal ? 'Nota interna (não visível ao cliente)' : 'Resposta pública'}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-3 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-xs text-rose-600 flex items-center gap-1.5">
            <i className="ri-error-warning-line"></i>
            {error}
          </p>
        </div>
      )}

      {/* Attachments section */}
      {showAttachments && (
        <div className="mb-3">
          <FileUpload
            files={attachments}
            onFilesChange={setAttachments}
            maxFiles={10}
            maxSizeMB={10}
            disabled={disabled || isSending}
          />
        </div>
      )}

      {/* Attached files preview (when collapsed) */}
      {!showAttachments && attachments.length > 0 && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
          <i className="ri-attachment-2 text-teal-600"></i>
          <span className="text-xs text-teal-700 font-medium">
            {attachments.length} arquivo{attachments.length > 1 ? 's' : ''} anexado{attachments.length > 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setShowAttachments(true)}
            className="ml-auto text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer whitespace-nowrap"
          >
            Ver/Editar
          </button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => setShowAttachments(!showAttachments)}
          disabled={disabled || isSending}
          className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            disabled || isSending
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : showAttachments || attachments.length > 0
              ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          title="Anexar arquivos"
        >
          <i className={`text-lg ${attachments.length > 0 ? 'ri-attachment-2' : 'ri-attachment-line'}`}></i>
          {attachments.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
              {attachments.length}
            </span>
          )}
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Este chamado está fechado' : placeholder}
            disabled={disabled || isSending}
            rows={1}
            maxLength={5000}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${
              isInternal ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <div className="absolute right-3 bottom-2 text-[10px] text-slate-400">
            {message.length}/5000
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSend || isSending || disabled}
          className={`flex items-center justify-center w-11 h-11 rounded-xl text-white transition-all cursor-pointer whitespace-nowrap ${
            !canSend || isSending || disabled
              ? 'bg-slate-300 cursor-not-allowed'
              : isInternal
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {isSending ? (
            <i className="ri-loader-4-line animate-spin text-lg"></i>
          ) : (
            <i className="ri-send-plane-2-fill text-lg"></i>
          )}
        </button>
      </form>

      {/* Helper text */}
      <p className="text-[10px] text-slate-400 mt-2 px-1">
        Pressione Enter para enviar ou Shift+Enter para nova linha • Clique em <i className="ri-attachment-line"></i> para anexar até 10 arquivos (máx. 50MB total)
      </p>
    </div>
  );
}

export default MessageInput;

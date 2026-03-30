import { useRef, useEffect } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { Spinner } from '../../../components/ui/Spinner';
import { FilePreview } from '../../../components/attachments/FilePreview';
import type { TicketMessageWithSender } from '../../../hooks/useTicketMessages';
import type { Attachment } from '../../../types/database.types';
import { formatDateTime } from '../../../lib/utils';

interface MessageListProps {
  messages: TicketMessageWithSender[];
  isLoading: boolean;
  currentUserId: string;
  ticketDescription?: string;
  ticketCreatedAt?: string;
  clientName?: string;
}

export function MessageList({
  messages,
  isLoading,
  currentUserId,
  ticketDescription,
  ticketCreatedAt,
  clientName,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-slate-500 mt-3 text-sm">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {/* Original ticket description as first message */}
      {ticketDescription && (
        <div className="flex gap-3">
          <Avatar name={clientName || 'Cliente'} size="sm" />
          <div className="flex-1 max-w-[85%]">
            <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {ticketDescription}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1.5 px-1">
              <span className="text-[11px] text-slate-400">
                {clientName || 'Cliente'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-400">
                {ticketCreatedAt ? formatDateTime(ticketCreatedAt) : ''}
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Descrição original
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;
        const isInternal = message.is_internal;
        const hasAttachments = message.attachments && message.attachments.length > 0;
        const allAttachments = message.attachments || [];

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
          >
            <Avatar
              name={message.sender?.full_name || 'Usuário'}
              src={message.sender?.avatar_url}
              size="sm"
            />
            <div className={`flex-1 max-w-[85%] ${isOwn ? 'flex flex-col items-end' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  isOwn
                    ? 'bg-teal-500 text-white rounded-tr-md'
                    : isInternal
                    ? 'bg-amber-50 border border-amber-200 rounded-tl-md'
                    : 'bg-slate-100 rounded-tl-md'
                }`}
              >
                {isInternal && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <i className="ri-lock-line text-amber-600 text-xs"></i>
                    <span className="text-[10px] font-medium text-amber-600 uppercase tracking-wide">
                      Nota interna
                    </span>
                  </div>
                )}
                
                {/* Message text */}
                {message.message && (
                  <p
                    className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      isOwn ? 'text-white' : isInternal ? 'text-amber-900' : 'text-slate-700'
                    }`}
                  >
                    {message.message}
                  </p>
                )}

                {/* Attachments */}
                {hasAttachments && (
                  <div className={`${message.message ? 'mt-3 pt-3 border-t' : ''} ${
                    isOwn ? 'border-white/20' : isInternal ? 'border-amber-200' : 'border-slate-200'
                  } space-y-2`}>
                    <div className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide ${
                      isOwn ? 'text-white/70' : isInternal ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      <i className="ri-attachment-2"></i>
                      <span>{allAttachments.length} anexo{allAttachments.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-2">
                      {allAttachments.map((attachment, idx) => (
                        <FilePreview
                          key={idx}
                          attachment={attachment}
                          allAttachments={allAttachments}
                          isOwn={isOwn}
                          showInline={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={`flex items-center gap-2 mt-1.5 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                <span className="text-[11px] text-slate-400">
                  {message.sender?.full_name || 'Usuário'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-400">
                  {formatDateTime(message.created_at)}
                </span>
                {message.sender?.role === 'admin' && !isOwn && (
                  <span className="text-[10px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                    Suporte
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {messages.length === 0 && !ticketDescription && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <i className="ri-chat-3-line text-3xl text-slate-400"></i>
            </div>
            <p className="text-slate-500 text-sm">Nenhuma mensagem ainda</p>
            <p className="text-slate-400 text-xs mt-1">Envie uma mensagem para iniciar a conversa</p>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;

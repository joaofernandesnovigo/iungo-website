import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TicketStatus, TicketPriority } from '../types/database.types';

// =====================================================
// UTILITÁRIOS DE ESTILO
// =====================================================

/**
 * Combina classes CSS com Tailwind de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =====================================================
// UTILITÁRIOS DE TEXTO
// =====================================================

/**
 * Extrai as iniciais de um nome
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(' ').filter(Boolean);
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Pega a primeira letra do primeiro e último nome
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// =====================================================
// CONFIGURAÇÕES DE CORES E LABELS PARA BADGES
// =====================================================

/**
 * Cores para badges de status
 */
export const statusColors: Record<TicketStatus, { bg: string; text: string; dot: string; border: string }> = {
  new: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
  },
  open: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200',
  },
  resolved: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    border: 'border-purple-200',
  },
  closed: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    dot: 'bg-slate-500',
    border: 'border-slate-200',
  },
};

/**
 * Cores para badges de prioridade
 */
export const priorityColors: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  low: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  medium: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  high: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  urgent: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

/**
 * Labels traduzidos para status
 */
export const statusLabels: Record<TicketStatus, string> = {
  new: 'Novo',
  open: 'Aberto',
  pending: 'Pendente',
  resolved: 'Resolvido',
  closed: 'Fechado',
};

/**
 * Labels traduzidos para prioridade
 */
export const priorityLabels: Record<TicketPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

/**
 * Ícones para status
 */
export const statusIcons: Record<TicketStatus, string> = {
  new: 'ri-file-add-line',
  open: 'ri-folder-open-line',
  pending: 'ri-time-line',
  resolved: 'ri-check-line',
  closed: 'ri-lock-line',
};

/**
 * Ícones para prioridade
 */
export const priorityIcons: Record<TicketPriority, string> = {
  low: 'ri-arrow-down-line',
  medium: 'ri-subtract-line',
  high: 'ri-arrow-up-line',
  urgent: 'ri-alarm-warning-line',
};

// =====================================================
// UTILITÁRIOS DE DATA
// =====================================================

/**
 * Formata data para exibição
 */
export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  return format(new Date(date), formatStr, { locale: ptBR });
}

/**
 * Formata data e hora para exibição
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return `ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  if (diffInDays < 7) {
    return `há ${diffInDays} dias`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;
  }

  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `há ${months} ${months > 1 ? 'meses' : 'mês'}`;
  }

  const years = Math.floor(diffInDays / 365);
  return `há ${years} ano${years > 1 ? 's' : ''}`;
}

// =====================================================
// UTILITÁRIOS DE TICKET
// =====================================================

/**
 * Retorna a cor do badge de status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    open: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-purple-100 text-purple-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Retorna a cor do badge de prioridade
 */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}

/**
 * Traduz status para português
 */
export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    new: 'Novo',
    open: 'Aberto',
    pending: 'Pendente',
    resolved: 'Resolvido',
    closed: 'Fechado',
  };
  return translations[status] || status;
}

/**
 * Traduz prioridade para português
 */
export function translatePriority(priority: string): string {
  const translations: Record<string, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente',
  };
  return translations[priority] || priority;
}

// =====================================================
// UTILITÁRIOS DE VALIDAÇÃO
// =====================================================

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// =====================================================
// UTILITÁRIOS DE FORMATAÇÃO
// =====================================================

/**
 * Formata telefone brasileiro
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Trunca texto com reticências
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Formata tamanho de arquivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// =====================================================
// UTILITÁRIOS DE ERRO
// =====================================================

/**
 * Extrai mensagem de erro amigável
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Ocorreu um erro desconhecido';
}

// =====================================================
// UTILITÁRIOS DE ARRAY
// =====================================================

/**
 * Agrupa array por chave
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicatas de array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// =====================================================
// UTILITÁRIOS DE DEBOUNCE
// =====================================================

/**
 * Debounce para otimizar buscas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

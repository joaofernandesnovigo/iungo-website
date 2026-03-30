export type BackupType = 'manual' | 'automatic';
export type BackupFormat = 'json' | 'csv' | 'pdf';
export type BackupStatus = 'pending' | 'completed' | 'failed';

export interface BackupFilters {
  startDate?: string;
  endDate?: string;
  status?: string[];
  priority?: string[];
  assignedTo?: string;
  category?: string;
}

export interface BackupLog {
  id: string;
  created_at: string;
  created_by: string;
  backup_type: BackupType;
  format: BackupFormat;
  file_size?: number;
  file_path?: string;
  filters?: BackupFilters;
  status: BackupStatus;
  error_message?: string;
  records_count?: number;
  creator?: {
    full_name: string;
    email: string;
  };
}

export interface ExportOptions {
  format: BackupFormat;
  filters?: BackupFilters;
  includeMessages?: boolean;
  includeHistory?: boolean;
  includeAttachments?: boolean;
}

export interface TicketExportData {
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  assigned_to?: string;
  category?: string;
  tags?: string[];
  messages?: Array<{
    content: string;
    created_at: string;
    sender_name: string;
    is_internal: boolean;
  }>;
  history?: Array<{
    change_type: string;
    old_value?: string;
    new_value?: string;
    changed_at: string;
    changed_by: string;
  }>;
}

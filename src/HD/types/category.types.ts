export interface TicketCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type FieldType = 'text' | 'number' | 'select' | 'date' | 'checkbox';

export interface CustomField {
  id: string;
  category_id: string;
  field_name: string;
  field_type: FieldType;
  options: string[] | null;
  is_required: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CustomFieldValue {
  id: string;
  ticket_id: string;
  custom_field_id: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface CustomFieldWithValue extends CustomField {
  value?: string;
}

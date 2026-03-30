import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import type { CustomField } from '../../types/category.types';

interface DynamicFieldRendererProps {
  fields: CustomField[];
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  disabled?: boolean;
}

export function DynamicFieldRenderer({
  fields,
  values,
  onChange,
  disabled = false,
}: DynamicFieldRendererProps) {
  if (fields.length === 0) {
    return null;
  }

  const renderField = (field: CustomField) => {
    const value = values[field.id] || '';

    switch (field.field_type) {
      case 'text':
        return field.field_name.toLowerCase().includes('passos') || 
               field.field_name.toLowerCase().includes('descrição') ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.is_required}
            disabled={disabled}
            rows={3}
            placeholder={`Digite ${field.field_name.toLowerCase()}`}
          />
        ) : (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.is_required}
            disabled={disabled}
            placeholder={`Digite ${field.field_name.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.is_required}
            disabled={disabled}
            placeholder={`Digite ${field.field_name.toLowerCase()}`}
            step="0.01"
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.is_required}
            disabled={disabled}
          >
            <option value="">Selecione uma opção</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.is_required}
            disabled={disabled}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={(e) => onChange(field.id, e.target.checked ? 'true' : 'false')}
              disabled={disabled}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.field_name}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-900">Campos Adicionais</h4>
      {fields.map((field) => (
        <div key={field.id}>
          {field.field_type !== 'checkbox' && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.field_name}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}

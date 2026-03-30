import { Select } from '../ui/Select';
import type { TicketCategory } from '../../types/category.types';

interface CategorySelectorProps {
  categories: TicketCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  required = false,
  disabled = false,
}: CategorySelectorProps) {
  const options = [
    { value: '', label: 'Selecione uma categoria' },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Categoria {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        required={required}
        disabled={disabled}
      />
      {value && categories.find(c => c.id === value)?.description && (
        <p className="mt-1 text-xs text-gray-500">
          {categories.find(c => c.id === value)?.description}
        </p>
      )}
    </div>
  );
}

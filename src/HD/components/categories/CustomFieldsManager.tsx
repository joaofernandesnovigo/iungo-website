import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { useTicketCategories } from '../../hooks/useTicketCategories';
import { useCustomFields } from '../../hooks/useCustomFields';
import type { FieldType } from '../../types/category.types';

const fieldTypeOptions = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'select', label: 'Lista de Opções' },
  { value: 'date', label: 'Data' },
  { value: 'checkbox', label: 'Checkbox' },
];

export function CustomFieldsManager() {
  const { categories } = useTicketCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const { fields, loading, createField, updateField, deleteField } = useCustomFields(selectedCategoryId);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    field_name: '',
    field_type: 'text' as FieldType,
    is_required: false,
    options: '',
  });

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fieldData = {
        category_id: selectedCategoryId,
        field_name: formData.field_name,
        field_type: formData.field_type,
        is_required: formData.is_required,
        options: formData.field_type === 'select' && formData.options
          ? formData.options.split(',').map(o => o.trim()).filter(Boolean)
          : null,
        display_order: fields.length,
      };

      if (editingId) {
        await updateField(editingId, fieldData);
        setEditingId(null);
      } else {
        await createField(fieldData);
        setIsCreating(false);
      }
      setFormData({ field_name: '', field_type: 'text', is_required: false, options: '' });
    } catch (error) {
      console.error('Erro ao salvar campo:', error);
    }
  };

  const handleEdit = (field: any) => {
    setEditingId(field.id);
    setFormData({
      field_name: field.field_name,
      field_type: field.field_type,
      is_required: field.is_required,
      options: field.options ? field.options.join(', ') : '',
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ field_name: '', field_type: 'text', is_required: false, options: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este campo?')) {
      try {
        await deleteField(id);
      } catch (error) {
        console.error('Erro ao excluir campo:', error);
      }
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="ri-folder-open-line text-4xl text-gray-300"></i>
        <p className="text-gray-500 mt-2">Crie categorias primeiro para adicionar campos personalizados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Campos Personalizados</h3>
        <p className="text-sm text-gray-500 mt-1">
          Adicione campos extras específicos para cada categoria de ticket
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione a Categoria
        </label>
        <Select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setIsCreating(false);
            setEditingId(null);
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      {selectedCategoryId && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {fields.length} campo(s) configurado(s)
            </p>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)} variant="primary" size="sm">
                <i className="ri-add-line mr-1.5"></i>
                Novo Campo
              </Button>
            )}
          </div>

          {isCreating && (
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  {editingId ? 'Editar Campo' : 'Novo Campo'}
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Campo <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.field_name}
                    onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                    placeholder="Ex: Navegador, Número do Pedido"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Campo <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.field_type}
                    onChange={(e) => setFormData({ ...formData, field_type: e.target.value as FieldType })}
                    required
                  >
                    {fieldTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {formData.field_type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opções (separadas por vírgula) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.options}
                      onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                      placeholder="Ex: Chrome, Firefox, Safari, Edge"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Digite as opções separadas por vírgula
                    </p>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_required"
                    checked={formData.is_required}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="is_required" className="ml-2 text-sm text-gray-700">
                    Campo obrigatório
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" variant="primary">
                    <i className="ri-save-line mr-1.5"></i>
                    {editingId ? 'Salvar Alterações' : 'Criar Campo'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-8">Carregando campos...</div>
          ) : fields.length > 0 ? (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{field.field_name}</h4>
                          {field.is_required && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              Obrigatório
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Tipo: {fieldTypeOptions.find(o => o.value === field.field_type)?.label}
                          {field.field_type === 'select' && field.options && (
                            <span className="ml-2">
                              • Opções: {field.options.join(', ')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(field)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(field.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : !isCreating && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <i className="ri-file-list-line text-4xl text-gray-300"></i>
              <p className="text-gray-500 mt-2">Nenhum campo configurado para esta categoria</p>
              <Button onClick={() => setIsCreating(true)} variant="primary" className="mt-4">
                <i className="ri-add-line mr-1.5"></i>
                Adicionar Primeiro Campo
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

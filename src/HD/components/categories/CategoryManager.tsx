import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { useTicketCategories } from '../../hooks/useTicketCategories';

const iconOptions = [
  'ri-bug-line',
  'ri-question-line',
  'ri-lightbulb-line',
  'ri-money-dollar-circle-line',
  'ri-tools-line',
  'ri-customer-service-line',
  'ri-settings-line',
  'ri-file-list-line',
  'ri-shield-check-line',
  'ri-rocket-line',
];

export function CategoryManager() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useTicketCategories();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'ri-file-list-line',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        setEditingId(null);
      } else {
        await createCategory({ ...formData, is_active: true });
        setIsCreating(false);
      }
      setFormData({ name: '', description: '', icon: 'ri-file-list-line' });
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'ri-file-list-line',
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', description: '', icon: 'ri-file-list-line' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Categorias de Tickets</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as categorias disponíveis para organizar os chamados
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} variant="primary">
            <i className="ri-add-line mr-1.5"></i>
            Nova Categoria
          </Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-medium text-gray-900">
              {editingId ? 'Editar Categoria' : 'Nova Categoria'}
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Bug, Dúvida, Solicitação"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrição da categoria"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-full h-12 flex items-center justify-center rounded-lg border-2 transition-all ${
                      formData.icon === icon
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${icon} text-xl ${formData.icon === icon ? 'text-teal-600' : 'text-gray-600'}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary">
                <i className="ri-save-line mr-1.5"></i>
                {editingId ? 'Salvar Alterações' : 'Criar Categoria'}
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                  <i className={`${category.icon} text-xl text-gray-700`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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

      {categories.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <i className="ri-folder-open-line text-4xl text-gray-300"></i>
          <p className="text-gray-500 mt-2">Nenhuma categoria cadastrada</p>
          <Button onClick={() => setIsCreating(true)} variant="primary" className="mt-4">
            <i className="ri-add-line mr-1.5"></i>
            Criar Primeira Categoria
          </Button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { TagBadge } from './TagBadge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Tag } from '../../types/tag.types';

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1',
];

export function TagManager() {
  const { tags, loading, createTag, updateTag, deleteTag } = useTags();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: PRESET_COLORS[0] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      await createTag(formData);
      setIsCreateModalOpen(false);
      setFormData({ name: '', color: PRESET_COLORS[0] });
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      alert('Erro ao criar tag. Verifique se o nome já não existe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingTag || !formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      await updateTag(editingTag.id, formData);
      setEditingTag(null);
      setFormData({ name: '', color: PRESET_COLORS[0] });
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      alert('Erro ao atualizar tag. Verifique se o nome já não existe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Tem certeza que deseja excluir a tag "${tag.name}"?`)) return;

    try {
      await deleteTag(tag.id);
    } catch (error) {
      console.error('Erro ao deletar tag:', error);
      alert('Erro ao deletar tag.');
    }
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingTag(null);
    setFormData({ name: '', color: PRESET_COLORS[0] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gerenciar Tags</h3>
          <p className="text-sm text-gray-600 mt-1">
            Crie e organize tags para categorizar seus tickets
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Nova Tag
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <TagBadge tag={tag} size="md" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditModal(tag)}
                className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                aria-label="Editar tag"
              >
                <i className="ri-edit-line"></i>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tag)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Excluir tag"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        ))}

        {tags.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <i className="ri-price-tag-3-line text-4xl mb-3 block"></i>
            <p>Nenhuma tag criada ainda</p>
            <p className="text-sm mt-1">Clique em "Nova Tag" para começar</p>
          </div>
        )}
      </div>

      {/* Modal de Criar/Editar */}
      <Modal
        isOpen={isCreateModalOpen || editingTag !== null}
        onClose={closeModals}
        title={editingTag ? 'Editar Tag' : 'Nova Tag'}
      >
        <div className="space-y-4">
          <Input
            label="Nome da Tag"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Urgente, Bug, Dúvida..."
            maxLength={50}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cor da Tag
            </label>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Cor ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="outline" onClick={closeModals} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={editingTag ? handleUpdate : handleCreate}
              disabled={!formData.name.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Salvando...' : editingTag ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

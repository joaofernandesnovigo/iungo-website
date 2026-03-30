import { useState, useRef, useEffect } from 'react';
import { useTags } from '../../hooks/useTags';
import { TagBadge } from './TagBadge';
import type { Tag } from '../../types/tag.types';

interface TagSelectorProps {
  selectedTags: Tag[];
  onAddTag: (tagId: string) => Promise<void>;
  onRemoveTag: (tagId: string) => Promise<void>;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1',
];

export function TagSelector({ selectedTags, onAddTag, onRemoveTag, disabled }: TagSelectorProps) {
  const { tags, createTag } = useTags();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTagIds = selectedTags.map((t) => t.id);
  const availableTags = tags.filter((tag) => !selectedTagIds.includes(tag.id));
  
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showCreateOption = searchQuery.trim() && 
    !tags.some((tag) => tag.name.toLowerCase() === searchQuery.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateTag = async () => {
    if (!searchQuery.trim()) return;

    try {
      const newTag = await createTag({
        name: searchQuery.trim(),
        color: newTagColor,
      });

      if (newTag) {
        await onAddTag(newTag.id);
        setSearchQuery('');
        setIsCreating(false);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={disabled ? undefined : () => onRemoveTag(tag.id)}
          />
        ))}
      </div>

      {!disabled && (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors"
          >
            <i className="ri-add-line"></i>
            Adicionar tag
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar ou criar tag..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto">
                {filteredTags.length > 0 ? (
                  <div className="p-2">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={async () => {
                          await onAddTag(tag.id);
                          setSearchQuery('');
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <TagBadge tag={tag} />
                      </button>
                    ))}
                  </div>
                ) : searchQuery && !showCreateOption ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    Nenhuma tag encontrada
                  </div>
                ) : null}

                {showCreateOption && (
                  <div className="p-3 border-t border-gray-200">
                    {!isCreating ? (
                      <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <i className="ri-add-line"></i>
                        Criar tag "{searchQuery}"
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Escolha uma cor:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setNewTagColor(color)}
                                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                                  newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                aria-label={`Cor ${color}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreating(false);
                              setSearchQuery('');
                            }}
                            className="flex-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateTag}
                            className="flex-1 px-3 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                          >
                            Criar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tag, CreateTagInput, UpdateTagInput } from '../types/tag.types';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setTags(data || []);
    } catch (err) {
      console.error('Erro ao buscar tags:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (input: CreateTagInput): Promise<Tag | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('tags')
        .insert([input])
        .select()
        .single();

      if (createError) throw createError;

      if (data) {
        setTags((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      }

      return data;
    } catch (err) {
      console.error('Erro ao criar tag:', err);
      throw err;
    }
  };

  const updateTag = async (id: string, input: UpdateTagInput): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('tags')
        .update(input)
        .eq('id', id);

      if (updateError) throw updateError;

      setTags((prev) =>
        prev.map((tag) =>
          tag.id === id ? { ...tag, ...input, updated_at: new Date().toISOString() } : tag
        ).sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      console.error('Erro ao atualizar tag:', err);
      throw err;
    }
  };

  const deleteTag = async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (err) {
      console.error('Erro ao deletar tag:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
}

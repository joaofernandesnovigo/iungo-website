import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TicketCategory } from '../types/category.types';

export function useTicketCategories() {
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('ticket_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (fetchError) throw fetchError;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (category: Omit<TicketCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('ticket_categories')
        .insert([category])
        .select()
        .single();

      if (createError) throw createError;
      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<TicketCategory>) => {
    try {
      const { error: updateError } = await supabase
        .from('ticket_categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchCategories();
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('ticket_categories')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchCategories();
    } catch (err) {
      console.error('Erro ao deletar categoria:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}

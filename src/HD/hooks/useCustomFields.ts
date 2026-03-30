import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CustomField, CustomFieldValue, CustomFieldWithValue } from '../types/category.types';

export function useCustomFields(categoryId?: string) {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = async () => {
    if (!categoryId) {
      setFields([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order');

      if (fetchError) throw fetchError;
      setFields(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar campos personalizados:', err);
      setError('Erro ao carregar campos personalizados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [categoryId]);

  const createField = async (field: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('custom_fields')
        .insert([field])
        .select()
        .single();

      if (createError) throw createError;
      await fetchFields();
      return data;
    } catch (err) {
      console.error('Erro ao criar campo:', err);
      throw err;
    }
  };

  const updateField = async (id: string, updates: Partial<CustomField>) => {
    try {
      const { error: updateError } = await supabase
        .from('custom_fields')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchFields();
    } catch (err) {
      console.error('Erro ao atualizar campo:', err);
      throw err;
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchFields();
    } catch (err) {
      console.error('Erro ao deletar campo:', err);
      throw err;
    }
  };

  return {
    fields,
    loading,
    error,
    createField,
    updateField,
    deleteField,
    refetch: fetchFields,
  };
}

export function useTicketCustomFieldValues(ticketId?: string) {
  const [values, setValues] = useState<CustomFieldValue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchValues = async () => {
    if (!ticketId) {
      setValues([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ticket_custom_field_values')
        .select('*')
        .eq('ticket_id', ticketId);

      if (error) throw error;
      setValues(data || []);
    } catch (err) {
      console.error('Erro ao buscar valores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
  }, [ticketId]);

  const saveValues = async (ticketId: string, fieldValues: { field_id: string; value: string }[]) => {
    try {
      const valuesToInsert = fieldValues.map(fv => ({
        ticket_id: ticketId,
        custom_field_id: fv.field_id,
        value: fv.value,
      }));

      const { error } = await supabase
        .from('ticket_custom_field_values')
        .upsert(valuesToInsert, { onConflict: 'ticket_id,custom_field_id' });

      if (error) throw error;
      await fetchValues();
    } catch (err) {
      console.error('Erro ao salvar valores:', err);
      throw err;
    }
  };

  return {
    values,
    loading,
    saveValues,
    refetch: fetchValues,
  };
}

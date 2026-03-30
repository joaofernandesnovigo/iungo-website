import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tag, TicketTag } from '../types/tag.types';

export function useTicketTags(ticketId: string | undefined) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketTags = async () => {
    if (!ticketId) {
      setTags([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('ticket_tags')
        .select('*, tag:tags(*)')
        .eq('ticket_id', ticketId);

      if (fetchError) throw fetchError;

      const ticketTags = (data || []) as (TicketTag & { tag: Tag })[];
      setTags(ticketTags.map((tt) => tt.tag).filter(Boolean));
    } catch (err) {
      console.error('Erro ao buscar tags do ticket:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar tags');
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (tagId: string): Promise<void> => {
    if (!ticketId) return;

    try {
      const { error: insertError } = await supabase
        .from('ticket_tags')
        .insert([{ ticket_id: ticketId, tag_id: tagId }]);

      if (insertError) throw insertError;

      // Buscar a tag adicionada
      const { data: tagData } = await supabase
        .from('tags')
        .select('*')
        .eq('id', tagId)
        .single();

      if (tagData) {
        setTags((prev) => [...prev, tagData]);
      }
    } catch (err) {
      console.error('Erro ao adicionar tag:', err);
      throw err;
    }
  };

  const removeTag = async (tagId: string): Promise<void> => {
    if (!ticketId) return;

    try {
      const { error: deleteError } = await supabase
        .from('ticket_tags')
        .delete()
        .eq('ticket_id', ticketId)
        .eq('tag_id', tagId);

      if (deleteError) throw deleteError;

      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
    } catch (err) {
      console.error('Erro ao remover tag:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTicketTags();
  }, [ticketId]);

  return {
    tags,
    loading,
    error,
    addTag,
    removeTag,
    refetch: fetchTicketTags,
  };
}

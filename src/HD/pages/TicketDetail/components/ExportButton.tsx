import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

interface ExportButtonProps {
  ticketId: string;
  ticketNumber: string;
}

export function ExportButton({ ticketId, ticketNumber }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setExporting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/export-ticket-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ticketId }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao exportar ticket');
      }

      const { html } = await response.json();

      // Criar um blob com o HTML e abrir em nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Aguardar o carregamento e imprimir
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar ticket. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setExporting(true);

      const { data: ticket, error } = await supabase
        .from('tickets')
        .select(`
          *,
          customer:profiles!tickets_customer_id_fkey(id, full_name, email),
          assigned:profiles!tickets_assigned_to_fkey(id, full_name, email),
          messages:ticket_messages(
            id, content, created_at, is_internal,
            sender:profiles(full_name, email)
          ),
          history:ticket_history(
            id, change_type, old_value, new_value, created_at,
            changed_by:profiles(full_name, email)
          )
        `)
        .eq('id', ticketId)
        .single();

      if (error) throw error;

      // Criar arquivo JSON
      const jsonData = JSON.stringify(ticket, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${ticketNumber}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar ticket. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="secondary"
        size="sm"
        disabled={exporting}
        className="whitespace-nowrap"
      >
        {exporting ? (
          <>
            <i className="ri-loader-4-line animate-spin mr-2"></i>
            Exportando...
          </>
        ) : (
          <>
            <i className="ri-download-2-line mr-2"></i>
            Exportar
          </>
        )}
      </Button>

      {/* Dropdown Menu */}
      {!exporting && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <button
            onClick={handleExportPDF}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg transition-colors"
          >
            <i className="ri-file-pdf-line text-red-600"></i>
            Exportar como PDF
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg transition-colors"
          >
            <i className="ri-file-code-line text-blue-600"></i>
            Exportar como JSON
          </button>
        </div>
      )}
    </div>
  );
}

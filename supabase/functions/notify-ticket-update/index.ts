import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
  schema: string;
}

interface TicketRecord {
  id: string;
  ticket_number: string;
  client_id: string;
  assigned_to: string | null;
  subject: string;
  status: string;
  priority: string;
}

interface MessageRecord {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal: boolean;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// Template de e-mail elegante
const generateEmailHTML = (
  type: "resolved" | "new_message" | "assigned" | "client_reply",
  data: {
    recipientName: string;
    clientName?: string;
    ticketNumber: string;
    ticketSubject: string;
    ticketPriority?: string;
    message?: string;
    senderName?: string;
    assignedBy?: string;
  }
) => {
  const baseUrl = Deno.env.get("SITE_URL") || "https://iungo.com.br";
  
  const priorityColors: Record<string, string> = {
    low: "#6B7280",
    medium: "#3B82F6",
    high: "#F59E0B",
    urgent: "#EF4444",
  };

  const priorityLabels: Record<string, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    urgent: "Urgente",
  };

  let headerColor = "#3B82F6";
  let headerText = "";
  let bodyContent = "";

  if (type === "resolved") {
    headerColor = "#10B981";
    headerText = "🎉 Seu chamado foi resolvido!";
    bodyContent = `
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Olá <strong>${data.recipientName}</strong>,
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Temos boas notícias! O seu chamado <strong>#${data.ticketNumber}</strong> foi marcado como <span style="color: #10B981; font-weight: bold;">Resolvido</span>.
      </p>
      <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #166534; font-weight: 600;">Assunto:</p>
        <p style="margin: 8px 0 0 0; color: #374151;">${data.ticketSubject}</p>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Se você ainda tiver dúvidas ou o problema persistir, basta responder a este e-mail ou acessar o portal de suporte.
      </p>
    `;
  } else if (type === "new_message") {
    headerColor = "#3B82F6";
    headerText = "💬 Nova resposta no seu chamado";
    bodyContent = `
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Olá <strong>${data.recipientName}</strong>,
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        <strong>${data.senderName}</strong> respondeu ao seu chamado <strong>#${data.ticketNumber}</strong>.
      </p>
      <div style="background: #F3F4F6; border-left: 4px solid #3B82F6; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #1F2937; font-weight: 600;">Mensagem:</p>
        <p style="margin: 8px 0 0 0; color: #374151; white-space: pre-wrap;">${data.message}</p>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Acesse o portal para visualizar a conversa completa e responder.
      </p>
    `;
  } else if (type === "assigned") {
    headerColor = "#8B5CF6";
    headerText = "📋 Novo chamado atribuído a você";
    const priorityColor = priorityColors[data.ticketPriority || "medium"] || "#3B82F6";
    const priorityLabel = priorityLabels[data.ticketPriority || "medium"] || "Média";
    
    bodyContent = `
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Olá <strong>${data.recipientName}</strong>,
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Um novo chamado foi atribuído a você${data.assignedBy ? ` por <strong>${data.assignedBy}</strong>` : ""}.
      </p>
      <div style="background: #F5F3FF; border-left: 4px solid #8B5CF6; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #6B7280; font-size: 14px;">Número:</td>
            <td style="padding: 4px 0; color: #1F2937; font-weight: 600;">#${data.ticketNumber}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6B7280; font-size: 14px;">Assunto:</td>
            <td style="padding: 4px 0; color: #1F2937;">${data.ticketSubject}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6B7280; font-size: 14px;">Cliente:</td>
            <td style="padding: 4px 0; color: #1F2937;">${data.clientName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6B7280; font-size: 14px;">Prioridade:</td>
            <td style="padding: 4px 0;">
              <span style="display: inline-block; background: ${priorityColor}20; color: ${priorityColor}; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                ${priorityLabel}
              </span>
            </td>
          </tr>
        </table>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Acesse o portal para visualizar os detalhes e responder ao cliente.
      </p>
    `;
  } else if (type === "client_reply") {
    headerColor = "#0EA5E9";
    headerText = "💬 Cliente respondeu ao chamado";
    bodyContent = `
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Olá <strong>${data.recipientName}</strong>,
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        <strong>${data.clientName}</strong> enviou uma nova mensagem no chamado <strong>#${data.ticketNumber}</strong>.
      </p>
      <div style="background: #F0F9FF; border-left: 4px solid #0EA5E9; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #075985; font-weight: 600;">Assunto do chamado:</p>
        <p style="margin: 8px 0 16px 0; color: #374151;">${data.ticketSubject}</p>
        <p style="margin: 0; color: #075985; font-weight: 600;">Mensagem do cliente:</p>
        <p style="margin: 8px 0 0 0; color: #374151; white-space: pre-wrap;">${data.message}</p>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Acesse o portal para visualizar a conversa completa e responder ao cliente.
      </p>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerText}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${headerColor} 0%, ${headerColor}DD 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                ${headerText}
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              ${bodyContent}
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${baseUrl}/hd/tickets/${data.ticketNumber}" 
                   style="display: inline-block; background: ${headerColor}; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Ver Chamado
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
                <strong>READDY Helpdesk</strong> - Sistema de Suporte Iungo
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                Este é um e-mail automático. Por favor, não responda diretamente.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Variáveis do Supabase não configuradas");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const payload: WebhookPayload = await req.json();

    console.log("📨 Webhook recebido:", payload.type, payload.table);

    let emailData: {
      to: string;
      subject: string;
      html: string;
    } | null = null;

    // ========================================
    // CASO 1: Ticket foi atualizado
    // ========================================
    if (payload.table === "tickets" && payload.type === "UPDATE") {
      const ticket = payload.record as unknown as TicketRecord;
      const oldTicket = payload.old_record as unknown as TicketRecord | null;

      // ----------------------------------------
      // CASO 1A: Ticket foi resolvido
      // ----------------------------------------
      if (ticket.status === "resolved" && oldTicket?.status !== "resolved") {
        console.log("🎉 Ticket resolvido:", ticket.ticket_number);

        // Busca dados do cliente
        const { data: client } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", ticket.client_id)
          .single();

        if (client) {
          emailData = {
            to: client.email,
            subject: `✅ Chamado #${ticket.ticket_number} Resolvido - ${ticket.subject}`,
            html: generateEmailHTML("resolved", {
              recipientName: client.full_name,
              ticketNumber: ticket.ticket_number,
              ticketSubject: ticket.subject,
            }),
          };
        }
      }

      // ----------------------------------------
      // CASO 1B: Ticket foi atribuído a alguém
      // ----------------------------------------
      if (
        ticket.assigned_to && 
        ticket.assigned_to !== oldTicket?.assigned_to
      ) {
        console.log("📋 Ticket atribuído:", ticket.ticket_number, "->", ticket.assigned_to);

        // Busca dados do novo responsável
        const { data: assignee } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", ticket.assigned_to)
          .single();

        // Busca dados do cliente
        const { data: client } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", ticket.client_id)
          .single();

        if (assignee) {
          console.log("📧 Enviando notificação de atribuição para:", assignee.email);

          emailData = {
            to: assignee.email,
            subject: `📋 Chamado #${ticket.ticket_number} atribuído a você - ${ticket.subject}`,
            html: generateEmailHTML("assigned", {
              recipientName: assignee.full_name,
              clientName: client?.full_name || "Cliente",
              ticketNumber: ticket.ticket_number,
              ticketSubject: ticket.subject,
              ticketPriority: ticket.priority,
            }),
          };
        }
      }
    }

    // ========================================
    // CASO 2: Nova mensagem pública postada
    // ========================================
    if (payload.table === "ticket_messages" && payload.type === "INSERT") {
      const message = payload.record as unknown as MessageRecord;

      // Ignora mensagens internas
      if (message.is_internal) {
        console.log("⏭️ Mensagem interna ignorada");
        return new Response(
          JSON.stringify({ success: true, skipped: "internal_message" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Busca dados do ticket
      const { data: ticket } = await supabase
        .from("tickets")
        .select("id, ticket_number, subject, client_id, assigned_to")
        .eq("id", message.ticket_id)
        .single();

      if (!ticket) {
        throw new Error("Ticket não encontrado");
      }

      // Busca dados do remetente
      const { data: sender } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", message.sender_id)
        .single();

      if (!sender) {
        throw new Error("Remetente não encontrado");
      }

      // ----------------------------------------
      // CASO 2A: Admin respondeu ao cliente
      // ----------------------------------------
      if (sender.role === "admin") {
        // Busca dados do cliente
        const { data: client } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", ticket.client_id)
          .single();

        if (client) {
          console.log("💬 Nova resposta do admin para:", client.email);

          emailData = {
            to: client.email,
            subject: `💬 Nova resposta no chamado #${ticket.ticket_number}`,
            html: generateEmailHTML("new_message", {
              recipientName: client.full_name,
              ticketNumber: ticket.ticket_number,
              ticketSubject: ticket.subject,
              message: message.message.substring(0, 500), // Limita tamanho
              senderName: sender.full_name,
            }),
          };
        }
      }

      // ----------------------------------------
      // CASO 2B: Cliente respondeu ao chamado
      // ----------------------------------------
      if (sender.role === "client") {
        console.log("💬 Cliente respondeu ao chamado:", ticket.ticket_number);

        let recipients: Profile[] = [];

        // Se há responsável atribuído, envia só para ele
        if (ticket.assigned_to) {
          const { data: assignee } = await supabase
            .from("profiles")
            .select("id, email, full_name, role")
            .eq("id", ticket.assigned_to)
            .eq("role", "admin")
            .single();

          if (assignee) {
            recipients = [assignee];
            console.log("📧 Enviando para responsável:", assignee.email);
          }
        }

        // Se não há responsável, envia para todos os admins ativos
        if (recipients.length === 0) {
          const { data: admins } = await supabase
            .from("profiles")
            .select("id, email, full_name, role")
            .eq("role", "admin")
            .eq("is_active", true);

          if (admins && admins.length > 0) {
            recipients = admins;
            console.log("📧 Enviando para todos os admins:", admins.length);
          }
        }

        // Envia e-mail para cada destinatário
        if (recipients.length > 0) {
          const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
          
          for (const recipient of recipients) {
            const html = generateEmailHTML("client_reply", {
              recipientName: recipient.full_name,
              clientName: sender.full_name,
              ticketNumber: ticket.ticket_number,
              ticketSubject: ticket.subject,
              message: message.message.substring(0, 500),
            });

            const resendResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: Deno.env.get("EMAIL_FROM") || "READDY Helpdesk <suporte@iungo.com.br>",
                to: recipient.email,
                subject: `💬 Cliente respondeu ao chamado #${ticket.ticket_number}`,
                html: html,
              }),
            });

            const resendResult = await resendResponse.json();

            if (resendResponse.ok) {
              console.log("✅ E-mail enviado para:", recipient.email, "ID:", resendResult.id);
            } else {
              console.error("❌ Erro ao enviar para:", recipient.email, resendResult);
            }
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              sent_count: recipients.length,
              recipients: recipients.map(r => r.email)
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // ========================================
    // ENVIA E-MAIL VIA RESEND
    // ========================================
    if (emailData) {
      console.log("📧 Enviando e-mail para:", emailData.to);

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: Deno.env.get("EMAIL_FROM") || "READDY Helpdesk <suporte@iungo.com.br>",
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
        }),
      });

      const resendResult = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error("❌ Erro Resend:", resendResult);
        throw new Error(`Resend error: ${JSON.stringify(resendResult)}`);
      }

      console.log("✅ E-mail enviado com sucesso:", resendResult.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          email_id: resendResult.id,
          sent_to: emailData.to 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Nenhuma ação necessária
    return new Response(
      JSON.stringify({ success: true, action: "none" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Erro na Edge Function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
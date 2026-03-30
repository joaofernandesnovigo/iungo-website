import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-client-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🚀 Iniciando create-admin-user...");

    // Verificar autenticação do usuário
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("❌ Token de autorização não encontrado");
      return new Response(
        JSON.stringify({ success: false, error: "Token de autorização obrigatório" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("🎯 Token extraído, validando...");

    // Criar cliente Supabase admin com service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 🔐 VALIDAÇÃO JWT CORRIGIDA - Usar getUser com o token do usuário
    console.log("🔍 Validando token JWT...");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError) {
      console.error("❌ Erro na validação do token:", authError.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Token inválido ou expirado",
          details: authError.message 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    if (!user) {
      console.error("❌ Usuário não encontrado no token");
      return new Response(
        JSON.stringify({ success: false, error: "Usuário não autenticado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    console.log("✅ Token válido - Usuário autenticado:", user.email);

    // Buscar perfil para verificar permissões
    console.log("🔍 Buscando perfil do usuário...");
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, tenant_id, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("❌ Erro ao buscar perfil:", profileError.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Perfil não encontrado",
          details: profileError.message 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    if (!profile) {
      console.error("❌ Perfil não existe");
      return new Response(
        JSON.stringify({ success: false, error: "Perfil não encontrado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    console.log("✅ Perfil encontrado:", profile.full_name, "- Role:", profile.role);

    // Verificar se é superadmin
    if (profile.role !== 'superadmin') {
      console.error("❌ Permissão negada - Role atual:", profile.role);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Apenas superadmins podem criar usuários",
          current_role: profile.role 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    console.log("✅ Usuário autorizado como superadmin");

    // Obter dados da requisição
    const { email, password, full_name, role = "agent", tenant_id } = await req.json();
    const finalTenantId = tenant_id || profile.tenant_id;

    console.log("📝 Dados recebidos:", { email, full_name, role, tenant_id: finalTenantId });

    // Validações
    if (!email || !password || !finalTenantId) {
      throw new Error("Email, senha e tenant_id são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("A senha deve ter no mínimo 6 caracteres");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Email inválido");
    }

    // Verificar se email já existe
    console.log("🔍 Verificando se email já existe...");
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    if (existingUsers?.users?.some(u => u.email === email)) {
      throw new Error("Este email já está cadastrado");
    }

    console.log("✅ Email disponível, criando usuário...");

    // Criar usuário
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || email.split("@")[0],
        role,
        tenant_id: finalTenantId,
      },
    });

    if (userError) {
      console.error("❌ Erro ao criar usuário:", userError.message);
      throw new Error(`Erro ao criar usuário: ${userError.message}`);
    }

    console.log("✅ Usuário criado no Auth:", userData.user.id);

    // Criar perfil
    console.log("📝 Criando perfil...");
    const { error: profileError2 } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userData.user.id,
        email,
        full_name: full_name || email.split("@")[0],
        role,
        tenant_id: finalTenantId,
        status: 'offline'
      });

    if (profileError2) {
      console.log("⚠️ Perfil já existe, tentando atualizar...");
      // Tentar atualizar se já existe
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          full_name: full_name || email.split("@")[0],
          role,
          tenant_id: finalTenantId,
        })
        .eq("id", userData.user.id);

      if (updateError) {
        console.error("❌ Erro ao atualizar perfil:", updateError.message);
        throw new Error(`Erro ao criar perfil: ${updateError.message}`);
      }
      console.log("✅ Perfil atualizado com sucesso");
    } else {
      console.log("✅ Perfil criado com sucesso");
    }

    console.log("🎉 Usuário criado com sucesso!");

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          full_name: full_name || email.split("@")[0],
          role,
          tenant_id: finalTenantId,
        },
        message: "Usuário criado com sucesso!",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
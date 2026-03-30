import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-client-type, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 🔐 Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autenticação não encontrado');
    }

    // 🛡️ Criar cliente com Service Role (admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 🔍 Verificar usuário que está fazendo a requisição
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // 🔍 Buscar perfil do usuário autenticado
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Perfil não encontrado');
    }

    // 🛡️ Verificar se é superadmin
    if (profile.role !== 'superadmin') {
      return new Response(
        JSON.stringify({ error: 'Apenas superadmins podem deletar usuários' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 📥 Obter dados da requisição
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('ID do usuário não fornecido');
    }

    // 🚫 Verificar se não está tentando deletar a si mesmo
    if (userId === user.id) {
      return new Response(
        JSON.stringify({ error: 'Você não pode deletar seu próprio usuário' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 🔍 Verificar se o usuário a ser deletado pertence ao mesmo tenant
    const { data: targetProfile, error: targetError } = await supabaseAdmin
      .from('profiles')
      .select('tenant_id')
      .eq('id', userId)
      .single();

    if (targetError || !targetProfile) {
      throw new Error('Usuário a ser deletado não encontrado');
    }

    if (targetProfile.tenant_id !== profile.tenant_id) {
      return new Response(
        JSON.stringify({ error: 'Você só pode deletar usuários do seu próprio tenant' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`🗑️ Deletando usuário ${userId} do tenant ${profile.tenant_id}`);

    // 🗑️ Deletar perfil do banco de dados
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
      .eq('tenant_id', profile.tenant_id);

    if (deleteProfileError) {
      console.error('❌ Erro ao deletar perfil:', deleteProfileError);
      throw new Error(`Erro ao deletar perfil: ${deleteProfileError.message}`);
    }

    // 🗑️ Deletar usuário do Auth (usando Service Role)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      console.error('⚠️ Erro ao deletar do Auth:', deleteAuthError);
      // Não falhar se não conseguir deletar do Auth, pois o perfil já foi removido
    }

    console.log(`✅ Usuário ${userId} deletado com sucesso`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Usuário deletado com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erro na Edge Function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao deletar usuário'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
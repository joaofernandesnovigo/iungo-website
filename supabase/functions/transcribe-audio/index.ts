/**
 * ============================================
 * EDGE FUNCTION: Transcribe Audio (Whisper)
 * ============================================
 * 
 * Transcreve arquivos de áudio usando OpenAI Whisper API.
 * Suporta múltiplos formatos: webm, mp3, wav, ogg, m4a.
 * 
 * 🔧 COMO USAR:
 * 
 * const formData = new FormData();
 * formData.append('audio', audioBlob, 'audio.webm');
 * 
 * const { data } = await supabase.functions.invoke('transcribe-audio', {
 *   body: formData
 * });
 * 
 * console.log(data.text); // Texto transcrito
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🎤 Iniciando transcrição de áudio...');

    // Validar API Key
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY não configurada');
      throw new Error('OpenAI API Key não configurada. Configure em Edge Functions > Manage secrets');
    }

    // Validar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    // Ler FormData
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile || !(audioFile instanceof File)) {
      throw new Error('Arquivo de áudio não fornecido');
    }

    console.log('📥 Arquivo recebido:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Validar tamanho (máximo 25MB - limite do Whisper)
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > MAX_SIZE) {
      throw new Error('Arquivo muito grande. Máximo: 25MB');
    }

    // Validar formato
    const validFormats = [
      'audio/webm',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/mp4',
    ];

    if (!validFormats.includes(audioFile.type) && !audioFile.name.match(/\.(webm|mp3|wav|ogg|m4a|mp4)$/i)) {
      throw new Error('Formato de áudio não suportado. Use: webm, mp3, wav, ogg, m4a');
    }

    console.log('🤖 Enviando para OpenAI Whisper...');

    // Criar FormData para OpenAI
    const openaiFormData = new FormData();
    openaiFormData.append('file', audioFile);
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', 'pt'); // Português (pode ser removido para detecção automática)
    openaiFormData.append('response_format', 'json');

    // Chamar OpenAI Whisper API
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ Erro da OpenAI:', errorData);
      throw new Error(errorData.error?.message || 'Erro ao transcrever áudio');
    }

    const transcription = await openaiResponse.json();

    console.log('✅ Transcrição concluída:', {
      length: transcription.text.length,
      preview: transcription.text.substring(0, 100) + '...',
    });

    // Retornar transcrição
    return new Response(
      JSON.stringify({
        success: true,
        text: transcription.text,
        language: transcription.language || 'pt',
        duration: transcription.duration,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Erro ao transcrever áudio:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao transcrever áudio',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

/**
 * ============================================
 * CUSTOS (OpenAI Whisper)
 * ============================================
 * 
 * Modelo: whisper-1
 * Preço: $0.006 por minuto de áudio
 * 
 * Exemplos:
 * - 1 minuto: $0.006
 * - 5 minutos: $0.030
 * - 10 minutos: $0.060
 * - 30 minutos: $0.180
 * 
 * Muito barato! 💰
 * 
 * ============================================
 * FORMATOS SUPORTADOS
 * ============================================
 * 
 * - webm (navegadores modernos)
 * - mp3 (universal)
 * - wav (alta qualidade)
 * - ogg (open source)
 * - m4a (Apple)
 * - mp4 (vídeo com áudio)
 * 
 * Tamanho máximo: 25MB
 * 
 * ============================================
 * IDIOMAS SUPORTADOS
 * ============================================
 * 
 * Whisper suporta 99+ idiomas, incluindo:
 * - Português (pt)
 * - Inglês (en)
 * - Espanhol (es)
 * - Francês (fr)
 * - Alemão (de)
 * - Italiano (it)
 * - Japonês (ja)
 * - Chinês (zh)
 * - E muitos outros...
 * 
 * Se não especificar o idioma, Whisper detecta automaticamente.
 */

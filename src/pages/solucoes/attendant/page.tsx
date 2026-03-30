import { useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';

export default function CustomerAttendantAIPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/59464763eff55aaabb6331e031ef74ea.png"
                alt="Attendant - Customer Care AI"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-iungo-navy">
                <strong>Attendant</strong>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl text-iungo-gray">
                A Solução Completa para Atendimento Transacional e Administrativo: Rapidez, Resolução e Satisfação
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Como o <strong>Attendant</strong> Funciona
            </h2>
          </div>
        </div>
      </section>

      {/* Visão Geral */}
      <section className="pt-0 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-iungo-navy mb-6">
                Agente Conversacional de Alto Volume e Baixa Complexidade
              </h2>
              <p className="text-lg text-iungo-gray mb-6">
                O <strong>Attendant</strong> é o agente conversacional de alto volume e baixa complexidade, focado em SAC (Serviço de Atendimento ao Consumidor). Ele lida com questões administrativas, transacionais e de rotina como "onde está meu pedido?" e "segunda via de boleto".
              </p>
              <p className="text-lg text-iungo-gray mb-8">
                Sua função é desafogar os canais de atendimento e garantir uma resolução imediata para o cliente, liberando os agentes humanos para interações de maior valor e complexidade.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-iungo-light-gray rounded-lg">
                  <div className="text-3xl font-bold text-iungo-navy mb-2">90%</div>
                  <div className="text-sm text-iungo-gray">Resolução Automática</div>
                </div>
                <div className="text-center p-4 bg-iungo-light-gray rounded-lg">
                  <div className="text-3xl font-bold text-iungo-navy mb-2">-60%</div>
                  <div className="text-sm text-iungo-gray">Tempo de Resposta</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=AI%20customer%20service%20chatbot%20interface%20showing%20conversation%20flow%2C%20modern%20chat%20interface%20with%20automated%20responses%2C%20customer%20support%20dashboard%20with%20real-time%20metrics%2C%20professional%20blue%20and%20white%20design%2C%20clean%20user%20interface&width=600&height=400&seq=customercare002&orientation=landscape"
                alt="Interface do Customer Attendant AI"
                className="rounded-lg shadow-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Principais Benefícios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Principais Benefícios do <strong>Attendant</strong>
            </h2>
          </div>
        </div>
      </section>

      {/* Funcionalidades Principais */}
      <section className="py-16 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-iungo-navy mb-4">
              Funcionalidades Avançadas
            </h2>
            <p className="text-lg text-iungo-gray max-w-3xl mx-auto">
              Tecnologias de ponta para automatizar e otimizar o atendimento ao cliente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-links-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Integração Transacional (Synapse)
              </h3>
              <p className="text-iungo-gray">
                Conexão robusta com ERPs e sistemas de logística para fornecer informações em tempo real sobre status de pedidos, rastreio e estoque.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-refresh-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Gestão de Processos de Devolução/Troca
              </h3>
              <p className="text-iungo-gray">
                Inicia e acompanha o processo de logística reversa de forma autônoma, seguindo as regras de negócio estabelecidas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-settings-3-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Self-Service Avançado
              </h3>
              <p className="text-iungo-gray">
                Oferece links diretos e widgets de autoatendimento dentro do chat para que o cliente resolva problemas comuns sem necessidade de agente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-search-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Resolução Automática de Consultas
              </h3>
              <p className="text-iungo-gray">
                Responde automaticamente às consultas mais frequentes com informações precisas e atualizadas em tempo real.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-heart-pulse-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Análise de Satisfação em Tempo Real
              </h3>
              <p className="text-iungo-gray">
                Coleta feedback e mede o NPS (Net Promoter Score) imediatamente após a resolução do chamado para melhoria contínua.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-customer-service-2-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Hand-off Inteligente
              </h3>
              <p className="text-iungo-gray">
                Transfere conversas complexas para agentes humanos com contexto completo e resumo da interação anterior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Automação Inteligente */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=Automated%20customer%20service%20workflow%20diagram%2C%20AI%20processing%20customer%20requests%2C%20integration%20with%20ERP%20systems%2C%20real-time%20data%20flow%20visualization%2C%20modern%20business%20process%20automation%2C%20professional%20corporate%20design&width=600&height=400&seq=customercare003&orientation=landscape"
                alt="Automação Inteligente de Atendimento"
                className="rounded-lg shadow-lg w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-iungo-navy mb-6">
                Automação Inteligente de Atendimento
              </h2>
              <p className="text-lg text-iungo-gray mb-6">
                A automação de tarefas repetitivas é o principal caso de uso de IA em Customer Service. O diferencial é nossa capacidade transacional, garantida pela integração com o Iungo Synapse.
              </p>
              <p className="text-lg text-iungo-gray mb-8">
                Nosso agente não apenas responde, mas executa ações como emitir segunda via de boleto, cancelar pedidos e iniciar processos de devolução nos sistemas do cliente, resultando em altíssima taxa de resolução L1 (First Contact Resolution).
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-iungo-navy/10 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-iungo-navy text-sm"></i>
                  </div>
                  <span className="text-iungo-gray">Execução de ações transacionais em tempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-iungo-navy/10 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-iungo-navy text-sm"></i>
                  </div>
                  <span className="text-iungo-gray">Integração nativa com sistemas legados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-iungo-navy/10 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-iungo-navy text-sm"></i>
                  </div>
                  <span className="text-iungo-gray">Alta taxa de resolução no primeiro contato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="py-16 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-iungo-navy mb-4">
              Casos de Uso do <strong>Attendant</strong>
            </h2>
            <p className="text-lg text-iungo-gray max-w-3xl mx-auto">
              Exemplos reais de como o <strong>Attendant</strong> transforma o atendimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-truck-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Consulta de Status de Pedidos
              </h3>
              <p className="text-iungo-gray text-sm">
                "Onde está seu pedido #12345?" - Resposta automática com código de rastreio e previsão de entrega em tempo real.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-file-text-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Segunda Via de Documentos
              </h3>
              <p className="text-iungo-gray text-sm">
                Emissão automática de segunda via de boletos, notas fiscais e comprovantes diretamente no chat.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-exchange-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Processos de Troca e Devolução
              </h3>
              <p className="text-iungo-gray text-sm">
                Iniciação automática de processos de logística reversa com geração de etiquetas e agendamento de coleta.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-bank-card-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Questões Financeiras
              </h3>
              <p className="text-iungo-gray text-sm">
                Consulta de faturas, alteração de vencimento, negociação de parcelamentos e confirmação de pagamentos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-close-circle-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Cancelamentos
              </h3>
              <p className="text-iungo-gray text-sm">
                Processamento automático de cancelamentos de pedidos, assinaturas e serviços com confirmação imediata.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-information-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Informações Gerais
              </h3>
              <p className="text-iungo-gray text-sm">
                Horários de funcionamento, políticas da empresa, informações de contato e direcionamentos diversos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados Comprovados */}
      <section className="py-16 bg-iungo-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Resultados Comprovados
            </h2>
            <p className="text-xl text-iungo-light-gray max-w-3xl mx-auto">
              Métricas reais de clientes que implementaram o Customer Attendant AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">90%</div>
              <div className="text-iungo-light-gray">Resolução Automática</div>
              <div className="text-sm text-iungo-light-gray mt-1">de chamados L1</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">-60%</div>
              <div className="text-iungo-light-gray">Tempo de Resposta</div>
              <div className="text-sm text-iungo-light-gray mt-1">médio de atendimento</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-iungo-light-gray">Satisfação do Cliente</div>
              <div className="text-sm text-iungo-light-gray mt-1">NPS médio</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-iungo-light-gray">Disponibilidade</div>
              <div className="text-sm text-iungo-light-gray mt-1">sem interrupções</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integração com Ecossistema */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-iungo-navy mb-4">
              Integração com Ecossistema iUngo
            </h2>
            <p className="text-lg text-iungo-gray max-w-3xl mx-auto">
              Potencialize o atendimento com a sinergia das soluções Iungo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-iungo-light-gray rounded-lg">
              <div className="w-16 h-16 bg-iungo-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-database-2-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                <strong>Behavior</strong>
              </h3>
              <p className="text-iungo-gray text-sm">
                Acesso ao histórico completo do cliente para atendimento contextualizado e personalizado.
              </p>
            </div>

            <div className="text-center p-6 bg-iungo-light-gray rounded-lg">
              <div className="w-16 h-16 bg-iungo-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-links-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                Iungo Synapse
              </h3>
              <p className="text-iungo-gray text-sm">
                Integração robusta com sistemas legados para execução de ações transacionais em tempo real.
              </p>
            </div>

            <div className="text-center p-6 bg-iungo-light-gray rounded-lg">
              <div className="w-16 h-16 bg-iungo-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-archive-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-lg font-semibold text-iungo-navy mb-3">
                <strong>Resolve</strong>
              </h3>
              <p className="text-iungo-gray text-sm">
                Base de conhecimento de produtos para responder dúvidas técnicas e comerciais com precisão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conectividade e Integrações */}
      <section className="py-16 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-iungo-navy mb-4">
              Resolução Imediata Integrada ao Serviço
            </h2>
            <p className="text-lg text-iungo-gray max-w-3xl mx-auto">
              O <strong>Attendant</strong> automatiza tarefas transacionais conectando-se às principais plataformas de engajamento e suporte ao cliente (CEC), garantindo uma experiência fluida.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-customer-service-2-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                CRM Customer Engagement Center
              </h3>
              <p className="text-iungo-gray">
                Transbordo humano inteligente e gestão unificada do histórico do cliente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-truck-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Sistemas de Logística
              </h3>
              <p className="text-iungo-gray">
                Rastreamento de pedidos em tempo real.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-links-line text-2xl text-iungo-navy"></i>
              </div>
              <h3 className="text-xl font-semibold text-iungo-navy mb-4">
                Integração com as Principais Soluções do Mercado
              </h3>
              <p className="text-iungo-gray">
                Salesforce, Microsoft, Oracle, ServiceNow e Zendesk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Pronto para Implementar o <strong>Attendant</strong>?
            </h2>
            <p className="text-xl text-iungo-gray mb-8 max-w-2xl mx-auto">
              Descubra como o <strong>Attendant</strong> pode transformar seu atendimento ao cliente 
              e otimizar suas operações de suporte
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-iungo-navy to-iungo-dark-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Transforme seu Atendimento com IA
          </h2>
          <p className="text-xl text-iungo-light-gray mb-8">
            Reduza custos operacionais, melhore a satisfação do cliente e libere sua equipe para atividades estratégicas
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-iungo-navy px-8 py-3 rounded-lg font-semibold hover:bg-iungo-light-gray transition-colors whitespace-nowrap">
              Agendar Demonstração
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-iungo-navy transition-colors whitespace-nowrap">
              Falar com Especialista
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


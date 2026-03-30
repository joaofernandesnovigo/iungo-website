import { useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { Link } from 'react-router-dom';

export default function TechnicalSupportAI() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: 'ri-search-line',
      title: 'RAG (Retrieval-Augmented Generation) Técnico',
      description: 'Utiliza a base de conhecimento canônica do Resolve (manuais, especificações, FAQs) para gerar respostas e soluções precisas e não alucinatórias.'
    },
    {
      icon: 'ri-emotion-line',
      title: 'Análise de Sentimento e Intenção',
      description: 'Identifica a frustração ou urgência do cliente para priorizar o atendimento ou fazer o hand-off (transferência) para um agente humano, fornecendo um resumo do problema.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Resolução Proativa',
      description: 'Monitora o uso do produto (via Iungo CDP) e inicia a conversa para resolver um potencial problema antes que o cliente o perceba.'
    },
    {
      icon: 'ri-ticket-line',
      title: 'Integração com Sistemas de Ticketing',
      description: 'Criação automática de tickets no Zendesk/ServiceNow, preenchendo os campos com o diagnóstico inicial da IA.'
    }
  ];

  const metrics = [
    { value: '95%', label: 'Resolução L1/L2 Automática' },
    { value: '-70%', label: 'Redução no Tempo de Resolução' },
    { value: '+85%', label: 'Satisfação do Cliente' },
    { value: '24/7', label: 'Disponibilidade Contínua' }
  ];

  const useCases = [
    {
      title: 'Diagnóstico Técnico Inteligente',
      description: 'Cliente relata problema com produto. A IA acessa o histórico de compras, consulta o manual técnico e fornece diagnóstico preciso com passos de solução.',
      result: 'Resolução em 2 minutos vs 20 minutos do atendimento tradicional'
    },
    {
      title: 'Suporte Proativo',
      description: 'Sistema detecta padrão de uso anômalo e inicia conversa preventiva, oferecendo dicas de otimização antes que problemas ocorram.',
      result: '60% redução em tickets de suporte reativo'
    },
    {
      title: 'Escalação Inteligente',
      description: 'IA identifica problema complexo, cria ticket detalhado com diagnóstico inicial e transfere para especialista humano com contexto completo.',
      result: '80% mais eficiência na resolução por especialistas'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/5ca71b521dd13199853fb6fe3a684dad.png"
                alt="Resolve - Agente de Suporte Técnico IA"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-iungo-navy">
                <strong>Resolve</strong>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl text-iungo-gray">
                O Agente de Suporte L1/L2 que Diagnostica e Resolve Problemas Técnicos com Conhecimento Profundo do Produto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
                Como o <strong>Resolve</strong> Funciona
              </h2>
              <p className="text-lg text-iungo-gray mb-6">
                O <strong>Resolve</strong> é um agente conversacional (chat/voz) de alta complexidade, focado em diagnóstico e resolução de problemas técnicos (L1/L2). Ele transcende os chatbots tradicionais ao utilizar a Inteligência Semântica (Product Cloud) como base de conhecimento técnico e a Inteligência Comportamental (Customer Cloud) para contextualizar o histórico do cliente.
              </p>
              <p className="text-lg text-iungo-gray mb-8">
                A IA Generativa permite que ele não apenas responda, mas crie planos de solução personalizados e acione sistemas legados (via Iungo Synapse) para abrir chamados ou consultar manuais.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-iungo-navy mb-2">{metric.value}</div>
                    <div className="text-sm text-iungo-gray">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20technical%20support%20AI%20system%20interface%20displaying%20intelligent%20diagnostic%20tools%2C%20customer%20sentiment%20analysis%2C%20automated%20ticket%20creation%2C%20knowledge%20base%20integration%2C%20and%20real-time%20problem%20resolution%20workflows%20with%20orange%20and%20red%20accent%20colors%2C%20modern%20support%20dashboard%20design&width=600&height=500&seq=technical-support-overview&orientation=landscape"
                alt="Resolve Overview"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Principais Benefícios do <strong>Resolve</strong>
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Tecnologias avançadas que revolucionam o suporte técnico através de inteligência artificial especializada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                  <i className={`${feature.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-iungo-navy mb-4">{feature.title}</h3>
                <p className="text-iungo-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Casos de Uso do <strong>Resolve</strong>
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Veja como o <strong>Resolve</strong> transforma o atendimento técnico na prática
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-iungo-light-gray to-white rounded-lg p-8 border border-iungo-light-gray">
                <h3 className="text-xl font-bold text-iungo-navy mb-4">{useCase.title}</h3>
                <p className="text-iungo-gray mb-6">{useCase.description}</p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-iungo-navy">
                  <p className="text-sm font-semibold text-iungo-navy">Resultado:</p>
                  <p className="text-sm text-iungo-gray">{useCase.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="py-20 bg-iungo-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Inteligência de Domínio Especializada
              </h2>
              <p className="text-lg text-iungo-light-gray mb-6">
                A IA Generativa está transformando o atendimento ao cliente, movendo-se de simples respostas para a resolução de ponta a ponta. O diferencial do <strong>Resolve</strong> é sua inteligência de domínio, garantida pela integração com o <strong>Organize</strong>.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-light-gray text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Conhecimento Técnico Profundo</h4>
                    <p className="text-iungo-light-gray">Especialista no produto através da integração com o <strong>Organize</strong></p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-light-gray text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Resolução End-to-End</h4>
                    <p className="text-iungo-light-gray">Vai além de respostas simples para resolver problemas complexos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-light-gray text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Contexto Comportamental</h4>
                    <p className="text-iungo-light-gray">Utiliza histórico do cliente para personalizar o atendimento</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Advanced%20technical%20support%20AI%20system%20showing%20deep%20product%20knowledge%20integration%2C%20end-to-end%20problem%20resolution%20workflows%2C%20behavioral%20context%20analysis%2C%20and%20specialized%20domain%20intelligence%20with%20dark%20background%20and%20orange%20accent%20lighting%2C%20professional%20technical%20environment&width=600&height=500&seq=technical-excellence&orientation=landscape"
                alt="Technical Excellence"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Diagnóstico Preciso Integrado ao Seu Back-Office
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              O <strong>Resolve</strong> vai além da conversa, acessando os sistemas de gestão de serviços de TI (ITSM) 
              para entender, documentar e solucionar problemas na raiz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-customer-service-2-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                ITSM &amp; Service Desk
              </h3>
              <p className="text-iungo-gray">
                Abertura, consulta e atualização automática de incidentes técnicos e requisições de serviço.
              </p>
            </div>
            
            <div className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-book-open-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Gestão de Conhecimento
              </h3>
              <p className="text-iungo-gray">
                Leitura de bases de conhecimento técnicas (Confluence, SharePoint).
              </p>
            </div>
            
            <div className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-global-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Integração com as Principais Soluções do Mercado
              </h3>
              <p className="text-iungo-gray">
                Integrado com soluções: ServiceNow, Atlassian (Jira), BMC, Ivanti e ManageEngine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-iungo-navy to-iungo-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Implementar o <strong>Resolve</strong>?
          </h2>
          <p className="text-xl text-iungo-gray mb-8 max-w-2xl mx-auto">
            Descubra como o <strong>Resolve</strong> pode revolucionar seu suporte técnico 
            e melhorar a experiência dos seus clientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="bg-white text-iungo-navy hover:bg-iungo-light-gray">
              Agendar Demonstração
            </Button>
            <Link to="/contato">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-iungo-navy">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

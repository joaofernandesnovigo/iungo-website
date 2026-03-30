import { useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import { Link } from 'react-router-dom';

export default function Plataforma() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Iungo AI Platform - 12 Módulos de Inteligência Artificial | Iungo Intelligence';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Conheça os 12 módulos técnicos da Iungo AI Platform: conectores nativos, motores de conversação, interfaces de voz e muito mais para transformar seu comércio digital.');
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwarePlatform",
      "name": "Iungo AI Platform",
      "description": "Plataforma de inteligência artificial com 12 módulos especializados para comércio digital",
      "url": `${import.meta.env.VITE_SITE_URL || "https://example.com"}/plataforma`,
      "provider": {
        "@type": "Organization",
        "name": "Iungo Intelligence",
        "url": import.meta.env.VITE_SITE_URL || "https://example.com"
      },
      "applicationCategory": "Artificial Intelligence Platform",
      "operatingSystem": "Cloud-based",
      "offers": {
        "@type": "Offer",
        "name": "Iungo AI Platform",
        "description": "Plataforma completa de IA para comércio digital",
        "seller": {
          "@type": "Organization",
          "name": "Iungo Intelligence"
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const moduleCategories = [
    {
      title: 'Conectores e Integrações',
      description: 'Módulos especializados em conectar e sincronizar dados de diferentes plataformas',
      color: 'from-iungo-navy to-iungo-dark-gray',
      modules: [
        {
          id: 'whatsapp-connector',
          title: 'WhatsApp Connector',
          description: 'Comunicação conversacional bidirecional na plataforma WhatsApp Business com integração nativa à API da Meta.',
          icon: 'ri-whatsapp-line',
          features: ['Integração API Meta', 'Persistência de Sessões', 'Mensagens Transacionais', 'Mensagens Comportamentais']
        },
        {
          id: 'vtex-connector',
          title: 'VTEX Native Connector',
          description: 'Integração certificada e em tempo real com a plataforma VTEX para sincronização completa de dados.',
          icon: 'ri-store-3-line',
          features: ['Sincronização em Tempo Real', 'Catálogo Automático', 'Eventos de Usuário', 'Gestão de Estoque']
        },
        {
          id: 'shopify-connector',
          title: 'Shopify Native Connector',
          description: 'Conector nativo para APIs do Shopify com ingestão em tempo real de dados de carrinho e pedidos.',
          icon: 'ri-shopping-bag-3-line',
          features: ['APIs Nativas', 'Dados em Tempo Real', 'Sincronização Automática', 'Eventos de Carrinho']
        },
        {
          id: 'ecommerce-connector',
          title: 'E-Commerce Extensibility Connector',
          description: 'Framework flexível para integrar qualquer sistema de e-commerce com harmonização de taxonomia por IA.',
          icon: 'ri-links-line',
          features: ['Framework Flexível', 'Harmonização IA', 'Sistemas Proprietários', 'Padronização Automática']
        }
      ]
    },
    {
      title: 'Canais de Comunicação',
      description: 'Motores especializados para diferentes canais de comunicação com clientes',
      color: 'from-iungo-gray to-iungo-navy',
      modules: [
        {
          id: 'email-delivery',
          title: 'Email Delivery & Reading',
          description: 'Motor de mensageria de alta performance para e-mail com hiperpersonalização em tempo real.',
          icon: 'ri-mail-line',
          features: ['Alta Performance', 'Hiperpersonalização', 'Conteúdo Dinâmico', 'Interpretação de Respostas']
        },
        {
          id: 'sms-gateway',
          title: 'SMS Gateway',
          description: 'Gateway de alta velocidade para SMS com baixa latência, agnóstico de operadora e multi-região.',
          icon: 'ri-message-3-line',
          features: ['Baixa Latência', 'Multi-região', 'Filas Inteligentes', 'Rastreamento de Entrega']
        },
        {
          id: 'voice-interface',
          title: 'Voice Interface',
          description: 'Comunicação por voz com STT, TTS e memória contextual para interações fluidas e humanas.',
          icon: 'ri-mic-line',
          features: ['Speech-to-Text', 'Text-to-Speech', 'Memória Contextual', 'Interação Natural']
        }
      ]
    },
    {
      title: 'Inteligência e Processamento',
      description: 'Motores de IA avançados para conversação, análise comportamental e processamento de eventos',
      color: 'from-iungo-dark-gray to-iungo-gray',
      modules: [
        {
          id: 'conversation-engine',
          title: 'Goal-Oriented Conversation Engine',
          description: 'Cérebro central de conversação com diálogo dinâmico, predição de intenção e reinforcement learning.',
          icon: 'ri-brain-line',
          features: ['Diálogo Dinâmico', 'Predição de Intenção', 'Reinforcement Learning', 'Conversas Adaptativas']
        },
        {
          id: 'behavior-graph',
          title: 'Behavior Graph',
          description: 'Banco de dados em grafo para modelar relações complexas entre clientes, produtos e eventos.',
          icon: 'ri-node-tree',
          features: ['Banco em Grafo', 'Mapeamento de Afinidades', 'Tempo Real', 'Base Cognitiva']
        },
        {
          id: 'event-fabric',
          title: 'Event Fabric',
          description: 'Sistema nervoso da plataforma com malha de eventos de alta performance para streaming em tempo real.',
          icon: 'ri-pulse-line',
          features: ['Event Mesh', 'Streaming Tempo Real', 'Baixa Latência', 'Alta Escalabilidade']
        }
      ]
    },
    {
      title: 'Integrações Empresariais',
      description: 'Conectores para sistemas empresariais e ferramentas de gestão',
      color: 'from-iungo-navy to-iungo-light-navy',
      modules: [
        {
          id: 'crm-embedding',
          title: 'CRM Embedding',
          description: 'Middleware para embarcar insights da plataforma em CRMs externos como Salesforce e HubSpot.',
          icon: 'ri-customer-service-2-line',
          features: ['Middleware Inteligente', 'Insights Embarcados', 'CRMs Externos', 'Perfil Comportamental']
        },
        {
          id: 'erp-integration',
          title: 'ERP Integration',
          description: 'Integração de back-office para sincronizar dados financeiros, logísticos e de estoque com ERPs.',
          icon: 'ri-building-line',
          features: ['Back-office', 'Dados Financeiros', 'Gestão Logística', 'Visão Completa']
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div>
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/fca30cd9297428afedef683310f155b2.png"
                alt="Iungo AI Platform - Arquitetura Modular"
                className="w-full rounded-xl shadow-2xl object-cover"
              />
            </div>
            
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-iungo-navy mb-6">
                Iungo AI Platform
              </h1>
              <p className="text-xl md:text-2xl text-iungo-gray mb-8">
                12 Módulos Especializados que Formam a Arquitetura Mais Avançada 
                de Inteligência Artificial para Comércio Digital
              </p>
              <p className="text-lg text-iungo-gray">
                Nossa plataforma é composta por módulos técnicos fundamentais que trabalham 
                em sinergia para criar a experiência de comércio digital mais avançada do mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Engines Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-4">
              Três Motores de Inteligência
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Nossa plataforma é alimentada por três tipos distintos de inteligência artificial, 
              trabalhando em sinergia para otimizar cada aspecto do seu comércio digital
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-iungo-light-gray hover:border-iungo-accent">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-brain-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">Inteligência Semântica</h3>
              <p className="text-iungo-gray">Compreensão profunda de produtos e conteúdo através de processamento de linguagem natural avançado</p>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-iungo-light-gray hover:border-iungo-accent">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-pulse-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">Inteligência Comportamental</h3>
              <p className="text-iungo-gray">Análise preditiva de comportamento do cliente baseada em dados históricos e padrões em tempo real</p>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-iungo-light-gray hover:border-iungo-accent">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-brain-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">Inteligência de Abordagem</h3>
              <p className="text-iungo-gray">Orquestração inteligente de jornadas personalizadas para maximizar conversão e engajamento</p>
            </article>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Arquitetura Modular Inteligente
            </h2>
            <p className="text-xl text-iungo-gray max-w-4xl mx-auto">
              A Iungo AI Platform é composta por 12 módulos técnicos fundamentais que trabalham 
              em sinergia para criar a experiência de comércio digital mais avançada do mercado. 
              Cada módulo é especializado e pode ser implementado de forma independente ou integrada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-4">
                <i className="ri-puzzle-line text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-iungo-navy mb-2">12 Módulos</h3>
              <p className="text-iungo-gray text-sm">Componentes especializados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-4">
                <i className="ri-links-line text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-iungo-navy mb-2">Integração Total</h3>
              <p className="text-iungo-gray text-sm">Conectores nativos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-4">
                <i className="ri-time-line text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-iungo-navy mb-2">Tempo Real</h3>
              <p className="text-iungo-gray text-sm">Processamento instantâneo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-4">
                <i className="ri-rocket-line text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-iungo-navy mb-2">Escalabilidade</h3>
              <p className="text-iungo-gray text-sm">Arquitetura cloud-native</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules by Category */}
      {moduleCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} className={`py-20 ${categoryIndex % 2 === 0 ? 'bg-iungo-light-gray' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} text-white mb-6`}>
                <i className="ri-cpu-line text-2xl"></i>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-4">
                {category.title}
              </h2>
              <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
                {category.description}
              </p>
            </div>

            <div className={`grid grid-cols-1 ${category.modules.length === 2 ? 'md:grid-cols-2' : category.modules.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-8`}>
              {category.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-r ${category.color} rounded-lg text-white mb-6`}>
                    <i className={`${module.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-iungo-navy mb-4">
                    {module.title}
                  </h3>
                  <p className="text-iungo-gray mb-6">
                    {module.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-iungo-navy text-sm mb-3">Principais Recursos:</h4>
                    {module.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-4 h-4 flex items-center justify-center mr-2">
                          <i className="ri-check-line text-iungo-dark-gray text-sm"></i>
                        </div>
                        <span className="text-iungo-gray text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Technical Architecture */}
      <section className="py-20 bg-gradient-to-br from-iungo-navy to-iungo-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Arquitetura Técnica Avançada
              </h2>
              <p className="text-lg text-iungo-light-gray mb-8">
                A Iungo AI Platform foi projetada com uma arquitetura modular e escalável, 
                onde cada módulo opera de forma independente mas integrada, garantindo 
                máxima flexibilidade e performance.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Event-Driven Architecture</h4>
                    <p className="text-iungo-light-gray">Comunicação assíncrona entre módulos via Event Fabric</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Cloud-Native Design</h4>
                    <p className="text-iungo-light-gray">Escalabilidade automática e alta disponibilidade</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">API-First Approach</h4>
                    <p className="text-iungo-light-gray">Integração facilitada com qualquer sistema existente</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/9ebbb08ac0da2d1379f477659c5f24ad.jpeg"
                alt="Arquitetura da Plataforma"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
            Pronto para Implementar a Iungo AI Platform?
          </h2>
          <p className="text-xl text-iungo-gray mb-8 max-w-2xl mx-auto">
            Descubra como nossa arquitetura modular pode ser personalizada 
            para atender às necessidades específicas do seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agendamento">
              <Button variant="primary" size="lg" className="whitespace-nowrap">
                Agendar Demonstração Técnica
              </Button>
            </Link>
            <Link to="/contato">
              <Button variant="outline" size="lg" className="whitespace-nowrap">
                Falar com Arquiteto de Soluções
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

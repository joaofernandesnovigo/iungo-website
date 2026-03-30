import { useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import { Link } from 'react-router-dom';

export default function Solucoes() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Soluções de IA - Iungo Intelligence | Inteligência Artificial para Comércio Digital';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Descubra as soluções de inteligência artificial da Iungo Intelligence: Organizer, Behavior, Concierge, Resolve, Convert e Attendant. Transforme seu comércio digital com IA avançada.');
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Soluções de Inteligência Artificial para Comércio Digital",
      "description": "Seis soluções especializadas de IA: Organizer, Behavior, Concierge, Resolve, Convert e Attendant",
      "url": `${import.meta.env.VITE_SITE_URL || "https://example.com"}/solucoes`,
      "provider": {
        "@type": "Organization",
        "name": "Iungo Intelligence",
        "url": import.meta.env.VITE_SITE_URL || "https://example.com"
      },
      "serviceType": "Artificial Intelligence Solutions",
      "areaServed": "BR",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Catálogo de Soluções de IA",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Organizer - Curadoria de Catálogo IA",
              "description": "Unifique, enriqueça e otimize seus SKUs com inteligência semântica"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Behavior - Customer Data Platform",
              "description": "Visão unificada e preditiva do cliente em tempo real"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Concierge - Journey Orchestrator",
              "description": "Orquestração hiperpersonalizada com gatilhos comportamentais"
            }
          }
        ]
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

  const solutions = [
    {
      id: 'organizer',
      title: '<strong>Organizer</strong>',
      slogan: 'A Curadoria de Catálogo 100% IA: Unifique, Enriqueça e Otimize Seus SKUs para Qualquer Canal',
      description: 'Transforme o caos de SKUs em catálogos organizados e enriquecidos através da Inteligência Semântica. Nossa solução utiliza processamento de linguagem natural avançado para classificar, enriquecer e otimizar automaticamente seus produtos.',
      features: [
        'Enriquecimento Generativo de Conteúdo',
        'Classificação Multimodal Automática',
        'Auditoria de Qualidade de Dados',
        'Sincronização Multi-canal',
        'Detecção de Produtos Duplicados'
      ],
      icon: 'ri-database-2-line',
      color: 'from-iungo-navy to-iungo-dark-gray',
      image: 'https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/aa06dc6f9d84043bb57e1e5fa4d95266.png'
    },
    {
      id: 'customer-data-platform',
      title: '<strong>Behavior</strong>',
      slogan: 'A Visão Unificada e Preditiva do Cliente. O CDP que Transforma Dados em Propensão de Compra em Tempo Real',
      description: 'Crie uma visão 360° do cliente através da Inteligência Comportamental. Nossa plataforma unifica dados de múltiplas fontes e gera insights preditivos para maximizar conversões e lifetime value.',
      features: [
        'Matching de Identidade em Tempo Real',
        'Segmentação Preditiva Avançada',
        'Conformidade LGPD/GDPR by Design',
        'Análise de Propensão de Compra',
        'Perfil Unificado 360°'
      ],
      icon: 'ri-user-3-line',
      color: 'from-iungo-gray to-iungo-navy',
      image: 'https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/211c40d7654d400f5f5a6f8a6c2cb0c7.png'
    },
    {
      id: 'concierge',
      title: '<strong>Concierge</strong>',
      slogan: 'Orquestração Hiperpersonalizada: Otimize a Jornada do Cliente com Gatilhos Comportamentais em Tempo Real',
      description: 'Automatize e personalize cada ponto de contato através da Inteligência de Abordagem. Nossa solução orquestra jornadas dinâmicas baseadas em comportamento em tempo real para maximizar engajamento e conversão.',
      features: [
        'Orquestração Orientada por ML',
        'Teste A/B/n Automático',
        'Personalização de Conteúdo Dinâmico (DCO)',
        'Gatilhos Comportamentais Inteligentes',
        'Otimização Multi-canal'
      ],
      icon: 'ri-route-line',
      color: 'from-iungo-dark-gray to-iungo-gray',
      image: 'https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/e8af69da78bb2f48bccc510d7216a5fb.png'
    },
    {
      id: 'technical-support-ai',
      title: '<strong>Resolve</strong>',
      slogan: 'O Agente de Suporte L1/L2 que Diagnostica e Resolve Problemas Técnicos com Conhecimento Profundo do Produto',
      description: 'Revolucione seu suporte técnico com um agente conversacional inteligente que compreende profundamente seus produtos e resolve problemas complexos automaticamente.',
      features: [
        'RAG (Retrieval-Augmented Generation) Técnico',
        'Análise de Sentimento em Tempo Real',
        'Integração com Sistemas de Ticketing',
        'Diagnóstico Automático de Problemas',
        'Escalação Inteligente'
      ],
      icon: 'ri-customer-service-2-line',
      color: 'from-iungo-navy to-iungo-light-navy',
      image: 'https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/5ca71b521dd13199853fb6fe3a684dad.png'
    },
    {
      id: 'convert',
      title: '<strong>Convert</strong>',
      slogan: 'O Vendedor IA 24/7 que Identifica Leads Quentes e Converte Oportunidades com Abordagem Hiperpersonalizada',
      description: 'Potencialize suas vendas com um agente inteligente que qualifica leads, conduz negociações e fecha vendas automaticamente, trabalhando 24 horas por dia.',
      features: [
        'Qualificação de Leads Preditiva',
        'Negociação e Quebra de Objeções',
        'Fechamento de Vendas Automático',
        'Geração de Links de Pagamento',
        'CRM Integration Nativa'
      ],
      icon: 'ri-money-dollar-circle-line',
      color: 'from-iungo-gray to-iungo-dark-navy',
      image: 'https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/1971e567389aa402b3abd53fb11c211b.png'
    },
    {
      id: 'attendant',
      title: '<strong>Attendant</strong>',
      slogan: 'A Solução Completa para Atendimento Transacional e Administrativo: Rapidez, Resolução e Satisfação',
      description: 'Transforme seu atendimento ao cliente com uma solução completa que resolve questões transacionais e administrativas com eficiência e satisfação máxima.',
      features: [
        'Integração Transacional (Synapse)',
        'Gestão de Processos de Devolução/Troça',
        'Self-Service Avançado',
        'Resolução Automática de Consultas',
        'Análise de Satisfação em Tempo Real'
      ],
      icon: 'ri-chat-3-line',
      color: 'from-iungo-dark-gray to-iungo-navy',
      image: 'https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/59464763eff55aaabb6331e031ef74ea.png'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-iungo-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nossas Soluções
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-iungo-light-gray">
              Seis soluções especializadas que transformam cada aspecto do seu comércio digital 
              através de inteligência artificial avançada
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {solutions.map((solution, index) => (
              <div key={solution.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r ${solution.color} text-white mb-4`}>
                      <i className={`${solution.icon} text-2xl`}></i>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-4">
                      <span dangerouslySetInnerHTML={{ __html: solution.title }} />
                    </h2>
                    <p className={`text-lg font-semibold bg-gradient-to-r ${solution.color} bg-clip-text text-transparent mb-6`}>
                      {solution.slogan}
                    </p>
                    <p className="text-lg text-iungo-gray mb-8">
                      {solution.description}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-iungo-navy mb-4">Principais Funcionalidades:</h3>
                    <ul className="space-y-3">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <div className="w-5 h-5 flex items-center justify-center mr-3">
                            <i className="ri-check-line text-iungo-dark-gray text-lg"></i>
                          </div>
                          <span className="text-iungo-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={`/solucoes/${solution.id}`}>
                    <Button variant="primary" size="lg">
                      Saiba Mais
                    </Button>
                  </Link>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <img 
                    src={solution.image}
                    alt={solution.title}
                    className="rounded-lg shadow-xl object-cover w-full h-80 lg:h-96"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
            Pronto para Implementar Nossas Soluções?
          </h2>
          <p className="text-xl text-iungo-gray mb-8 max-w-2xl mx-auto">
            Descubra como nossas soluções podem ser personalizadas para atender 
            às necessidades específicas do seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Agendar Demonstração
            </Button>
            <Link to="/contato">
              <Button variant="outline" size="lg">
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


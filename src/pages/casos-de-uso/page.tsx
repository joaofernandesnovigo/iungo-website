import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function CasosDeUso() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Casos de Sucesso - Iungo Intelligence | Resultados Comprovados em IA';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Descubra casos de sucesso reais da Iungo Intelligence: 300% de aumento em conversão, 500% em leads qualificados e muito mais. Resultados comprovados em IA para comércio digital.');
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Casos de Sucesso - Iungo Intelligence",
      "description": "Casos de sucesso e resultados comprovados de clientes da Iungo Intelligence",
      "url": `${import.meta.env.VITE_SITE_URL || "https://example.com"}/casos-de-uso`,
      "mainEntity": {
        "@type": "ItemList",
        "name": "Casos de Sucesso",
        "itemListElement": [
          {
            "@type": "CaseStudy",
            "name": "E-commerce Fashion: 300% de Aumento em Conversão",
            "description": "ModaStyle Brasil aumentou conversão em 300% com Iungo AI Platform"
          },
          {
            "@type": "CaseStudy", 
            "name": "Marketplace B2B: Automação Completa de Vendas",
            "description": "TechSupply Pro automatizou vendas com 500% de aumento em leads qualificados"
          },
          {
            "@type": "CaseStudy",
            "name": "Varejo Omnichannel: Unificação de Experiência", 
            "description": "MegaStore Nacional unificou experiência com 60% de aumento na retenção"
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

  const cases = [
    {
      title: 'E-commerce Fashion: 300% de Aumento em Conversão',
      company: 'ModaStyle Brasil',
      industry: 'Moda e Vestuário',
      challenge: 'Catálogo desorganizado com 50.000+ SKUs, baixa taxa de conversão e experiência de compra fragmentada.',
      solution: 'Implementação completa da Iungo AI Platform com foco em Resolve, CDP e Journey Orchestrator.',
      results: [
        '300% de aumento na taxa de conversão',
        '85% de redução no tempo de catalogação',
        '250% de aumento no ticket médio',
        '40% de redução no CAC (Custo de Aquisição de Cliente)'
      ],
      image: 'https://readdy.ai/api/search-image?query=Modern%20fashion%20e-commerce%20interface%20showing%20organized%20product%20catalog%20with%20AI-powered%20recommendations%2C%20clean%20product%20cards%20with%20automated%20tagging%2C%20personalized%20customer%20journey%20visualization%2C%20and%20conversion%20analytics%20dashboard%2C%20featuring%20elegant%20clothing%20items%20and%20sophisticated%20user%20experience%20design&width=600&height=400&seq=fashion-ecommerce&orientation=landscape',
      testimonial: 'A Iungo AI transformou completamente nossa operação. Nossos clientes agora encontram exatamente o que procuram, e nossa equipe economiza horas de trabalho manual.',
      author: 'Maria Silva, CEO ModaStyle Brasil'
    },
    {
      title: 'Marketplace B2B: Automação Completa de Vendas',
      company: 'TechSupply Pro',
      industry: 'Tecnologia B2B',
      challenge: 'Processo de vendas manual, leads não qualificados e suporte técnico sobrecarregado.',
      solution: 'Implementação de Sales AI, Technical Support AI e **Attendant** para automação completa.',
      results: [
        '500% de aumento em leads qualificados',
        '70% de redução no tempo de resposta',
        '90% de resolução automática no suporte',
        '180% de crescimento em receita'
      ],
      image: 'https://readdy.ai/api/search-image?query=Professional%20B2B%20marketplace%20interface%20displaying%20automated%20sales%20workflows%2C%20AI-powered%20lead%20qualification%20system%2C%20technical%20support%20chatbot%20interactions%2C%20and%20comprehensive%20analytics%20dashboard%2C%20with%20modern%20business%20technology%20products%20and%20clean%20corporate%20design&width=600&height=400&seq=b2b-marketplace&orientation=landscape',
      testimonial: 'Nossa equipe de vendas agora foca apenas em fechar negócios. A IA cuida de toda a qualificação e suporte inicial.',
      author: 'Roberto Santos, Diretor Comercial TechSupply Pro'
    },
    {
      title: 'Varejo Omnichannel: Unificação de Experiência',
      company: 'MegaStore Nacional',
      industry: 'Varejo Omnichannel',
      challenge: 'Dados fragmentados entre canais, experiência inconsistente e baixa retenção de clientes.',
      solution: 'CDP completo com Journey Orchestrator para unificar experiência online e offline.',
      results: [
        '60% de aumento na retenção de clientes',
        '45% de melhoria no NPS',
        '200% de aumento em vendas cruzadas',
        '35% de redução no churn'
      ],
      image: 'https://readdy.ai/api/search-image?query=Omnichannel%20retail%20experience%20visualization%20showing%20unified%20customer%20data%20across%20online%20and%20offline%20touchpoints%2C%20integrated%20shopping%20journey%20with%20mobile%20app%2C%20website%2C%20and%20physical%20store%20interactions%2C%20real-time%20personalization%20and%20customer%20analytics%20dashboard&width=600&height=400&seq=omnichannel-retail&orientation=landscape',
      testimonial: 'Agora conhecemos nossos clientes de verdade. A jornada é fluida entre todos os canais, e os resultados falam por si.',
      author: 'Ana Costa, CMO MegaStore Nacional'
    },
    {
      title: 'SaaS Enterprise: Otimização de Customer Success',
      company: 'CloudTech Solutions',
      industry: 'Software Enterprise',
      challenge: 'Alto churn de clientes, suporte reativo e dificuldade em identificar oportunidades de upsell.',
      solution: '**Attendant** integrado com análise preditiva para customer success proativo.',
      results: [
        '50% de redução no churn',
        '300% de aumento em upsells',
        '80% de melhoria na satisfação',
        '120% de crescimento no LTV'
      ],
      image: 'https://readdy.ai/api/search-image?query=Enterprise%20SaaS%20customer%20success%20dashboard%20showing%20predictive%20analytics%20for%20churn%20prevention%2C%20automated%20customer%20care%20workflows%2C%20upsell%20opportunity%20identification%2C%20and%20comprehensive%20customer%20health%20scoring%20system%2C%20with%20modern%20software%20interface%20design&width=600&height=400&seq=saas-enterprise&orientation=landscape',
      testimonial: 'A IA nos permite ser proativos com nossos clientes. Identificamos problemas antes mesmo deles perceberem.',
      author: 'Carlos Mendes, VP Customer Success CloudTech'
    }
  ];

  const metrics = [
    { value: '500+', label: 'Clientes Ativos' },
    { value: '300%', label: 'Aumento Médio em Conversão' },
    { value: '85%', label: 'Redução em Tempo de Processo' },
    { value: '99.9%', label: 'Uptime da Plataforma' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-iungo-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Casos de Sucesso
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-iungo-light-gray">
              Descubra como empresas líderes transformaram seus resultados 
              com nossas soluções de inteligência artificial
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {metrics.map((metric, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-iungo-navy mb-2">{metric.value}</div>
                <div className="text-iungo-gray">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {cases.map((caseStudy, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 bg-iungo-navy/10 text-iungo-navy text-sm font-medium rounded-full mb-4">
                        {caseStudy.industry}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-iungo-navy mb-4">
                        {caseStudy.title}
                      </h2>
                      <p className="text-lg text-iungo-gray mb-6">
                        <strong>Desafio:</strong> {caseStudy.challenge}
                      </p>
                      <p className="text-lg text-iungo-gray mb-6">
                        <strong>Solução:</strong> {caseStudy.solution}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-iungo-navy mb-4">Resultados Alcançados:</h3>
                      <ul className="space-y-2">
                        {caseStudy.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center mr-3">
                              <i className="ri-check-line text-iungo-dark-gray text-lg"></i>
                            </div>
                            <span className="text-iungo-gray font-medium">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <blockquote className="border-l-4 border-iungo-navy pl-4 italic text-iungo-gray mb-4">
                      "{caseStudy.testimonial}"
                    </blockquote>
                    <cite className="text-sm text-iungo-dark-gray">— {caseStudy.author}</cite>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <img 
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="rounded-lg shadow-xl object-cover w-full h-80 lg:h-96"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-iungo-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Ser Nosso Próximo Caso de Sucesso?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-iungo-light-gray">
            Descubra como nossas soluções podem transformar seus resultados 
            e impulsionar o crescimento do seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agendamento">
              <Button variant="secondary" size="lg" className="whitespace-nowrap">
                Agendar Demonstração
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-iungo-navy">
              Solicitar Proposta
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

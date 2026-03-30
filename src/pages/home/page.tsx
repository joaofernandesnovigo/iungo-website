import { useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Iungo Intelligence - Plataforma de IA para Comércio Digital | Inteligência Artificial';
    
    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Iungo Intelligence",
      "description": "Plataforma de inteligência artificial para comércio digital com três motores de IA: Semântica, Comportamental e Abordagem",
      "url": import.meta.env.VITE_SITE_URL || "https://example.com",
      "logo": "https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/9b6a7cb2a8e2dbc199b2b5247d5e284a.png",
      "foundingDate": "2020",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Brigadeiro Faria Lima, 1234 – 11º andar",
        "addressLocality": "São Paulo",
        "addressRegion": "SP",
        "postalCode": "01451-001",
        "addressCountry": "BR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-11-4152-6525",
        "contactType": "customer service",
        "availableLanguage": "Portuguese"
      },
      "sameAs": [
        "https://linkedin.com/company/iungo-intelligence"
      ]
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
      title: '<strong>Organizer</strong>',
      description: 'Curadoria de Catálogo 100% IA: Unifique, Enriqueça e Otimize Seus SKUs',
      icon: 'ri-database-2-line',
      href: '/solucoes/organizer'
    },
    {
      title: '<strong>Behavior</strong>',
      description: 'Visão Unificada e Preditiva do Cliente em Tempo Real',
      icon: 'ri-user-3-line',
      href: '/solucoes/customer-data-platform'
    },
    {
      title: '<strong>Concierge</strong>',
      description: 'Orquestre jornadas personalizadas em tempo real',
      icon: 'ri-route-line',
      href: '/solucoes/concierge'
    },
    {
      title: '<strong>Resolve</strong>',
      description: 'Agente de Suporte L1/L2 com Conhecimento Profundo do Produto',
      icon: 'ri-customer-service-2-line',
      href: '/solucoes/resolve'
    },
    {
      title: '<strong>Convert</strong>',
      description: 'Vendedor IA 24/7 que Identifica Leads e Converte Oportunidades',
      icon: 'ri-money-dollar-circle-line',
      href: '/solucoes/convert'
    },
    {
      title: '<strong>Attendant</strong>',
      description: 'Solução Completa para Atendimento Transacional e Administrativo',
      icon: 'ri-headphone-line',
      href: '/solucoes/attendant'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <header 
        className="relative bg-white text-iungo-navy py-12 lg:py-16"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-iungo-navy">
              Iungo Intelligence: Conexões inteligentes, conversas reais.
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-iungo-gray">
              Unifique dados de produto, cliente e orquestração de jornada 
            com nossas soluções!
            </p>
          </div>
        </div>
      </header>

      {/* Solutions Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Image */}
            <div>
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/fca30cd9297428afedef683310f155b2.png"
                alt="Arquitetura das Soluções Iungo Intelligence"
                className="w-full rounded-xl shadow-2xl"
              />
            </div>
            
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
                Nossas Soluções
              </h2>
              <p className="text-xl text-iungo-gray">
                Nossas seis soluções foram concebidas como um ecossistema inteligente, onde cada peça se encaixa para potencializar o todo. Impulsionadas pelos motores de Inteligência Semântica, Comportamental e de Abordagem da <strong>Iungo AI Platform</strong>, elas transformam dados brutos em insights preditivos e ações automatizadas e personalizadas. Do gerenciamento impecável do seu catálogo à orquestração de jornadas de cliente e automação de atendimento, cada solução foi criada para gerar um diferencial competitivo e um valor inquestionável para o seu negócio
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Link 
                key={index} 
                to={solution.href}
                className="group bg-white border border-iungo-light-gray rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-iungo-accent hover:-translate-y-1"
              >
                <article className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${
                    index % 6 === 0 ? 'bg-iungo-purple' :
                    index % 6 === 1 ? 'bg-red-600' :
                    index % 6 === 2 ? 'bg-teal-500' :
                    index % 6 === 3 ? 'bg-cyan-500' :
                    index % 6 === 4 ? 'bg-iungo-pink' :
                    'bg-iungo-tertiary'
                  } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <i className={`${solution.icon} text-xl text-white`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-iungo-navy mb-3 group-hover:text-iungo-primary transition-colors">
                      <span dangerouslySetInnerHTML={{ __html: solution.title }} />
                    </h3>
                    <p className="text-iungo-gray text-sm mb-4">{solution.description}</p>
                    <div className="flex items-center text-iungo-accent text-sm font-medium">
                      <strong>Saiba mais</strong>
                      <div className="w-4 h-4 ml-2 flex items-center justify-center">
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-4">
              Empresas que Confiam na Iungo Intelligence
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Grandes marcas já transformaram seus negócios com nossas soluções de inteligência artificial
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-12 items-center">
              {/* First set of logos */}
              <div className="flex space-x-12 items-center min-w-max">
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/b4804c6b318bf80de5932991ed3a24e0.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/21c31fc3e528520c6c6f582b5e5b7f1c.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7dec6cb2289a7749b786565c09fbbac2.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/89511d0c1a4b09ce64389932a4fb8d11.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7be4fd5f1dcb83a5c2c6647229da22a8.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/07e8479bd30d9214d16a2f9042587385.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/cc75efcf4c742404030fec4238a15755.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/5b47e835de7c2af905bf9063b712022f.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/2355ff7559fe34a68ce00bfc47a94861.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/18d00ddb7adefe4705409921f0060cca.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/b4804c6b318bf80de5932991ed3a24e0.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/21c31fc3e528520c6c6f582b5e5b7f1c.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7dec6cb2289a7749b786565c09fbbac2.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/89511d0c1a4b09ce64389932a4fb8d11.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7be4fd5f1dcb83a5c2c6647229da22a8.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/07e8479bd30d9214d16a2f9042587385.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/cc75efcf4c742404030fec4238a15755.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/5b47e835de7c2af905bf9063b712022f.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/2355ff7559fe34a68ce00bfc47a94861.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/18d00ddb7adefe4705409921f0060cca.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex space-x-12 items-center min-w-max">
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/b4804c6b318bf80de5932991ed3a24e0.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/21c31fc3e528520c6c6f582b5e5b7f1c.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7dec6cb2289a7749b786565c09fbbac2.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/89511d0c1a4b09ce64389932a4fb8d11.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7be4fd5f1dcb83a5c2c6647229da22a8.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/07e8479bd30d9214d16a2f9042587385.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/cc75efcf4c742404030fec4238a15755.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/5b47e835de7c2af905bf9063b712022f.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/2355ff7559fe34a68ce00bfc47a94861.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/18d00ddb7adefe4705409921f0060cca.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/b4804c6b318bf80de5932991ed3a24e0.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/21c31fc3e528520c6c6f582b5e5b7f1c.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7dec6cb2289a7749b786565c09fbbac2.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/89511d0c1a4b09ce64389932a4fb8d11.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/7be4fd5f1dcb83a5c2c6647229da22a8.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/07e8479bd30d9214d16a2f9042587385.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/cc75efcf4c742404030fec4238a15755.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/5b47e835de7c2af905bf9063b712022f.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/2355ff7559fe34a68ce00bfc47a94861.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/18d00ddb7adefe4705409921f0060cca.png"
                  alt="Cliente"
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-iungo-navy">
            Pronto para Transformar seu Negócio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-iungo-gray">
            Descubra como a Iungo Intelligence pode revolucionar sua estratégia de dados e impulsionar seus resultados com inteligência artificial de ponta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contato">
              <Button variant="primary" size="lg" className="bg-iungo-primary hover:bg-iungo-primary/90 text-white whitespace-nowrap">
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

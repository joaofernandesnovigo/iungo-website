import { useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { Link } from 'react-router-dom';

export default function CatalogOrganizer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: 'Enriquecimento Generativo de Conteúdo',
      description: 'Geração automática de descrições de produto, tags e metadados otimizados para SEO e conversão, utilizando Large Language Models (LLMs).',
      icon: 'ri-magic-line'
    },
    {
      title: 'Classificação Multimodal',
      description: 'Utiliza visão computacional para classificar e extrair atributos de imagens de produtos, além de textos.',
      icon: 'ri-image-line'
    },
    {
      title: 'Resolução de Entidades (Matching)',
      description: 'Agrupamento inteligente de SKUs idênticos de diferentes fontes (sellers) para garantir a consistência da oferta e a melhor experiência de busca.',
      icon: 'ri-links-line'
    },
    {
      title: 'Auditoria de Qualidade de Dados',
      description: 'Scorecard de qualidade que mede a completude e a conformidade dos dados do produto com os padrões do canal de destino.',
      icon: 'ri-shield-check-line'
    }
  ];

  const benefits = [
    {
      title: 'Redução de Tempo',
      description: 'Automatize 90% do processo de curadoria de catálogo',
      metric: '90%',
      icon: 'ri-time-line'
    },
    {
      title: 'Qualidade de Dados',
      description: 'Melhore a completude e consistência dos dados de produto',
      metric: '95%',
      icon: 'ri-database-2-line'
    },
    {
      title: 'Conversão',
      description: 'Aumente as taxas de conversão com catálogos otimizados',
      metric: '+35%',
      icon: 'ri-arrow-up-line'
    },
    {
      title: 'Canais Integrados',
      description: 'Distribua produtos para múltiplos canais simultaneamente',
      metric: '∞',
      icon: 'ri-share-line'
    }
  ];

  const useCases = [
    {
      title: 'E-commerce Multicanal',
      description: 'Unifique catálogos de diferentes sellers e distribua para marketplaces, site próprio e redes sociais.',
      icon: 'ri-store-3-line'
    },
    {
      title: 'Marketplace Management',
      description: 'Gerencie milhares de SKUs de sellers terceiros com padronização automática.',
      icon: 'ri-shopping-bag-3-line'
    },
    {
      title: 'Migração de Plataforma',
      description: 'Migre catálogos complexos entre plataformas mantendo qualidade e estrutura.',
      icon: 'ri-exchange-line'
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
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/aa06dc6f9d84043bb57e1e5fa4d95266.png"
                alt="Organizer - Curadoria de Catálogo IA"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-iungo-navy">
                <strong>Organizer</strong>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl text-iungo-gray">
                Curadoria de Catálogo 100% IA: Unifique, Enriqueça e Otimize Seus SKUs 
                com Inteligência Semântica Avançada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Como o <strong>Organizer</strong> Funciona
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Tecnologia de ponta para transformar dados despadronizados em catálogos canônicos de alta performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                  <i className={`${feature.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-iungo-navy mb-4">
                  {feature.title}
                </h3>
                <p className="text-iungo-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Principais Benefícios do <strong>Organizer</strong>
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Métricas reais de clientes que transformaram seus catálogos com nossa solução
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-6">
                  <i className={`${benefit.icon} text-2xl`}></i>
                </div>
                <div className="text-4xl font-bold text-iungo-navy mb-2">
                  {benefit.metric}
                </div>
                <h3 className="text-lg font-bold text-iungo-navy mb-2">
                  {benefit.title}
                </h3>
                <p className="text-iungo-gray text-sm">
                  {benefit.description}
                </p>
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
              Casos de Uso do Organizer
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Aplicações práticas do <strong>Organizer</strong> em diferentes cenários de negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-6">
                  <i className={`${useCase.icon} text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-iungo-navy mb-4">
                  {useCase.title}
                </h3>
                <p className="text-iungo-gray">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
                Diferencial Competitivo
              </h2>
              <p className="text-lg text-iungo-gray mb-8">
                O mercado de PIM está em rápida expansão, com a IA sendo o principal motor de crescimento. 
                O diferencial competitivo do <strong>Organizer</strong> reside na sua Inteligência Semântica nativa, 
                que vai além da simples gestão de dados, focando na compreensão do significado do produto.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-iungo-navy mb-2">Catálogo Canônico</h4>
                    <p className="text-iungo-gray">Fonte única de verdade, essencial para estratégia omnichannel</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-iungo-navy mb-2">AI Catalog Enrichment</h4>
                    <p className="text-iungo-gray">Tendência chave para melhorar descoberta de produtos e busca semântica</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-iungo-navy mb-2">Inteligência Semântica</h4>
                    <p className="text-iungo-gray">Compreensão profunda do significado e contexto dos produtos</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Semantic%20intelligence%20visualization%20showing%20product%20data%20transformation%20with%20AI%20algorithms%2C%20machine%20learning%20models%20processing%20product%20information%2C%20semantic%20analysis%20networks%2C%20and%20intelligent%20categorization%20systems%20with%20modern%20tech%20interface%20and%20data%20flow%20diagrams&width=600&height=500&seq=semantic-intelligence&orientation=portrait"
                alt="Inteligência Semântica"
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
              Conectividade que Unifica seus Produtos
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              O Organizer atua como a fonte única da verdade para seus produtos, 
              conectando-se desde a gestão de estoque até a ponta da venda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-iungo-light-gray rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-6">
                <i className="ri-shopping-cart-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Plataformas de Digital Commerce
              </h3>
              <p className="text-iungo-gray">
                Integração nativa para publicação automática de catálogo enriquecido em sistemas líderes.
              </p>
            </div>

            <div className="bg-iungo-light-gray rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-6">
                <i className="ri-database-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                PIM (Product Information Management)
              </h3>
              <p className="text-iungo-gray">
                Conexão com sistemas de gestão de informação de produto para enriquecimento via IA sem substituir a infraestrutura atual.
              </p>
            </div>

            <div className="bg-iungo-light-gray rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-6">
                <i className="ri-global-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Integração com as Principais Soluções do Mercado
              </h3>
              <p className="text-iungo-gray">
                Integração com as principais soluções do mercado como Salesforce, Adobe, Shopify, SAP e Inriver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-iungo-navy to-iungo-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Implementar o <strong>Organizer</strong>?
          </h2>
          <p className="text-xl text-iungo-gray mb-8 max-w-2xl mx-auto">
            Descubra como o <strong>Organizer</strong> pode transformar seu catálogo de produtos 
            e otimizar suas operações de e-commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agendamento">
              <Button variant="secondary" size="lg" className="whitespace-nowrap">
                Agendar Demonstração
              </Button>
            </Link>
            <Link to="/contato">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-iungo-navy">
                Solicitar Proposta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

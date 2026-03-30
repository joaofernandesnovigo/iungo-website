import { useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { Link } from 'react-router-dom';

export default function CustomerDataPlatform() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: 'Matching de Identidade em Tempo Real',
      description: 'Utiliza algoritmos avançados para unificar IDs fragmentados (e-mail, telefone, cookies, IDs de dispositivos) em um único perfil, com alta precisão e em tempo real.',
      icon: 'ri-user-search-line'
    },
    {
      title: 'Segmentação Preditiva e Dinâmica',
      description: 'Criação de segmentos de clientes não apenas com base no histórico, mas na propensão futura (ex: "Clientes com 80% de chance de Churn nos próximos 30 dias").',
      icon: 'ri-group-line'
    },
    {
      title: 'Jornada de Dados (Customer Journey Mapping)',
      description: 'Visualização e análise do caminho percorrido pelo cliente, identificando pontos de fricção e oportunidades de intervenção.',
      icon: 'ri-map-pin-line'
    },
    {
      title: 'Conformidade e Privacidade (LGPD/GDPR by Design)',
      description: 'Ferramentas nativas para gestão de consentimento, anonimização e portabilidade de dados.',
      icon: 'ri-shield-check-line'
    }
  ];

  const benefits = [
    {
      title: 'Unificação de Dados',
      description: 'Crie uma visão 360° do cliente unificando todas as fontes',
      metric: '100%',
      icon: 'ri-database-2-line'
    },
    {
      title: 'Precisão Preditiva',
      description: 'Identifique propensão de compra com alta precisão',
      metric: '95%',
      icon: 'ri-brain-line'
    },
    {
      title: 'Redução de Churn',
      description: 'Antecipe e previna a perda de clientes',
      metric: '-40%',
      icon: 'ri-user-unfollow-line'
    },
    {
      title: 'Aumento de LTV',
      description: 'Maximize o valor de vida do cliente',
      metric: '+60%',
      icon: 'ri-arrow-up-circle-line'
    }
  ];

  const useCases = [
    {
      title: 'E-commerce Omnichannel',
      description: 'Unifique dados de web, mobile, loja física e redes sociais para criar perfis completos de clientes.',
      icon: 'ri-store-3-line'
    },
    {
      title: 'Prevenção de Churn',
      description: 'Identifique clientes com alta propensão ao abandono e ative campanhas de retenção automáticas.',
      icon: 'ri-alarm-warning-line'
    },
    {
      title: 'Personalização em Escala',
      description: 'Crie experiências hiperpersonalizadas baseadas no perfil unificado e comportamento preditivo.',
      icon: 'ri-user-star-line'
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
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/211c40d7654d400f5f5a6f8a6c2cb0c7.png"
                alt="Behavior - Customer Data Platform"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-iungo-navy">
                <strong>Behavior</strong>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl text-iungo-gray mb-6">
                A Visão Unificada e Preditiva do Cliente. O CDP que Transforma Dados em Propensão de Compra em Tempo Real
              </p>
              <p className="text-lg text-iungo-gray">
                Crie uma visão 360° do cliente através da Inteligência Comportamental. Nossa plataforma unifica dados 
                de múltiplas fontes e gera insights preditivos para maximizar conversões e lifetime value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Como o <strong>Behavior</strong> Funciona
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Tecnologia avançada para unificar dados de clientes e gerar insights preditivos em tempo real
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
              Principais Benefícios do <strong>Behavior</strong>
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Métricas reais de clientes que transformaram sua visão de cliente com nossa plataforma
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
              Casos de Uso do <strong>Behavior</strong>
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Aplicações práticas do <strong>Behavior</strong> em diferentes cenários de negócio
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
                O mercado de CDP cresce impulsionado pela necessidade de dados de primeira parte. 
                A tendência é o CDP impulsionado por IA, que vai além da agregação de dados para oferecer 
                inteligência preditiva e orquestração.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-iungo-navy mb-2">Perfil Único de Cliente (Single Customer View)</h4>
                    <p className="text-iungo-gray">Unificação completa de dados online, offline, transacional e comportamental</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-iungo-navy mb-2">Modelagem de Propensão Central</h4>
                    <p className="text-iungo-gray">Transforma o CDP de repositório de dados em motor de crescimento</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-iungo-navy mb-2">Conformidade LGPD/GDPR by Design</h4>
                    <p className="text-iungo-gray">Privacidade e conformidade integradas desde a concepção</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Advanced%20customer%20data%20unification%20visualization%20showing%20multiple%20data%20streams%20converging%20into%20a%20single%20customer%20profile%2C%20with%20predictive%20analytics%20models%2C%20machine%20learning%20algorithms%2C%20and%20real-time%20behavioral%20tracking%20in%20a%20modern%20purple%20and%20blue%20interface&width=600&height=500&seq=cdp-intelligence&orientation=portrait"
                alt="Inteligência Comportamental"
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
              Dados de Todas as Fontes, em Um Só Lugar
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              O Behavior elimina os silos de dados, ingerindo informações de qualquer ponto de contato 
              e integrando-se às plataformas de dados mais sofisticadas do mercado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-database-2-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Customer Data Platforms (CDP)
              </h3>
              <p className="text-iungo-gray">
                Ingestão e orquestração de dados históricos e comportamentais para modelagem de propensão.
              </p>
            </div>
            
            <div className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-global-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Fontes de Dados Online
              </h3>
              <p className="text-iungo-gray">
                Coleta eventos em tempo real de Web e Apps.
              </p>
            </div>
            
            <div className="bg-iungo-light-gray rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-server-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Integração com as Principais Soluções do Mercado
              </h3>
              <p className="text-iungo-gray">
                Integração com as principais soluções do mercado como Salesforce, Tealium, Adobe, Treasure Data e BlueConic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-iungo-navy to-iungo-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Implementar o <strong>Behavior</strong>?
          </h2>
          <p className="text-xl text-iungo-gray mb-8 max-w-2xl mx-auto">
            Descubra como o <strong>Behavior</strong> pode unificar seus dados de cliente 
            e gerar insights preditivos para seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Agendar Demonstração
            </Button>
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

import { useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { Link } from 'react-router-dom';

export default function JourneyOrchestrator() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: 'Orquestração de Jornada Orientada por ML',
      description: 'Utiliza modelos preditivos do Iungo CDP para determinar o momento e o canal ideal para cada comunicação.',
      icon: 'ri-brain-line'
    },
    {
      title: 'Teste A/B/n e Otimização Automática',
      description: 'Otimiza automaticamente as réguas de comunicação e o conteúdo das mensagens para maximizar a conversão (ex: qual slogan funciona melhor para este segmento).',
      icon: 'ri-test-tube-line'
    },
    {
      title: 'Personalização de Conteúdo Dinâmico (DCO)',
      description: 'Criação de mensagens e ofertas com conteúdo gerado por IA (GenAI) e adaptado ao contexto do cliente.',
      icon: 'ri-magic-line'
    },
    {
      title: 'Busca Semântica Avançada',
      description: 'Integração nativa com o Resolve para oferecer uma busca no site que entende a intenção do usuário, não apenas palavras-chave.',
      icon: 'ri-search-line'
    }
  ];

  const benefits = [
    {
      title: 'ROAS',
      description: 'Maximize o retorno sobre investimento em marketing',
      metric: '+250%',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      title: 'Conversão',
      description: 'Melhore as taxas de conversão com jornadas otimizadas',
      metric: '+85%',
      icon: 'ri-arrow-up-line'
    },
    {
      title: 'LTV',
      description: 'Aumente o valor de vida do cliente com abordagem inteligente',
      metric: '+120%',
      icon: 'ri-heart-line'
    },
    {
      title: 'Automação',
      description: 'Automatize decisões de marketing em tempo real',
      metric: '100%',
      icon: 'ri-robot-line'
    }
  ];

  const useCases = [
    {
      title: 'Campanhas de Reativação',
      description: 'Identifique clientes inativos e dispare jornadas personalizadas para reengajamento automático baseado em propensão.',
      icon: 'ri-restart-line'
    },
    {
      title: 'Cross-sell e Up-sell Inteligente',
      description: 'Recomende produtos complementares no momento ideal baseado em comportamento e propensão de compra em tempo real.',
      icon: 'ri-shopping-cart-line'
    },
    {
      title: 'Experiência de Busca Personalizada',
      description: 'Ofereça resultados de busca que entendem a intenção do usuário, integrando dados comportamentais com catálogo semântico.',
      icon: 'ri-search-eye-line'
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
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/e8af69da78bb2f48bccc510d7216a5fb.png"
                alt="Concierge - Journey Orchestrator"
                className="rounded-lg shadow-xl object-cover w-full h-80 lg:h-96"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                <strong>Concierge</strong>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl text-gray-700">
                Orquestração Hiperpersonalizada: Otimize a Jornada do Cliente com Gatilhos Comportamentais em Tempo Real
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
              Como o <strong>Concierge</strong> Funciona
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                  <i className={`${feature.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Principais Benefícios do <strong>Concierge</strong>
            </h2>
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
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
              Casos de Uso do <strong>Concierge</strong>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-full text-white mx-auto mb-6">
                  <i className={`${useCase.icon} text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-600">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Experiência Orquestrada
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                A orquestração de jornadas evolui de simples automação de marketing para Experiência Orquestrada. 
                O diferencial é a integração nativa com o CDP e o <strong>Concierge</strong>, garantindo que a abordagem (o "COMO") 
                seja informada pelo cliente (o "QUEM") e pelo produto (o "O QUÊ").
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-navy text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Next Best Action (NBA)</h4>
                    <p className="text-gray-600">Determina automaticamente a melhor ação baseada em propensão de compra + visualização de página específica</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-navy text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Orquestração Multicanal</h4>
                    <p className="text-gray-600">Coordena ações em e-mail, push, pop-up, chat e agentes conversacionais em tempo real</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-check-line text-iungo-navy text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Integração Nativa com Ecossistema</h4>
                    <p className="text-gray-600">Conecta dados do CDP com inteligência do catálogo para decisões contextuais precisas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Experience%20orchestration%20visualization%20showing%20integrated%20ecosystem%20with%20CDP%20customer%20data%2C%20catalog%20intelligence%2C%20and%20real-time%20behavioral%20triggers%20creating%20personalized%20multi-channel%20customer%20experiences%2C%20featuring%20modern%20interface%20design%20with%20navy%20blue%20and%20gray%20elements%20and%20data%20flow%20connections&width=600&height=500&seq=experience-orchestration-v2&orientation=portrait"
                alt="Experiência Orquestrada"
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
              Ativação Multicanal Inteligente
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              O <strong>Concierge</strong> orquestra a melhor ação e se conecta às principais plataformas de automação de marketing, 
              garantindo que a mensagem certa chegue ao cliente no momento exato.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-mail-send-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Automação de Marketing B2B e B2C
              </h3>
              <p className="text-iungo-gray">
                Gatilhos inteligentes para nutrir leads e engajar clientes baseados em comportamento.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-message-3-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Canais de Mensageria
              </h3>
              <p className="text-iungo-gray">
                Integração oficial com WhatsApp Business API, SMS e E-mail.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-iungo-navy to-iungo-gray rounded-lg text-white mb-6">
                <i className="ri-global-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">
                Integração com as Principais Soluções do Mercado
              </h3>
              <p className="text-iungo-gray">
                Integração com HubSpot, Salesforce, Adobe, Microsoft e Oracle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-iungo-navy to-iungo-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Implementar o <strong>Concierge</strong>?
          </h2>
          <p className="text-xl text-iungo-light-gray mb-8 max-w-2xl mx-auto">
            Descubra como o <strong>Concierge</strong> pode otimizar suas jornadas de cliente 
            e maximizar suas conversões
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agendamento">
              <Button variant="secondary" size="lg">
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

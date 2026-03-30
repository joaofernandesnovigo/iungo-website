import { useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { Link } from 'react-router-dom';

export default function SalesAI() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: 'ri-search-eye-line',
      title: 'Qualificação de Leads Preditiva',
      description: 'Identifica leads com alta intenção de compra (hot leads) e inicia o contato proativamente, antes que o concorrente o faça.'
    },
    {
      icon: 'ri-chat-quote-line',
      title: 'Negociação e Quebra de Objeções',
      description: 'Utiliza LLMs treinados em técnicas de vendas para responder a dúvidas complexas, negociar e superar objeções.'
    },
    {
      icon: 'ri-secure-payment-line',
      title: 'Fechamento de Vendas Automático',
      description: 'Integração nativa para verificar estoque, gerar orçamentos e finalizar a transação dentro do chat.'
    },
    {
      icon: 'ri-team-line',
      title: 'CRM Integration Nativa',
      description: 'Transfere conversas para vendedores humanos em momentos críticos, fornecendo resumo completo do diálogo.'
    }
  ];

  const metrics = [
    { value: '300%', label: 'Aumento na Qualificação de Leads', icon: 'ri-arrow-up-line' },
    { value: '24/7', label: 'Disponibilidade de Vendas', icon: 'ri-time-line' },
    { value: '85%', label: 'Taxa de Conversão', icon: 'ri-trophy-line' },
    { value: '60%', label: 'Redução no Ciclo de Vendas', icon: 'ri-speed-up-line' }
  ];

  const useCases = [
    {
      title: 'Prospecção Ativa Inteligente',
      description: 'O sistema identifica um visitante que abandonou o carrinho com produtos de alto valor e inicia automaticamente uma conversa personalizada via WhatsApp, oferecendo desconto exclusivo e tirando dúvidas sobre o produto.',
      icon: 'ri-radar-line',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Negociação Automatizada',
      description: 'Durante uma conversa de vendas, o cliente apresenta objeções sobre preço. O Sales AI utiliza técnicas de vendas treinadas para negociar, oferece parcelamento e gera link de pagamento instantâneo.',
      icon: 'ri-handshake-line',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Escalação Inteligente',
      description: 'Para vendas de alto valor ou clientes VIP, o sistema transfere automaticamente para um vendedor humano, fornecendo histórico completo da conversa e perfil detalhado do cliente.',
      icon: 'ri-arrow-up-circle-line',
      color: 'from-red-500 to-pink-500'
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
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/1971e567389aa402b3abd53fb11c211b.png"
                alt="Convert - Sales AI"
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-iungo-navy">
                <strong>Convert</strong>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl text-iungo-gray">
                O Vendedor IA 24/7 que Identifica Leads Quentes e Converte Oportunidades com Abordagem Hiperpersonalizada
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
              Como o <strong>Convert</strong> Funciona
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Tecnologias avançadas que transformam leads em vendas através de inteligência artificial especializada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg border border-iungo-light-gray p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                  <i className={`${feature.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-iungo-navy mb-4">{feature.title}</h3>
                <p className="text-iungo-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-4">
                  <i className={`${metric.icon} text-xl`}></i>
                </div>
                <div className="text-3xl font-bold text-iungo-navy mb-2">{metric.value}</div>
                <div className="text-iungo-gray">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-iungo-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Casos de Uso do <strong>Convert</strong>
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              Veja como o <strong>Convert</strong> transforma oportunidades em vendas reais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-iungo-navy to-iungo-gray"></div>
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                    <i className={`${useCase.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-iungo-navy mb-4">{useCase.title}</h3>
                  <p className="text-iungo-gray">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
                Principais Benefícios do <strong>Convert</strong>
              </h2>
              <p className="text-lg text-iungo-gray mb-8">
                O <strong>Convert</strong> combina o timing perfeito do <strong>Behavior</strong> com o conhecimento do produto do <strong>Organizer</strong> e a habilidade de conversão da Inteligência de Abordagem.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-brain-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-iungo-navy mb-2">Prospecção Ativa Inteligente</h3>
                    <p className="text-iungo-gray">Identifica leads quentes através de análise comportamental e inicia contato no momento ideal.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-chat-3-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-iungo-navy mb-2">Conversação Especializada</h3>
                    <p className="text-iungo-gray">Linguagem treinada em técnicas de vendas para quebrar objeções e conduzir ao fechamento.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <i className="ri-links-line text-iungo-dark-gray text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-iungo-navy mb-2">Integração Transacional</h3>
                    <p className="text-iungo-gray">Conexão nativa com sistemas para verificar estoque, gerar orçamentos e processar pagamentos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Advanced%20sales%20AI%20conversation%20interface%20showing%20intelligent%20lead%20qualification%20process%2C%20automated%20negotiation%20workflows%2C%20real-time%20objection%20handling%2C%20and%20seamless%20payment%20integration%2C%20with%20professional%20sales%20dashboard%20and%20conversion%20analytics&width=600&height=400&seq=sales-ai-tech&orientation=landscape"
                alt="Sales AI Technology"
                className="rounded-lg shadow-xl object-cover w-full h-80 lg:h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gradient-to-br from-iungo-light-gray to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              Integração com o Ecossistema Iungo
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              O <strong>Convert</strong> trabalha em sinergia com outras soluções para maximizar resultados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                <i className="ri-user-3-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4"><strong>Behavior</strong></h3>
              <p className="text-iungo-gray">
                Utiliza dados comportamentais e propensão de compra para identificar o momento ideal de abordagem
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                <i className="ri-database-2-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4"><strong>Organizer</strong></h3>
              <p className="text-iungo-gray">
                Acessa informações detalhadas dos produtos para oferecer recomendações precisas e personalizadas
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                <i className="ri-route-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4"><strong>Concierge</strong></h3>
              <p className="text-iungo-gray">
                Coordena a jornada de vendas com outros pontos de contato para uma experiência unificada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-iungo-navy mb-6">
              O Vendedor Conectado ao Estoque e ao Cliente
            </h2>
            <p className="text-xl text-iungo-gray max-w-3xl mx-auto">
              O <strong>Convert</strong> fecha vendas com eficiência máxima porque opera integrado aos sistemas de gestão (ERP) e armazém (WMS) que controlam a cadeia de suprimentos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-iungo-light-gray p-8 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                <i className="ri-cloud-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">Cloud ERP</h3>
              <p className="text-iungo-gray">
                Consulta de preços, condições comerciais e faturamento em tempo real.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-iungo-light-gray p-8 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                <i className="ri-store-3-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">WMS (Warehouse Management)</h3>
              <p className="text-iungo-gray">
                Verificação de disponibilidade de estoque e cálculo de frete direto na fonte.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-iungo-light-gray p-8 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-iungo-navy to-iungo-gray text-white mb-6">
                <i className="ri-links-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-iungo-navy mb-4">Integração com as Principais Soluções do Mercado</h3>
              <p className="text-iungo-gray">
                Oracle, Microsoft, SAP, Manhattan Associates e Blue Yonder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-iungo-navy to-iungo-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Implementar o <strong>Convert</strong>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-iungo-light-gray">
            Descubra como o <strong>Convert</strong> pode potencializar suas vendas 
            e automatizar seu processo comercial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Solicitar Demonstração
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

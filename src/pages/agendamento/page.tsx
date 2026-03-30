import { useState, useEffect } from 'react';
import Button from '../../components/base/Button';
import { Link } from 'react-router-dom';

export default function AgendamentoPage() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Agendar Demonstração - Iungo Intelligence | Veja a IA em Ação';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Agende uma demonstração personalizada das soluções de IA da Iungo Intelligence. Veja como transformar seu comércio digital com inteligência artificial avançada.');
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Demonstração Iungo Intelligence",
      "description": "Demonstração personalizada das soluções de inteligência artificial para comércio digital",
      "url": `${import.meta.env.VITE_SITE_URL || "https://example.com"}/agendamento`,
      "provider": {
        "@type": "Organization",
        "name": "Iungo Intelligence",
        "url": import.meta.env.VITE_SITE_URL || "https://example.com"
      },
      "serviceType": "Business Consultation",
      "offers": {
        "@type": "Offer",
        "name": "Demonstração Gratuita",
        "description": "Demonstração personalizada das soluções de IA",
        "price": "0",
        "priceCurrency": "BRL"
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

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    cargo: '',
    solucao: '',
    data_preferida: '',
    horario_preferido: '',
    mensagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('https://readdy.ai/api/form/d416v7pk7qvo96j89ajg', {
        method: 'POST',
        body: new URLSearchParams(formDataToSend as any)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          nome: '',
          email: '',
          empresa: '',
          telefone: '',
          cargo: '',
          solucao: '',
          data_preferida: '',
          horario_preferido: '',
          mensagem: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iungo-navy to-iungo-blue">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-iungo-light-blue transition-colors">
              <i className="ri-arrow-left-line mr-2"></i>
              Voltar
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Agende uma Demonstração
            </h1>
            <p className="text-xl text-iungo-light-gray mb-8 max-w-2xl mx-auto">
              Descubra como nossas soluções de IA podem transformar seu negócio. 
              Agende uma demonstração personalizada com nossos especialistas.
            </p>
            <Link to="/solucoes">
              <Button variant="secondary" size="lg">
                Conhecer Soluções
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <form id="agendamento-demonstracao" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                    placeholder="seu.email@empresa.com"
                  />
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo/Função
                  </label>
                    <input
                    type="text"
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                    placeholder="Seu cargo na empresa"
                  />
                </div>

                <div>
                  <label htmlFor="solucao" className="block text-sm font-medium text-gray-700 mb-2">
                    Solução de Interesse
                  </label>
                  <select
                    id="solucao"
                    name="solucao"
                    value={formData.solucao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm pr-8"
                  >
                    <option value="">Selecione uma solução</option>
                    <option value="Attendant">Attendant</option>
                    <option value="Sales AI">Sales AI</option>
                    <option value="Technical Support AI">Technical Support AI</option>
                    <option value="Journey Orchestrator">Journey Orchestrator</option>
                    <option value="Customer Data Platform">Customer Data Platform</option>
                    <option value="Resolve">Resolve</option>
                    <option value="Todas as soluções">Todas as soluções</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="data_preferida" className="block text-sm font-medium text-gray-700 mb-2">
                    Data Preferida
                  </label>
                  <input
                    type="date"
                    id="data_preferida"
                    name="data_preferida"
                    value={formData.data_preferida}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="horario_preferido" className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Preferido
                  </label>
                  <select
                    id="horario_preferido"
                    name="horario_preferido"
                    value={formData.horario_preferido}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm pr-8"
                  >
                    <option value="">Selecione um horário</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem Adicional
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm resize-none"
                  placeholder="Conte-nos mais sobre suas necessidades e objetivos..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.mensagem.length}/500 caracteres
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <i className="ri-check-circle-fill text-green-400 text-xl mr-3"></i>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Demonstração agendada com sucesso!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Nossa equipe entrará em contato em breve para confirmar os detalhes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <i className="ri-error-warning-fill text-red-400 text-xl mr-3"></i>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Erro ao enviar solicitação
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Tente novamente ou entre em contato conosco diretamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-48 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="ri-calendar-check-line mr-2"></i>
                      Agendar Demonstração
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center mt-12">
            <p className="text-iungo-light-blue mb-4">
              Precisa de ajuda? Entre em contato conosco:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white">
              <div className="flex items-center">
                <i className="ri-phone-line mr-2"></i>
                <span>+55 (11) 4152-6525</span>
              </div>
              <div className="flex items-center">
                <i className="ri-mail-line mr-2"></i>
                <span>vendas@iungo-ai.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

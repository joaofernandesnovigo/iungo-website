import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

export default function Contato() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Contato - Iungo Intelligence | Fale com Especialistas em IA';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Entre em contato com a Iungo Intelligence. Nossa equipe de especialistas em inteligência artificial está pronta para ajudar seu negócio. Vendas, suporte técnico e parcerias.');
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contato - Iungo Intelligence",
      "description": "Entre em contato com especialistas em inteligência artificial para comércio digital",
      "url": `${import.meta.env.VITE_SITE_URL || "https://example.com"}/contato`,
      "mainEntity": {
        "@type": "Organization",
        "name": "Iungo Intelligence",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+55-11-4152-6525",
            "contactType": "sales",
            "email": "vendas@iungo-ai.com",
            "availableLanguage": "Portuguese"
          },
          {
            "@type": "ContactPoint",
            "telephone": "+55-11-4152-6525",
            "contactType": "technical support",
            "email": "suporte@iungo-ai.com",
            "availableLanguage": "Portuguese"
          }
        ],
        "address": [
          {
            "@type": "PostalAddress",
            "streetAddress": "Av. Brigadeiro Faria Lima, 1234 – 11º andar",
            "addressLocality": "São Paulo",
            "addressRegion": "SP",
            "postalCode": "01451-001",
            "addressCountry": "BR"
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "Edifício Khronos - Rua Tomé de Souza, n. 1.065, 3º andar",
            "addressLocality": "Belo Horizonte",
            "addressRegion": "MG",
            "postalCode": "30140-138",
            "addressCountry": "BR"
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

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    cargo: '',
    interesse: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('https://readdy.ai/api/form/submit/contato-iungo-ai', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          nome: '',
          email: '',
          empresa: '',
          telefone: '',
          cargo: '',
          interesse: '',
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

  const contactInfo = [
    {
      title: 'Vendas',
      description: 'Fale com nossa equipe comercial',
      contact: 'vendas@iungo-ai.com',
      phone: '+55 (11) 4152-6525',
      icon: 'ri-phone-line'
    },
    {
      title: 'Suporte Técnico',
      description: 'Ajuda com implementação e uso',
      contact: 'suporte@iungo-ai.com',
      phone: '+55 (11) 4152-6525',
      icon: 'ri-customer-service-2-line'
    },
    {
      title: 'Parcerias',
      description: 'Oportunidades de parceria',
      contact: 'parcerias@iungo-ai.com',
      phone: '+55 (11) 4152-6525',
      icon: 'ri-team-line'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <header className="py-20 bg-iungo-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-iungo-light-gray">
              Pronto para transformar seu negócio com inteligência artificial? 
              Nossa equipe está aqui para ajudar
            </p>
          </div>
        </div>
      </header>

      {/* Contact Form and Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-iungo-navy mb-6">
                Fale Conosco
              </h2>
              <p className="text-lg text-iungo-gray mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato em até 24 horas.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-readdy-form id="contato-iungo-ai">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-iungo-navy mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-iungo-navy mb-2">
                      E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                      placeholder="seu.email@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="empresa" className="block text-sm font-medium text-iungo-navy mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      required
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-iungo-navy mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cargo" className="block text-sm font-medium text-iungo-navy mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                      placeholder="Seu cargo na empresa"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interesse" className="block text-sm font-medium text-iungo-navy mb-2">
                      Interesse Principal *
                    </label>
                    <select
                      id="interesse"
                      name="interesse"
                      required
                      value={formData.interesse}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-8 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="resolve">Resolve</option>
                      <option value="customer-data-platform">Customer Data Platform</option>
                      <option value="concierge">Concierge</option>
                      <option value="resolve">Resolve</option>
                      <option value="convert">Convert</option>
                      <option value="attendant">Attendant</option>
                      <option value="technical-support-ai">Technical Support AI</option>
                      <option value="sales-ai">Sales AI</option>
                      <option value="customer-care-ai">Customer Attendant AI</option>
                      <option value="plataforma-completa">Plataforma Completa</option>
                      <option value="consultoria">Consultoria</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-iungo-navy mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    maxLength={500}
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-iungo-light-gray rounded-lg focus:ring-2 focus:ring-iungo-navy focus:border-transparent text-sm"
                    placeholder="Conte-nos mais sobre suas necessidades e objetivos..."
                  />
                  <p className="text-xs text-iungo-gray mt-1">
                    Máximo de 500 caracteres ({formData.mensagem.length}/500)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  disabled={isSubmitting || formData.mensagem.length > 500}
                  className="w-full"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-iungo-light-gray border border-iungo-gray rounded-lg">
                    <p className="text-iungo-navy">
                      Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-iungo-navy mb-6">
                Outras Formas de Contato
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <article key={index} className="bg-iungo-light-gray rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-iungo-navy/10 rounded-lg flex items-center justify-center mr-4">
                        <i className={`${info.icon} text-xl text-iungo-navy`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-iungo-navy mb-2">{info.title}</h3>
                        <p className="text-iungo-gray mb-3">{info.description}</p>
                        <div className="space-y-1">
                          <p className="text-iungo-dark-gray font-medium">
                            <a href={`mailto:${info.contact}`} rel="nofollow">{info.contact}</a>
                          </p>
                          <p className="text-iungo-gray">
                            <a href={`tel:${info.phone.replace(/\s/g, '')}`} rel="nofollow">{info.phone}</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Office Location */}
              <div className="space-y-6">
                <article className="bg-white border border-iungo-light-gray rounded-lg p-6">
                  <h3 className="text-lg font-bold text-iungo-navy mb-4">Escritório São Paulo</h3>
                  <div className="space-y-2 text-iungo-gray mb-4">
                    <p><strong>Av. Brigadeiro Faria Lima, 1234 – 11º andar</strong></p>
                    <p>Jardim Paulistano, São Paulo – SP</p>
                    <p>CEP: 01451-001</p>
                    <p className="font-medium text-iungo-dark-gray">
                      <a href="tel:+551141526525" rel="nofollow">+55 (11) 4152-6525</a>
                    </p>
                  </div>
                  
                  {/* Google Maps Embed São Paulo */}
                  <div className="mt-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.7!2d-46.6753!3d-23.5707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59f1069d11d1%3A0x4b1b4b1b4b1b4b1b!2sAv.%20Brig.%20Faria%20Lima%2C%201234%20-%20Jardim%20Paulistano%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt!2sbr!4v1234567890"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      title="Localização do escritório da Iungo Intelligence em São Paulo"
                    ></iframe>
                  </div>
                </article>

                <article className="bg-white border border-iungo-light-gray rounded-lg p-6">
                  <h3 className="text-lg font-bold text-iungo-navy mb-4">Escritório Belo Horizonte</h3>
                  <div className="space-y-2 text-iungo-gray mb-4">
                    <p><strong>Edifício Khronos - Rua Tomé de Souza, n. 1.065, 3º andar</strong></p>
                    <p>Bairro Savassi, Belo Horizonte – MG</p>
                    <p>CEP: 30.140-138</p>
                  </div>
                  
                  {/* Google Maps Embed Belo Horizonte */}
                  <div className="mt-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.2!2d-43.9378!3d-19.9245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9c9c0a0a0a0a0a0a%3A0x1b1b1b1b1b1b1b1b!2sR.%20Tom%C3%A9%20de%20Souza%2C%201065%20-%20Savassi%2C%20Belo%20Horizonte%20-%20MG!5e0!3m2!1spt!2sbr!4v1234567890"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      title="Localização do escritório da Iungo Intelligence em Belo Horizonte"
                    ></iframe>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface JobApplication {
  jobTitle: string;
  submitUrl: string;
}

export default function Carreiras() {
  useEffect(() => {
    // Update page title and meta tags
    document.title = 'Carreiras - Iungo Intelligence | Trabalhe com Inteligência Artificial';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Junte-se à equipe da Iungo Intelligence. Vagas abertas em Machine Learning, Desenvolvimento, Data Science e mais. Trabalho remoto e benefícios excepcionais.');
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Carreiras na Iungo Intelligence",
      "description": "Oportunidades de carreira em inteligência artificial para comércio digital",
      "url": `${import.meta.env.VITE_SITE_URL || "https://example.com"}/carreiras`,
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Iungo Intelligence",
        "sameAs": import.meta.env.VITE_SITE_URL || "https://example.com"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      },
      "employmentType": ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
      "workHours": "Flexível",
      "benefits": "Trabalho remoto, plano de saúde, desenvolvimento profissional"
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobApplication | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    linkedin: '',
    experiencia: '',
    motivacao: '',
    disponibilidade: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const jobApplications: Record<string, string> = {
    'Engenheiro de Machine Learning Sênior': 'https://readdy.ai/api/form/d494c7t92fv05nd9mv50',
    'Product Manager AI Solutions': 'https://readdy.ai/api/form/d494c7t92fv05nd9mv5g',
    'Desenvolvedor Full Stack': 'https://readdy.ai/api/form/d494c7t92fv05nd9mv60',
    'Data Scientist': 'https://readdy.ai/api/form/d494c7t92fv05nd9mv6g',
    'Customer Success Manager': 'https://readdy.ai/api/form/d494c7t92fv05nd9mv3g',
    'DevOps Engineer': 'https://readdy.ai/api/form/d494c7t92fv05nd9mv40'
  };

  const openModal = (jobTitle: string) => {
    setCurrentJob({
      jobTitle,
      submitUrl: jobApplications[jobTitle]
    });
    setIsModalOpen(true);
    setSubmitStatus('idle');
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      linkedin: '',
      experiencia: '',
      motivacao: '',
      disponibilidade: ''
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentJob(null);
    setSubmitStatus('idle');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJob) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('vaga', currentJob.jobTitle);
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telefone', formData.telefone);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('experiencia', formData.experiencia);
      formDataToSend.append('motivacao', formData.motivacao);
      formDataToSend.append('disponibilidade', formData.disponibilidade);

      const response = await fetch(currentJob.submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGeneralApplicationModal = () => {
    setCurrentJob({
      jobTitle: 'Candidatura Geral',
      submitUrl: 'https://readdy.ai/api/form/d494c7t92fv05nd9mv4g'
    });
    setIsModalOpen(true);
    setSubmitStatus('idle');
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      linkedin: '',
      experiencia: '',
      motivacao: '',
      disponibilidade: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Carreiras na Iungo Intelligence
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Junte-se à nossa equipe e ajude a construir o futuro da inteligência artificial para comércio digital. 
              Oferecemos um ambiente inovador, desafios estimulantes e oportunidades de crescimento.
            </p>
            <button 
              onClick={openGeneralApplicationModal}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Enviar Currículo
            </button>
          </div>
        </div>
      </section>

      {/* Vagas Abertas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vagas Abertas</h2>
            <p className="text-lg text-gray-600">Encontre a oportunidade perfeita para sua carreira</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vaga 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-brain-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Engenheiro de Machine Learning Sênior</h3>
                  <p className="text-gray-600">Tecnologia • Remoto</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Desenvolva algoritmos avançados de ML para personalização e automação em e-commerce.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Python</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">TensorFlow</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">AWS</span>
              </div>
              <button 
                onClick={() => openModal('Engenheiro de Machine Learning Sênior')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Candidatar-se
              </button>
            </div>

            {/* Vaga 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-product-hunt-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Manager AI Solutions</h3>
                  <p className="text-gray-600">Produto • Híbrido</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Lidere o desenvolvimento de produtos de IA inovadores para transformar o comércio digital.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Strategy</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">AI/ML</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Analytics</span>
              </div>
              <button 
                onClick={() => openModal('Product Manager AI Solutions')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Candidatar-se
              </button>
            </div>

            {/* Vaga 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-code-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Desenvolvedor Full Stack</h3>
                  <p className="text-gray-600">Desenvolvimento • Remoto</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Construa interfaces e APIs robustas para nossas soluções de IA empresarial.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">React</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Node.js</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">TypeScript</span>
              </div>
              <button 
                onClick={() => openModal('Desenvolvedor Full Stack')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Candidatar-se
              </button>
            </div>

            {/* Vaga 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ri-bar-chart-line text-orange-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Data Scientist</h3>
                  <p className="text-gray-600">Dados • Remoto</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Extraia insights valiosos de dados de e-commerce para impulsionar decisões estratégicas.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Python</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">SQL</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Tableau</span>
              </div>
              <button 
                onClick={() => openModal('Data Scientist')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Candidatar-se
              </button>
            </div>

            {/* Vaga 5 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <i className="ri-customer-service-line text-teal-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Success Manager</h3>
                  <p className="text-gray-600">Sucesso do Cliente • Híbrido</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Garanta o sucesso e satisfação dos nossos clientes com nossas soluções de IA.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">CRM</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">Analytics</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">Communication</span>
              </div>
              <button 
                onClick={() => openModal('Customer Success Manager')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Candidatar-se
              </button>
            </div>

            {/* Vaga 6 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="ri-server-line text-red-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">DevOps Engineer</h3>
                  <p className="text-gray-600">Infraestrutura • Remoto</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Mantenha e otimize nossa infraestrutura cloud para suportar aplicações de IA em escala.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">AWS</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Docker</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Kubernetes</span>
              </div>
              <button 
                onClick={() => openModal('DevOps Engineer')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Candidatar-se
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que trabalhar conosco?</h2>
            <p className="text-lg text-gray-600">Oferecemos um ambiente de trabalho excepcional</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-home-office-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trabalho Remoto</h3>
              <p className="text-gray-600">Flexibilidade total para trabalhar de onde quiser</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plano de Saúde</h3>
              <p className="text-gray-600">Cobertura completa para você e sua família</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-graduation-cap-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Desenvolvimento</h3>
              <p className="text-gray-600">Investimento contínuo em sua carreira e crescimento</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipe Incrível</h3>
              <p className="text-gray-600">Trabalhe com profissionais talentosos e apaixonados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Candidatura */}
      {isModalOpen && currentJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Candidatar-se para: {currentJob.jobTitle}
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-circle-line text-xl mr-2"></i>
                    <span>Candidatura enviada com sucesso! Entraremos em contato em breve.</span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line text-xl mr-2"></i>
                    <span>Erro ao enviar candidatura. Tente novamente.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} data-readdy-form id={`candidatura-${currentJob.jobTitle.replace(/\s+/g, '-').toLowerCase()}`}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="https://linkedin.com/in/seuperfil"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência Profissional *
                  </label>
                  <textarea
                    id="experiencia"
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    placeholder="Descreva sua experiência profissional relevante para esta vaga..."
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.experiencia.length}/500 caracteres
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="motivacao" className="block text-sm font-medium text-gray-700 mb-2">
                    Por que quer trabalhar conosco? *
                  </label>
                  <textarea
                    id="motivacao"
                    name="motivacao"
                    value={formData.motivacao}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    placeholder="Conte-nos sua motivação para se juntar à nossa equipe..."
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.motivacao.length}/500 caracteres
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilidade *
                  </label>
                  <select
                    id="disponibilidade"
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Selecione sua disponibilidade</option>
                    <option value="imediata">Imediata</option>
                    <option value="15-dias">15 dias</option>
                    <option value="30-dias">30 dias</option>
                    <option value="45-dias">45 dias</option>
                    <option value="60-dias">60 dias</option>
                    <option value="a-combinar">A combinar</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Candidatura'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

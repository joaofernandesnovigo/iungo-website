import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'helpdesk' | 'crm' | 'geral';
  videoUrl: string;
  thumbnail: string;
}

const tutorials: Tutorial[] = [
  // Tutoriais Helpdesk
  {
    id: '1',
    title: 'Como Acessar o Iungo Desk',
    description: 'Aprenda a fazer login e navegar pela interface do Iungo Desk',
    duration: '3:45',
    category: 'helpdesk',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=modern%20customer%20service%20agent%20using%20helpdesk%20software%20on%20computer%20screen%20with%20clean%20interface%20showing%20ticket%20management%20dashboard%20professional%20office%20environment%20bright%20lighting&width=640&height=360&seq=tutorial1&orientation=landscape'
  },
  {
    id: '2',
    title: 'Gerenciando Tickets',
    description: 'Como criar, atribuir e resolver tickets de suporte',
    duration: '5:20',
    category: 'helpdesk',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=customer%20support%20ticket%20management%20interface%20with%20status%20labels%20priority%20tags%20and%20conversation%20threads%20modern%20helpdesk%20software%20clean%20design%20professional%20workspace&width=640&height=360&seq=tutorial2&orientation=landscape'
  },
  {
    id: '3',
    title: 'Usando Filtros e Busca',
    description: 'Encontre tickets rapidamente usando filtros por status e prioridade',
    duration: '4:15',
    category: 'helpdesk',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=helpdesk%20software%20filter%20interface%20with%20dropdown%20menus%20search%20bar%20and%20sorting%20options%20modern%20clean%20design%20professional%20dashboard%20view&width=640&height=360&seq=tutorial3&orientation=landscape'
  },
  {
    id: '4',
    title: 'Conversas e Mensagens',
    description: 'Como responder tickets e gerenciar conversas com clientes',
    duration: '6:30',
    category: 'helpdesk',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=customer%20service%20chat%20conversation%20interface%20with%20message%20bubbles%20typing%20area%20and%20customer%20information%20panel%20modern%20helpdesk%20design%20professional%20environment&width=640&height=360&seq=tutorial4&orientation=landscape'
  },
  {
    id: '5',
    title: 'Configurando SLA e Automações',
    description: 'Configure regras de SLA e automações para otimizar seu atendimento',
    duration: '7:45',
    category: 'helpdesk',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=automation%20settings%20dashboard%20with%20workflow%20rules%20timers%20and%20configuration%20panels%20modern%20software%20interface%20clean%20design%20professional%20workspace&width=640&height=360&seq=tutorial5&orientation=landscape'
  },
  {
    id: '6',
    title: 'Gerenciando Equipe',
    description: 'Adicione agentes, configure permissões e gerencie sua equipe',
    duration: '5:50',
    category: 'helpdesk',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=team%20management%20interface%20with%20user%20profiles%20role%20assignments%20and%20permission%20settings%20modern%20dashboard%20clean%20design%20professional%20workspace&width=640&height=360&seq=tutorial6&orientation=landscape'
  },

  // Tutoriais CRM
  {
    id: '7',
    title: 'Primeiros Passos no Iungo CRM',
    description: 'Introdução ao CRM e configuração inicial',
    duration: '4:30',
    category: 'crm',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=modern%20crm%20dashboard%20with%20sales%20pipeline%20charts%20customer%20data%20and%20analytics%20overview%20clean%20interface%20professional%20business%20environment&width=640&height=360&seq=tutorial7&orientation=landscape'
  },
  {
    id: '8',
    title: 'Gerenciando Contatos e Empresas',
    description: 'Como adicionar e organizar seus contatos e empresas',
    duration: '5:40',
    category: 'crm',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=crm%20contact%20management%20interface%20with%20customer%20profiles%20company%20information%20and%20relationship%20data%20modern%20clean%20design%20professional%20workspace&width=640&height=360&seq=tutorial8&orientation=landscape'
  },
  {
    id: '9',
    title: 'Pipeline de Vendas',
    description: 'Gerencie oportunidades através do funil de vendas',
    duration: '6:20',
    category: 'crm',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=sales%20pipeline%20kanban%20board%20with%20deal%20cards%20stages%20and%20progress%20tracking%20modern%20crm%20interface%20clean%20design%20professional%20business%20environment&width=640&height=360&seq=tutorial9&orientation=landscape'
  },
  {
    id: '10',
    title: 'Criando Oportunidades',
    description: 'Como criar e acompanhar oportunidades de vendas',
    duration: '5:15',
    category: 'crm',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=crm%20opportunity%20creation%20form%20with%20deal%20details%20value%20fields%20and%20customer%20information%20modern%20interface%20clean%20design%20professional%20workspace&width=640&height=360&seq=tutorial10&orientation=landscape'
  },
  {
    id: '11',
    title: 'Relatórios e Análises',
    description: 'Gere relatórios e analise o desempenho de vendas',
    duration: '7:10',
    category: 'crm',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=business%20analytics%20dashboard%20with%20sales%20charts%20revenue%20graphs%20and%20performance%20metrics%20modern%20crm%20interface%20clean%20design%20professional%20environment&width=640&height=360&seq=tutorial11&orientation=landscape'
  },
  {
    id: '12',
    title: 'IA e Automação no CRM',
    description: 'Use inteligência artificial para otimizar suas vendas',
    duration: '8:00',
    category: 'crm',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=artificial%20intelligence%20crm%20interface%20with%20predictive%20analytics%20automation%20workflows%20and%20smart%20recommendations%20modern%20design%20professional%20workspace&width=640&height=360&seq=tutorial12&orientation=landscape'
  },

  // Tutoriais Gerais
  {
    id: '13',
    title: 'Integrações e API',
    description: 'Conecte o Iungo com outras ferramentas',
    duration: '6:45',
    category: 'geral',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=software%20integration%20dashboard%20with%20api%20connections%20third%20party%20apps%20and%20data%20sync%20settings%20modern%20interface%20clean%20design%20professional%20workspace&width=640&height=360&seq=tutorial13&orientation=landscape'
  },
  {
    id: '14',
    title: 'Configurações de Segurança',
    description: 'Configure permissões e proteja seus dados',
    duration: '5:30',
    category: 'geral',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=security%20settings%20interface%20with%20user%20permissions%20access%20controls%20and%20data%20protection%20options%20modern%20dashboard%20clean%20design%20professional%20environment&width=640&height=360&seq=tutorial14&orientation=landscape'
  },
  {
    id: '15',
    title: 'Personalização da Plataforma',
    description: 'Personalize a interface e configure preferências',
    duration: '4:50',
    category: 'geral',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://readdy.ai/api/search-image?query=platform%20customization%20interface%20with%20theme%20settings%20layout%20options%20and%20preference%20controls%20modern%20design%20clean%20workspace%20professional%20environment&width=640&height=360&seq=tutorial15&orientation=landscape'
  }
];

const categories = [
  { id: 'todos', label: 'Todos os Tutoriais', icon: 'ri-play-circle-line' },
  { id: 'helpdesk', label: 'Iungo Desk', icon: 'ri-customer-service-2-line' },
  { id: 'crm', label: 'Iungo CRM', icon: 'ri-line-chart-line' },
  { id: 'geral', label: 'Configurações Gerais', icon: 'ri-settings-3-line' }
];

export default function TutoriaisPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'todos' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-500 to-teal-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-video-line text-4xl"></i>
              </div>
              <h1 className="text-5xl font-bold mb-6">Vídeos Tutoriais</h1>
              <p className="text-xl text-teal-50 max-w-3xl mx-auto mb-8">
                Aprenda a usar todas as funcionalidades do Iungo com nossos tutoriais em vídeo passo a passo
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                  <input
                    type="text"
                    placeholder="Buscar tutoriais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-gray-50 border-b border-gray-200 sticky top-20 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === category.id
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <i className={`${category.icon} mr-2`}></i>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {filteredTutorials.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-search-line text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum tutorial encontrado</h3>
                <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-gray-600">
                    <strong className="text-gray-900">{filteredTutorials.length}</strong> {filteredTutorials.length === 1 ? 'tutorial encontrado' : 'tutoriais encontrados'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTutorials.map((tutorial) => (
                    <div
                      key={tutorial.id}
                      onClick={() => setSelectedVideo(tutorial)}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <i className="ri-play-fill text-3xl text-teal-500"></i>
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          {tutorial.duration}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            tutorial.category === 'helpdesk' 
                              ? 'bg-blue-100 text-blue-700'
                              : tutorial.category === 'crm'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {tutorial.category === 'helpdesk' && <i className="ri-customer-service-2-line mr-1"></i>}
                            {tutorial.category === 'crm' && <i className="ri-line-chart-line mr-1"></i>}
                            {tutorial.category === 'geral' && <i className="ri-settings-3-line mr-1"></i>}
                            {tutorial.category === 'helpdesk' ? 'Iungo Desk' : tutorial.category === 'crm' ? 'Iungo CRM' : 'Geral'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {tutorial.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Video Modal */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedVideo.title}</h2>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-2xl text-gray-600"></i>
                </button>
              </div>
              
              <div className="aspect-video bg-black">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <i className="ri-time-line mr-2"></i>
                    Duração: {selectedVideo.duration}
                  </span>
                  <span className="flex items-center">
                    {selectedVideo.category === 'helpdesk' && <i className="ri-customer-service-2-line mr-2"></i>}
                    {selectedVideo.category === 'crm' && <i className="ri-line-chart-line mr-2"></i>}
                    {selectedVideo.category === 'geral' && <i className="ri-settings-3-line mr-2"></i>}
                    {selectedVideo.category === 'helpdesk' ? 'Iungo Desk' : selectedVideo.category === 'crm' ? 'Iungo CRM' : 'Configurações Gerais'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-teal-500 to-teal-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-question-line text-4xl"></i>
            </div>
            <h2 className="text-4xl font-bold mb-6">Precisa de Mais Ajuda?</h2>
            <p className="text-xl text-teal-50 mb-8">
              Nossa equipe está pronta para ajudar você a aproveitar ao máximo o Iungo
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/manual-acesso"
                className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-book-open-line mr-2"></i>
                Ver Manual Completo
              </a>
              <a
                href="/contato"
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/30 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-customer-service-line mr-2"></i>
                Falar com Suporte
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  level: string;
  instructor: string;
  price: number;
}

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Iniciante' | 'Intermediário' | 'Avançado'>('all');

  useEffect(() => {
    document.title = 'Cursos de IA - Iungo Intelligence | Aprenda Inteligência Artificial';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cursos especializados em Inteligência Artificial para negócios. Aprenda com especialistas e transforme sua carreira com IA aplicada ao comércio digital.');
    }

    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800';
      case 'Intermediário':
        return 'bg-blue-100 text-blue-800';
      case 'Avançado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-iungo-navy to-iungo-blue text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Cursos de Inteligência Artificial
              </h1>
              <p className="text-xl text-iungo-light-gray mb-8">
                Aprenda com especialistas e domine as tecnologias de IA que estão transformando o mercado. 
                Cursos práticos e aplicados ao mundo real dos negócios.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/cursos/meus-cursos">
                  <Button variant="secondary" size="lg">
                    <i className="ri-book-open-line mr-2"></i>
                    Meus Cursos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'all'
                    ? 'bg-iungo-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos os Cursos
              </button>
              <button
                onClick={() => setFilter('Iniciante')}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'Iniciante'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Iniciante
              </button>
              <button
                onClick={() => setFilter('Intermediário')}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'Intermediário'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Intermediário
              </button>
              <button
                onClick={() => setFilter('Avançado')}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'Avançado'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Avançado
              </button>
            </div>
          </div>
        </section>

        {/* Lista de Cursos */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <i className="ri-loader-4-line text-4xl text-iungo-blue animate-spin"></i>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <i className="ri-book-line text-6xl text-gray-300 mb-4"></i>
                <p className="text-xl text-gray-500">Nenhum curso encontrado nesta categoria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <i className="ri-time-line mr-2"></i>
                        <span>{course.duration}</span>
                        <span className="mx-2">•</span>
                        <i className="ri-user-line mr-2"></i>
                        <span>{course.instructor}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-2xl font-bold text-iungo-blue">
                            R$ {course.price.toFixed(2)}
                          </span>
                        </div>
                        <Link to={`/cursos/${course.id}`}>
                          <Button variant="primary" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-iungo-navy to-iungo-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Pronto para Transformar sua Carreira?
            </h2>
            <p className="text-xl text-iungo-light-gray mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já estão dominando a Inteligência Artificial
            </p>
            <Link to="/contato">
              <Button variant="secondary" size="lg">
                <i className="ri-customer-service-2-line mr-2"></i>
                Fale com um Consultor
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

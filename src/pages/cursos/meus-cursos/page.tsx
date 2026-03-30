
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    duration: string;
    level: string;
    instructor: string;
  };
}

export default function MeusCursosPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    document.title = 'Meus Cursos - Iungo Intelligence';
    checkUserAndFetchEnrollments();
  }, []);

  const checkUserAndFetchEnrollments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/cursos/login');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          completed,
          enrolled_at,
          course:courses (
            id,
            title,
            description,
            thumbnail_url,
            duration,
            level,
            instructor
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/cursos/login');
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-iungo-navy to-iungo-blue text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Meus Cursos
                </h1>
                <p className="text-xl text-iungo-light-gray">
                  Continue sua jornada de aprendizado
                </p>
              </div>
              <div className="flex gap-4">
                <Link to="/cursos">
                  <Button variant="secondary" size="md">
                    <i className="ri-add-line mr-2"></i>
                    Explorar Cursos
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cursos Matriculados */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <i className="ri-loader-4-line text-4xl text-iungo-blue animate-spin"></i>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-20">
                <i className="ri-book-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  Você ainda não está matriculado em nenhum curso
                </h3>
                <p className="text-gray-500 mb-8">
                  Explore nosso catálogo e comece a aprender hoje mesmo!
                </p>
                <Link to="/cursos">
                  <Button variant="primary" size="lg">
                    <i className="ri-search-line mr-2"></i>
                    Explorar Cursos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover object-top"
                      />
                      {enrollment.completed && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          <i className="ri-check-line mr-1"></i>
                          Concluído
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {enrollment.course.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <i className="ri-time-line mr-2"></i>
                        <span>{enrollment.course.duration}</span>
                        <span className="mx-2">•</span>
                        <i className="ri-user-line mr-2"></i>
                        <span>{enrollment.course.instructor}</span>
                      </div>
                      
                      {/* Barra de Progresso */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progresso</span>
                          <span className="font-semibold">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-iungo-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Link to={`/cursos/${enrollment.course.id}`}>
                        <Button variant="primary" size="md" className="w-full whitespace-nowrap">
                          {enrollment.completed ? (
                            <>
                              <i className="ri-refresh-line mr-2"></i>
                              Revisar Curso
                            </>
                          ) : (
                            <>
                              <i className="ri-play-circle-line mr-2"></i>
                              Continuar Aprendendo
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

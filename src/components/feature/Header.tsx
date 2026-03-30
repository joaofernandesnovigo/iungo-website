import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const solutions = [
    { name: 'Organizer', href: '/solucoes/organizer' },
    { name: 'Behavior', href: '/solucoes/behavior' },
    { name: 'Concierge', href: '/solucoes/concierge' },
    { name: 'Resolve', href: '/solucoes/resolve' },
    { name: 'Convert', href: '/solucoes/convert' },
    { name: 'Attendant', href: '/solucoes/attendant' }
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSolutionsOpen(false);
    }, 200);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-iungo-light-gray">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/35c9460a02535ff31381e7f2d9069125.png" 
                alt="iungo Intelligence" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link to="/sobre" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer font-medium">
              Sobre
            </Link>
            <Link to="/plataforma" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer font-medium">
              AI Platform
            </Link>
            {/* Soluções Dropdown */}
            <div className="relative group">
              <button className="text-iungo-gray hover:text-iungo-navy transition-colors flex items-center whitespace-nowrap">
                Soluções
                <i className="ri-arrow-down-s-line ml-1"></i>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    to="/solucoes/organizer"
                    className="block px-4 py-2 text-iungo-gray hover:bg-iungo-light-gray hover:text-iungo-navy transition-colors"
                  >
                    Organizer
                  </Link>
                  <Link
                    to="/solucoes/behavior"
                    className="block px-4 py-2 text-iungo-gray hover:bg-iungo-light-gray hover:text-iungo-navy transition-colors"
                  >
                    Behavior
                  </Link>
                  <Link
                    to="/solucoes/concierge"
                    className="block px-4 py-2 text-iungo-gray hover:bg-iungo-light-gray hover:text-iungo-navy transition-colors"
                  >
                    Concierge
                  </Link>
                  <Link
                    to="/solucoes/resolve"
                    className="block px-4 py-2 text-iungo-gray hover:bg-iungo-light-gray hover:text-iungo-navy transition-colors"
                  >
                    Resolve
                  </Link>
                  <Link
                    to="/solucoes/convert"
                    className="block px-4 py-2 text-iungo-gray hover:bg-iungo-light-gray hover:text-iungo-navy transition-colors"
                  >
                    Convert
                  </Link>
                  <Link
                    to="/solucoes/attendant"
                    className="block px-4 py-2 text-iungo-gray hover:bg-iungo-light-gray hover:text-iungo-navy transition-colors"
                  >
                    Attendant
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/casos-de-uso" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer font-medium">
              Casos de Uso
            </Link>
            <Link to="/carreiras" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer font-medium">
              Carreiras
            </Link>
            <Link to="/contato" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer font-medium">
              Contato
            </Link>
            <Link to="/hd" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer font-medium">
              Portal do Cliente
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="cursor-pointer text-iungo-gray hover:text-iungo-primary transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-menu-line text-xl"></i>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-iungo-light-gray">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/sobre" className="block px-3 py-2 text-iungo-gray hover:text-iungo-primary hover:bg-iungo-light-gray transition-colors cursor-pointer rounded-lg">
                Sobre
              </Link>
              <Link to="/plataforma" className="block px-3 py-2 text-iungo-gray hover:text-iungo-primary hover:bg-iungo-light-gray transition-colors cursor-pointer rounded-lg">
                AI Platform
              </Link>
              <div className="px-3 py-2">
                <Link to="/solucoes" className="text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer">
                  Soluções
                </Link>
                <div className="ml-4 mt-2 space-y-1">
                  {solutions.map((solution) => (
                    <Link
                      key={solution.href}
                      to={solution.href}
                      className="block py-1 text-sm text-iungo-gray hover:text-iungo-primary transition-colors cursor-pointer"
                    >
                      {solution.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/casos-de-uso" className="block px-3 py-2 text-iungo-gray hover:text-iungo-primary hover:bg-iungo-light-gray transition-colors cursor-pointer rounded-lg">
                Casos de Uso
              </Link>
              <Link to="/carreiras" className="block px-3 py-2 text-iungo-gray hover:text-iungo-primary hover:bg-iungo-light-gray transition-colors cursor-pointer rounded-lg">
                Carreiras
              </Link>
              <Link to="/contato" className="block px-3 py-2 text-iungo-gray hover:text-iungo-primary hover:bg-iungo-light-gray transition-colors cursor-pointer rounded-lg">
                Contato
              </Link>
              <Link to="/hd" className="block px-3 py-2 text-iungo-gray hover:text-iungo-primary hover:bg-iungo-light-gray transition-colors cursor-pointer rounded-lg">
                Portal do Cliente
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

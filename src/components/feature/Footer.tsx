import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/a8fda7a3d00eb504ab99e83e5d149c0c.png"
                alt="iUngo Intelligence"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              A Plataforma de Inteligência Artificial de ponta a ponta para o Comércio Digital, 
              que unifica dados de produto, cliente e orquestração de jornada.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-iungo-accent cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-white/10 hover:bg-iungo-accent rounded-lg flex items-center justify-center transition-all">
                  <i className="ri-linkedin-fill text-xl"></i>
                </div>
              </a>
              <a href="#" className="text-white/70 hover:text-iungo-secondary cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-white/10 hover:bg-iungo-secondary rounded-lg flex items-center justify-center transition-all">
                  <i className="ri-twitter-fill text-xl"></i>
                </div>
              </a>
              <a href="#" className="text-white/70 hover:text-iungo-primary cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-white/10 hover:bg-iungo-primary rounded-lg flex items-center justify-center transition-all">
                  <i className="ri-facebook-fill text-xl"></i>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Soluções</h3>
            <ul className="space-y-3">
              <li><Link to="/solucoes/organizer" className="text-white/80 hover:text-iungo-accent cursor-pointer transition-colors">Organizer</Link></li>
              <li><Link to="/solucoes/behavior" className="text-white/80 hover:text-iungo-secondary cursor-pointer transition-colors">Behavior</Link></li>
              <li><Link to="/solucoes/concierge" className="text-white/80 hover:text-iungo-purple cursor-pointer transition-colors">Concierge</Link></li>
              <li><Link to="/solucoes/resolve" className="text-white/80 hover:text-iungo-teal cursor-pointer transition-colors">Resolve</Link></li>
              <li><Link to="/solucoes/convert" className="text-white/80 hover:text-iungo-tertiary cursor-pointer transition-colors">Convert</Link></li>
              <li><Link to="/solucoes/attendant" className="text-white/80 hover:text-iungo-pink cursor-pointer transition-colors">Attendant</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li><Link to="/sobre" className="text-white/80 hover:text-iungo-accent cursor-pointer transition-colors">Sobre Nós</Link></li>
              <li><Link to="/casos-de-uso" className="text-white/80 hover:text-iungo-secondary cursor-pointer transition-colors">Casos de Uso</Link></li>
              <li><Link to="/carreiras" className="text-white/80 hover:text-iungo-primary cursor-pointer transition-colors">Carreiras</Link></li>
              <li><Link to="/contato" className="text-white/80 hover:text-iungo-purple cursor-pointer transition-colors">Contato</Link></li>
              <li><Link to="/politica-privacidade" className="text-white/80 hover:text-iungo-accent cursor-pointer transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                {/* Imagem removida conforme solicitado */}
              </div>
            </div>

            <p className="text-white/70 text-sm">
              © 2024 Iungo Intelligence. Todos os direitos reservados.
            </p>

            <div className="mt-4 md:mt-0">
              <a href="https://readdy.ai/?origin=logo" className="text-white/70 text-sm hover:text-iungo-accent cursor-pointer transition-colors">
                Powered by Readdy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

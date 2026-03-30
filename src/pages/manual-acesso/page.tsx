import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function ManualAcesso() {
  const [activeTab, setActiveTab] = useState<'crm' | 'helpdesk'>('helpdesk');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <i className="ri-book-open-line text-4xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Manual de Acesso à Plataforma
            </h1>
            <p className="text-xl text-teal-50 max-w-3xl mx-auto">
              Guia completo passo a passo para acessar e utilizar todas as funcionalidades da Iungo Intelligence
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'helpdesk'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className="ri-customer-service-2-line mr-2"></i>
            Iungo Desk (Atendimento)
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className="ri-line-chart-line mr-2"></i>
            Iungo CRM (Vendas)
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'helpdesk' ? (
          <div className="space-y-12">
            {/* Acesso Iungo Desk */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-login-box-line text-2xl"></i>
                  </div>
                  Como Acessar o Iungo Desk
                </h2>
              </div>

              <div className="p-8 space-y-8">
                {/* Passo 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Acesse a Página de Login</h3>
                    <p className="text-gray-600 mb-4">
                      Abra seu navegador e acesse o link abaixo:
                    </p>
                    <div className="bg-gray-50 border-2 border-teal-200 rounded-lg p-4 flex items-center justify-between">
                      <code className="text-teal-600 font-mono text-sm">
                        https://iungo-ai.com/helpdesk/login
                      </code>
                      <Link
                        to="/helpdesk/login"
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-external-link-line mr-2"></i>
                        Acessar Agora
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Faça Login com suas Credenciais</h3>
                    <p className="text-gray-600 mb-4">
                      Digite seu e-mail e senha que você recebeu da equipe Iungo:
                    </p>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <i className="ri-mail-line mr-2 text-teal-500"></i>
                          E-mail
                        </label>
                        <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500">
                          seu@email.com
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <i className="ri-lock-line mr-2 text-teal-500"></i>
                          Senha
                        </label>
                        <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500">
                          ••••••••
                        </div>
                      </div>
                      <button className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors cursor-pointer whitespace-nowrap">
                        <i className="ri-login-box-line mr-2"></i>
                        Entrar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Acesse o Dashboard</h3>
                    <p className="text-gray-600 mb-4">
                      Após o login, você será direcionado para o dashboard principal:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        to="/helpdesk/cx/dashboard"
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                            <i className="ri-dashboard-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Dashboard</h4>
                        </div>
                        <p className="text-sm text-gray-600">Visão geral dos atendimentos</p>
                      </Link>

                      <Link
                        to="/helpdesk/cx/tickets"
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                            <i className="ri-ticket-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Tickets</h4>
                        </div>
                        <p className="text-sm text-gray-600">Gerenciar chamados</p>
                      </Link>

                      <Link
                        to="/helpdesk/cx/inbox"
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                            <i className="ri-message-3-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Inbox</h4>
                        </div>
                        <p className="text-sm text-gray-600">Chat em tempo real</p>
                      </Link>

                      <Link
                        to="/helpdesk/crm/contatos"
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                            <i className="ri-contacts-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Contatos</h4>
                        </div>
                        <p className="text-sm text-gray-600">Base de clientes</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Níveis de Acesso */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-shield-user-line text-2xl"></i>
                  </div>
                  Níveis de Acesso
                </h2>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Superadmin */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-vip-crown-line text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Superadmin</h3>
                    <p className="text-sm text-gray-600 mb-4">Acesso total ao sistema</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span className="text-gray-700">Gestão completa de usuários</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span className="text-gray-700">Configurações do sistema</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span className="text-gray-700">Deletar tickets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span className="text-gray-700">Todos os módulos</span>
                      </li>
                    </ul>
                  </div>

                  {/* Admin */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-admin-line text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Admin</h3>
                    <p className="text-sm text-gray-600 mb-4">Administrador de equipe</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span className="text-gray-700">Gestão de usuários</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span className="text-gray-700">Todos os tickets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span className="text-gray-700">Relatórios completos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span className="text-gray-700">Fechar/Reabrir tickets</span>
                      </li>
                    </ul>
                  </div>

                  {/* Agent */}
                  <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 rounded-xl p-6">
                    <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-user-settings-line text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Agent</h3>
                    <p className="text-sm text-gray-600 mb-4">Agente de suporte</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span className="text-gray-700">Tickets atribuídos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span className="text-gray-700">Chat com clientes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span className="text-gray-700">Visualizar contatos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span className="text-gray-700">Respostas prontas</span>
                      </li>
                    </ul>
                  </div>

                  {/* Customer */}
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-user-line text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Customer</h3>
                    <p className="text-sm text-gray-600 mb-4">Cliente</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span className="text-gray-700">Abrir chamados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span className="text-gray-700">Ver seus tickets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span className="text-gray-700">Chat com suporte</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span className="text-gray-700">Acompanhar status</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Problemas Comuns */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-question-line text-2xl"></i>
                  </div>
                  Problemas Comuns e Soluções
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded-r-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <i className="ri-error-warning-line text-red-500 mr-2"></i>
                    Esqueci minha senha
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Na tela de login, clique em "Esqueceu sua senha?" e siga as instruções para redefinir.
                  </p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                    Você receberá um e-mail com o link para criar uma nova senha.
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 bg-orange-50 p-6 rounded-r-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <i className="ri-error-warning-line text-orange-500 mr-2"></i>
                    Não recebi minhas credenciais
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Entre em contato com o administrador do sistema ou com o suporte Iungo.
                  </p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                    📧 E-mail: suporte@iungo-ai.com | 📱 Telefone: (11) 4152-6525
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-6 rounded-r-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <i className="ri-error-warning-line text-yellow-500 mr-2"></i>
                    Erro ao fazer login
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Verifique se está usando o e-mail e senha corretos. Certifique-se de que o Caps Lock está desativado.
                  </p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                    Se o problema persistir, limpe o cache do navegador ou tente em modo anônimo.
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <i className="ri-information-line text-blue-500 mr-2"></i>
                    Não tenho acesso a alguma funcionalidade
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Seu nível de acesso pode não permitir essa funcionalidade. Consulte seu administrador.
                  </p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                    Cada nível de usuário tem permissões específicas. Veja a seção "Níveis de Acesso" acima.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Acesso CRM */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-login-box-line text-2xl"></i>
                  </div>
                  Como Acessar o Iungo CRM
                </h2>
              </div>

              <div className="p-8 space-y-8">
                {/* Passo 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Acesse a Página de Login</h3>
                    <p className="text-gray-600 mb-4">
                      Abra seu navegador e acesse o link abaixo:
                    </p>
                    <div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between">
                      <code className="text-blue-600 font-mono text-sm">
                        https://iungo-ai.com/crm/login
                      </code>
                      <Link
                        to="/crm/login"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-external-link-line mr-2"></i>
                        Acessar Agora
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Faça Login com suas Credenciais</h3>
                    <p className="text-gray-600 mb-4">
                      Digite seu e-mail e senha corporativos:
                    </p>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <i className="ri-mail-line mr-2 text-blue-600"></i>
                          E-mail
                        </label>
                        <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500">
                          seu@empresa.com
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <i className="ri-lock-line mr-2 text-blue-600"></i>
                          Senha
                        </label>
                        <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500">
                          ••••••••
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap">
                        <i className="ri-login-box-line mr-2"></i>
                        Entrar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Explore os Módulos do CRM</h3>
                    <p className="text-gray-600 mb-4">
                      Após o login, você terá acesso a todos os módulos de vendas:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-dashboard-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Dashboard</h4>
                        </div>
                        <p className="text-sm text-gray-600">Visão geral de vendas</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-contacts-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Contatos</h4>
                        </div>
                        <p className="text-sm text-gray-600">Gestão de clientes</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-building-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Empresas</h4>
                        </div>
                        <p className="text-sm text-gray-600">Base de empresas</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-line-chart-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Pipeline</h4>
                        </div>
                        <p className="text-sm text-gray-600">Funil de vendas</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-bar-chart-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">Relatórios</h4>
                        </div>
                        <p className="text-sm text-gray-600">Análises e métricas</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-robot-line text-white text-xl"></i>
                          </div>
                          <h4 className="font-bold text-gray-900">IA Calculus</h4>
                        </div>
                        <p className="text-sm text-gray-600">Assistente inteligente</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Funcionalidades CRM */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-function-line text-2xl"></i>
                  </div>
                  Principais Funcionalidades
                </h2>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-user-add-line text-blue-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Gestão de Contatos</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Cadastre e gerencie todos os seus clientes e prospects em um só lugar.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span>Histórico completo de interações</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span>Segmentação inteligente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-blue-500 mt-0.5"></i>
                        <span>Importação em massa</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-git-merge-line text-purple-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Pipeline de Vendas</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Visualize e gerencie todas as oportunidades em cada etapa do funil.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span>Arrastar e soltar entre etapas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span>Previsão de fechamento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-purple-500 mt-0.5"></i>
                        <span>Alertas automáticos</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-robot-2-line text-teal-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">IA Calculus</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Assistente de IA que analisa dados e sugere ações estratégicas.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span>Análise preditiva de vendas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span>Recomendações personalizadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-teal-500 mt-0.5"></i>
                        <span>Insights em tempo real</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="ri-file-chart-line text-orange-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Relatórios Avançados</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Dashboards completos com todas as métricas de vendas.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span>Performance por vendedor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span>Taxa de conversão</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-check-line text-orange-500 mt-0.5"></i>
                        <span>Exportação para Excel</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Precisa de Ajuda?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudá-lo a começar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
            >
              <i className="ri-customer-service-line mr-2"></i>
              Falar com Suporte
            </Link>
            <a
              href="mailto:suporte@iungo-ai.com"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
            >
              <i className="ri-mail-line mr-2"></i>
              suporte@iungo-ai.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

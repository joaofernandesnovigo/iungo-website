
import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  const benefits = [
    {
      icon: 'ri-ticket-2-line',
      title: 'Abertura de Chamados',
      description:
        'Registre suas solicitações de forma rápida e organizada, com acompanhamento em tempo real.',
    },
    {
      icon: 'ri-time-line',
      title: 'Histórico Completo',
      description:
        'Acesse todo o histórico de interações e acompanhe a evolução de cada atendimento.',
    },
    {
      icon: 'ri-notification-3-line',
      title: 'Notificações Automáticas',
      description:
        'Receba atualizações por e-mail sempre que houver novidades nos seus chamados.',
    },
    {
      icon: 'ri-attachment-2',
      title: 'Anexos e Documentos',
      description:
        'Envie arquivos, imagens e documentos para facilitar a resolução do seu problema.',
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Segurança Total',
      description:
        'Seus dados estão protegidos com criptografia e acesso restrito à sua conta.',
    },
    {
      icon: 'ri-customer-service-2-line',
      title: 'Suporte Especializado',
      description:
        'Nossa equipe está pronta para ajudar você com atendimento personalizado.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/9b6a7cb2a8e2dbc199b2b5247d5e284a.png"
                alt="Iungo Intelligence"
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/hd/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Entrar
              </Link>
              <Link
                to="/hd/registro"
                className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-200 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-300 rounded-full opacity-40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-slate-100 to-slate-200 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-slate-700 text-sm font-medium mb-6">
                <i className="ri-customer-service-2-line" />
                Portal do Cliente
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                Seu canal direto de
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">
                  {' '}
                  suporte
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Abra chamados, acompanhe o status das suas solicitações e mantenha contato direto com
                nossa equipe de suporte especializada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/hd/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all shadow-lg cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-login-box-line text-lg" />
                  Acessar Portal
                </Link>
                <Link
                  to="/hd/registro"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-400 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-user-add-line text-lg" />
                  Criar Conta Grátis
                </Link>
              </div>
            </div>

            {/* Ilustração */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <i className="ri-customer-service-2-line text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Central de Suporte</h3>
                    <p className="text-sm text-slate-500">Iungo Intelligence</p>
                  </div>
                </div>

                {/* Mock tickets */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <i className="ri-time-line text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        Dúvida sobre integração API
                      </p>
                      <p className="text-xs text-slate-500">Em andamento</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full whitespace-nowrap">
                      Pendente
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        Configuração de webhook
                      </p>
                      <p className="text-xs text-slate-500">Resolvido em 2h</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full whitespace-nowrap">
                      Resolvido
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <i className="ri-message-3-line text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        Solicitação de nova feature
                      </p>
                      <p className="text-xs text-slate-500">Aguardando resposta</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full whitespace-nowrap">
                      Aberto
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-700">98%</p>
                    <p className="text-xs text-slate-500">Satisfação</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-700">&lt;2h</p>
                    <p className="text-xs text-slate-500">Tempo médio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-700">24/7</p>
                    <p className="text-xs text-slate-500">Disponível</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/30 rotate-12">
                <i className="ri-headphone-line text-white text-3xl" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-600/30 -rotate-12">
                <i className="ri-chat-smile-3-line text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nosso Portal do Cliente foi desenvolvido para oferecer a melhor experiência de
              suporte
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 border border-transparent hover:border-slate-200"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                  <i className={`${benefit.icon} text-2xl text-slate-700`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Como funciona?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Em poucos passos você já pode começar a usar nosso portal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Crie sua conta</h3>
              <p className="text-slate-600">Cadastre-se gratuitamente em menos de 1 minuto com seu e-mail</p>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Abra um chamado</h3>
              <p className="text-slate-600">Descreva sua solicitação e anexe arquivos se necessário</p>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Acompanhe</h3>
              <p className="text-slate-600">Receba atualizações e interaja com nossa equipe em tempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para começar?</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                Crie sua conta agora e tenha acesso ao melhor suporte para suas necessidades
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/hd/registro"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-all shadow-lg cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-user-add-line text-lg" />
                  Criar Conta Grátis
                </Link>
                <Link
                  to="/hd/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-600/30 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-slate-600/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-login-box-line text-lg" />
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/9b6a7cb2a8e2dbc199b2b5247d5e284a.png"
                alt="Iungo Intelligence"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Iungo Intelligence. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/politica-privacidade"
                className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Política de Privacidade
              </Link>
              <Link to="/contato" className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

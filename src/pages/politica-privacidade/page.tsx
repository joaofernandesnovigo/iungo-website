import { useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function PoliticaPrivacidade() {
  useEffect(() => {
    document.title = 'Política de Privacidade - Iungo Intelligence';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-iungo-navy mb-8">
          Política de Privacidade
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-4">
              1. INTRODUÇÃO
            </h2>
            <p className="text-iungo-gray leading-relaxed mb-4">
              Nós, da <strong>IUNGO</strong>, nos preocupamos com privacidade e proteção de dados pessoais. Entendemos que os dados pessoais são bens valiosos e que devem ser preservados. Por isso você precisa saber exatamente como eles podem ser utilizados. Para que você possa entender e aproveitar dos serviços que oferecemos, precisamos que você conheça nossa Política de Privacidade.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-4">
              2. OBJETIVO
            </h2>
            <p className="text-iungo-gray leading-relaxed mb-4">
              Esta Política de Privacidade regerá as relações entre <strong>IUNGO</strong> e:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-iungo-gray">
              <li>
                <strong>Clientes</strong>, assim considerados todas as pessoas jurídicas que mantém relação direta com a IUNGO, mediante contratos de prestação de serviços.
              </li>
              <li>
                <strong>Usuários</strong>, assim considerados os eventuais titulares de dados pessoais cujos dados vierem a ser objeto de tratamento por parte da IUNGO em razão de sua relação com os Clientes.
              </li>
              <li>
                <strong>Colaboradores</strong>, assim considerados todos os administradores, sócios, funcionários, estagiários, parceiros, terceiros prestadores de serviços, representantes, e/ou fornecedores da IUNGO.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              CONCEITOS JURÍDICOS
            </h2>
            <p className="text-iungo-gray leading-relaxed mb-6">
              Em relação aos dados pessoais, dentre outras, temos as seguintes conceituações jurídicas:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-iungo-light-gray">
                <h3 className="text-lg font-bold text-iungo-navy mb-3">
                  Controlador
                </h3>
                <p className="text-iungo-gray leading-relaxed">
                  É a posição ocupada por nossos clientes e seus representantes, considerando que este é o responsável por tomar as decisões estratégicas quanto ao tratamento de dados pessoais e, por esta razão, contratou os serviços prestados pela IUNGO.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-iungo-light-gray">
                <h3 className="text-lg font-bold text-iungo-navy mb-3">
                  Operador
                </h3>
                <p className="text-iungo-gray leading-relaxed">
                  É a posição ocupada pela IUNGO, considerando que esta realizará alguns dos atos de tratamento de dados necessários à prestação de serviços ao cliente, conforme contratos firmados entre as partes, ou mesmo quando, antes da contratação, atos necessários para alinhamentos negociais entre IUNGO e a empresa interessada.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-iungo-light-gray">
                <h3 className="text-lg font-bold text-iungo-navy mb-3">
                  Titular
                </h3>
                <p className="text-iungo-gray leading-relaxed">
                  É a posição ocupada por todo e qualquer indivíduo (pessoa física), em relação aos dados pessoais objeto de tratamento pela IUNGO.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-iungo-light-gray">
                <h3 className="text-lg font-bold text-iungo-navy mb-3">
                  Tratamento
                </h3>
                <p className="text-iungo-gray leading-relaxed">
                  Toda operação realizada com dados pessoais, como as que se referem: a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-4">
              3. APLICAÇÃO
            </h2>
            <p className="text-iungo-gray leading-relaxed">
              Esta Política é pública, especialmente para conhecimento de todos os colaboradores da IUNGO, independentemente do nível hierárquico, e, no que couber, também: aos acionistas e; aos prestadores de serviço, fornecedores, demais parceiros comerciais da IUNGO, além de outras pessoas que trabalhem nas dependências da IUNGO e/ou representem a IUNGO perante terceiros.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              4. DEFINIÇÕES
            </h2>
            
            <h3 className="text-xl font-bold text-iungo-navy mb-4">
              DADOS PESSOAIS
            </h3>
            <p className="text-iungo-gray leading-relaxed mb-4">
              Para os fins desta Política de Privacidade, considera-se como dado pessoal, toda a informação que se refere a um indivíduo – aqui tratado como "terceiro(s)" ou "titular(es)" – desde que o identifique de plano, ou permita sua identificação, considerado o conjunto de dados existentes a seu respeito na base de dados da IUNGO.
            </p>
            <p className="text-iungo-gray leading-relaxed mb-4">
              Como <strong>dado pessoal sensível</strong>, toda informação pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.
            </p>
            <p className="text-iungo-gray leading-relaxed mb-6">
              Será considerado <strong>dado anonimizado</strong>, toda informação relativa ao titular que não possa ser identificada, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento.
            </p>

            <h3 className="text-xl font-bold text-iungo-navy mb-4 mt-8">
              DOS PROCESSOS DE TRATAMENTO DE DADOS PESSOAIS
            </h3>
            <p className="text-iungo-gray leading-relaxed mb-4">
              A IUNGO é uma empresa que fornece soluções de Inteligência Artificial (IA) para operações digitais nos segmentos de varejo, mercado financeiro, turismo, manufatura, educação e saúde.
            </p>
            <p className="text-iungo-gray leading-relaxed mb-4">
              A IUNGO apenas realiza atos de tratamento em relação aos dados pessoais que forem:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-iungo-gray mb-6">
              <li>
                Informados pelo próprio titular durante a navegação em algum dos sites, domínios, subdomínios e demais aplicações de Internet de titularidade do Usuário, da IUNGO ou do Cliente; ou
              </li>
              <li>
                Foram disponibilizados diretamente pelo Cliente à IUNGO, na relação contratual de Controlador (cliente) x Operador (IUNGO).
              </li>
            </ul>

            <div className="bg-iungo-light-gray/30 p-6 rounded-lg border border-iungo-light-gray mb-6">
              <p className="text-iungo-gray leading-relaxed mb-4">
                Para os casos em que os dados pessoais são enviados pelo Controlador, a IUNGO exige contratualmente do Controlador (cliente) que o compartilhamento ou permissão de tratamento direto com a IUNGO seja devidamente informada ao Titular, de forma clara e transparente.
              </p>
              <p className="text-iungo-gray leading-relaxed">
                Para estes casos, na qualidade de Operadora, tendo em vista que não coletamos dados pessoais diretamente dos titulares, nos termos do artigo 18 da Lei 13709/2018, a IUNGO não irá atender às solicitações de titulares sobre confirmação da existência de tratamento de dados dos titulares, bem como pedidos de exclusão, bloqueio ou anonimização de dados pessoais perante a base de dados da IUNGO.
              </p>
            </div>

            <p className="text-iungo-gray leading-relaxed mb-4">
              Toda solicitação neste sentido deverá ser realizada pelo titular diretamente ao Controlador que, por sua vez, após verificação da legitimidade da solicitação, caso seja necessário, demandará a IUNGO, que dará atenção individual a cada solicitação. Isto porque a IUNGO ordinariamente trata dados desestruturados que somente o cliente (Controlador) terá informações suficientes e capazes de identificar o usuário.
            </p>

            <div className="bg-iungo-accent/10 border-l-4 border-iungo-accent p-6 rounded-r-lg">
              <p className="text-iungo-navy leading-relaxed">
                Para os casos em que forem coletados dados pessoais de usuários quando estes atuam em nome de empresas interessadas nos serviços IUNGO, às solicitações de titulares sobre confirmação da existência de tratamento de dados, bem como pedidos de exclusão, bloqueio ou anonimização de dados pessoais serão atendidos diretamente pela IUNGO. As solicitações neste sentido poderão ser realizadas através do e-mail <a href="mailto:dpo@iungo-ai.com" className="font-bold text-iungo-navy underline hover:text-iungo-accent">dpo@iungo-ai.com</a>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              5. QUAIS DADOS TRATAMOS? POR QUE OS TRATAMOS? ATÉ QUANDO TRATAMOS?
            </h2>
            
            <p className="text-iungo-gray leading-relaxed mb-4">
              O tratamento de dados pessoais realizado pela IUNGO compreende os dados de usuários, conforme os padrões de coleta, tratamento e compartilhamento propostos pelo cliente, quando na condição de Controlador de Dados Pessoais. Tal compartilhamento ocorre a partir dos dados de navegação obtidos nos seus sites, domínios, subdomínios e demais aplicações de Internet do Controlador (cliente), que proporcionam o contato direito com os usuários, na condição de titulares de dados pessoais.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              Os dados pessoais são tratados em razão dos serviços prestados pela IUNGO ao cliente ou interessados e tem como finalidade específica a viabilização, promoção e o desenvolvimento das atividades do cliente ou interessados, para que os titulares possam usufruir de toda experiência e comodidades oferecidas.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              A base legal que autoriza o tratamento dos dados pela IUNGO está conferida no artigo 7º, IX, da Lei 13709/2018 (LGPD).
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              O tratamento de dados têm por finalidade o direcionamento de informações de acordo com os interesses que a tecnologia desenvolvida pela IUNGO entende que um determinado Titular possui, a partir de análises preditivas e meramente estimativas.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              Isso pode ocorrer também de forma anônima, sem identificação de um titular específico, por exemplo, com dados necessários para a formação de perfis úteis para análise preditiva de dados (ex: o indivíduo 'A' "pode ser mulher" (pois, demonstra interesse consumindo conteúdos feitos para mulheres), possui idade entre 30 e 35 anos, possui interesses em moda feminina esportiva e suplementos alimentares).
            </p>

            <p className="text-iungo-gray leading-relaxed mb-6">
              Para os casos em que os usuários fornecem informações em nome de Empresas interessadas nos serviços oferecidos pela IUNGO, a coleta e processamento dos dados tem o único objetivo de viabilizar as tratativas negociais entre as PARTES.
            </p>

            <h3 className="text-xl font-bold text-iungo-navy mb-4 mt-8">
              Período de Armazenamento
            </h3>
            <p className="text-iungo-gray leading-relaxed mb-4">
              Os dados dos titulares permanecerão no banco de dados da IUNGO nas seguintes hipóteses:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-iungo-gray mb-6">
              <li>
                Durante a vigência do contrato entre a IUNGO e o cliente (controlador) responsável pelo compartilhamento do dado pessoal;
              </li>
              <li>
                Até a solicitação expressa do Controlador ou ordem legal de autoridade pública competente para que o dado pessoal seja eliminado, bloqueado ou anonimizado;
              </li>
              <li>
                Durante a vigência do contrato entre IUNGO e o Colaborador, ou pelo tempo necessário que justifique a manutenção das informações para fins de cumprimento da legislação nacional.
              </li>
            </ul>

            <p className="text-iungo-gray leading-relaxed mb-4">
              A IUNGO irá descartar ou anonimizar dados pessoais que estejam fora da finalidade pretendida para execução do serviço contratado pelos clientes ou da finalidade da relação contratual com o colaborador.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-6">
              A IUNGO poderá, a seu critério, anonimizar dados pessoais que sejam necessários para pesquisas ou aprimoramento de suas tecnologias. Os dados pessoais que forem anonimizados, ou seja, aqueles dados que não tornam possível a identificação de seu titular, não estão sujeitos às normas estabelecidas pela LGPD, nos termos do artigo 12 da Lei nº 13.709/2018.
            </p>

            <h3 className="text-xl font-bold text-iungo-navy mb-4 mt-8">
              Compartilhamento e Segurança
            </h3>
            <p className="text-iungo-gray leading-relaxed mb-4">
              A IUNGO não compartilha dados pessoais de Usuários com clientes ou terceiros, exceto aqueles com a finalidade exclusiva de permitir a prestação dos serviços da IUNGO. A IUNGO é uma empresa parceira da Tencent contando com todo suporte e infraestrutura dos serviços de Nuvem Tencent Cloud disponibilizados. O serviço de Nuvem contratado da Tencent detém os mais altos padrões de segurança da informação utilizados no mercado internacional para garantir, além da eficiência na troca de informações, a confidencialidade necessária aos dados pessoais armazenados.
            </p>

            <div className="bg-iungo-light-gray/30 p-6 rounded-lg border border-iungo-light-gray mb-6">
              <p className="text-iungo-gray leading-relaxed mb-4">
                Em atendimento ao artigo 33 da Lei 13709/2018, informamos que o datacenter do serviço de Nuvem Tencent Cloud está alocado no Estado de Virgínia, nos EUA, sendo responsabilidade dos Clientes (Controladores) informarem e solicitarem o devido consentimento dos titulares.
              </p>
              <p className="text-iungo-gray leading-relaxed">
                A alocação do datacenter nos Estados Unidos permite que a IUNGO tenha acesso em primeira mão às novas tecnologias desenvolvidas pela Tencent, as atualizações e aos constantes upgrades, serviços que muitas vezes demoram para serem disponibilizados no Brasil. Com isso, todos os clientes e usuários usufruem das melhores e mais inovadoras experiências trazidas pela IUNGO, entregando tecnologia de ponta com o transporte de informações mais eficiente e seguro.
              </p>
            </div>

            <div className="bg-iungo-accent/10 border-l-4 border-iungo-accent p-6 rounded-r-lg">
              <p className="text-iungo-navy leading-relaxed font-medium">
                Não será objeto de tratamento pela IUNGO os dados sensíveis eventualmente coletados pelos Clientes, sendo vedado o seu repasse. Caso seja identificado algum dado sensível no banco de dados da IUNGO, ele será imediatamente descartado.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              6. SEGURANÇA DA INFORMAÇÃO
            </h2>
            
            <div className="bg-iungo-accent/10 border-l-4 border-iungo-accent p-6 rounded-r-lg mb-6">
              <p className="text-iungo-navy font-bold text-lg">
                Todos os dados pessoais estão seguros com a IUNGO!
              </p>
            </div>

            <p className="text-iungo-gray leading-relaxed mb-4">
              Todas as atividades de tratamento executadas pela IUNGO contam com controles, sistemas e medidas técnicas e administrativas adequadas aos padrões de mercado para garantir a confidencialidade, integridade e disponibilidade de seus dados, bem como que os mesmos serão utilizados apenas para finalidades legítimas.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              A IUNGO compromete-se a manter sua tecnologia de forma adequada frente aos padrões de privacidade de dados estabelecidos pela legislação brasileira e às melhores práticas aplicáveis.
            </p>

            <p className="text-iungo-gray leading-relaxed">
              Saiba também como a Tencent protege seus dados pessoais em{' '}
              <a 
                href="https://www.tencentcloud.com/pt/document/product/301/17345" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-iungo-accent font-medium underline hover:text-iungo-navy"
              >
                https://www.tencentcloud.com/pt/document/product/301/17345
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              7. DEVERES DOS CLIENTES
            </h2>
            
            <p className="text-iungo-gray leading-relaxed mb-6">
              São deveres dos Clientes IUNGO:
            </p>

            <ul className="list-disc pl-6 space-y-4 text-iungo-gray">
              <li className="leading-relaxed">
                Dar grau de proteção de dados pessoais adequado aos atos de tratamento por si realizados, inclusive em relação à licitude do compartilhamento/uso compartilhado de dados pessoais de Usuários em favor da IUNGO, dando fiel e integral atendimento à legislação aplicável, especialmente em relação às Leis Federais nº 12.965/2014 (Marco Civil da Internet) e 13.709/2018 (Lei Geral de Proteção de Dados);
              </li>
              <li className="leading-relaxed">
                Dar ciência clara, transparente e inequívoca aos usuários de seus sites, domínios, subdomínios e demais aplicações de Internet – no que couber, a respeito desta Política de Privacidade, no que couber, bem como a respeito da coleta de dados;
              </li>
              <li className="leading-relaxed">
                Implementar em sua política de privacidade os esclarecimentos necessários ao usuário, a respeito da coleta de dados de navegação por parte da IUNGO, bem como o objetivo de tal coleta associado a veiculação de informações direcionadas, publicidade mais relevante e um melhor conhecimento de suas preferências para otimização da experiência, disponibilizando opção para que o usuário que não concorde com os termos de uso de seus sites não tenha sua navegação monitorada, ainda que de forma anônima, devendo o Cliente, neste caso, informar da disponibilidade do serviço público para internautas desabilitarem a coleta de dados de navegação do seu browser, devendo o Cliente, dar ciência de tais esclarecimentos de modo que atenda esta finalidade;
              </li>
              <li className="leading-relaxed">
                Comunicar à IUNGO, em tempo hábil para a adoção das providências necessárias, as solicitações de usuários apresentadas diretamente ao Cliente quanto ao exercício de seus direitos enquanto titulares de dados pessoais para evitar tais violações, ou, quando impossível impedi-las, mitigar os riscos inerentes ao caso concreto.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              8. DA FIXAÇÃO DE RESPONSABILIDADES PELO TRATAMENTO DE DADOS PESSOAIS ENTRE CONTROLADOR (CLIENTE) E OPERADOR (IUNGO)
            </h2>
            
            <p className="text-iungo-gray leading-relaxed mb-4">
              Em relação aos dados pessoais de usuários compartilhados pelo cliente com a IUNGO, a partir da prestação dos serviços regulados em contrato, a IUNGO possui responsabilidade tão-somente quanto à segurança da informação – confidencialidade, integridade e disponibilidade – dos dados pessoais tratados. Eventuais outras responsabilidades imputadas pelo titular dos dados, terceiros e autoridades governamentais recaem exclusivamente sobre o cliente, que responderá regressivamente perante a IUNGO por eventuais prejuízos suportados administrativa e/ou judicialmente.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              Em razão da prestação de serviços pela IUNGO em favor do cliente, toda e qualquer possibilidade de violação à proteção de dados de usuários relacionados ao cliente deverão ser comunicadas à IUNGO em tempo hábil para a adoção das providências necessárias para evitar tais violações, ou, quando impossível impedi-las, mitigar os riscos inerentes ao caso concreto, sob pena de responsabilização exclusiva do cliente.
            </p>

            <p className="text-iungo-gray leading-relaxed mb-4">
              Reconhece o cliente que a IUNGO apenas realiza o tratamento de dados pessoais para prestar seus serviços, em cumprimento das obrigações contratuais assumidas perante o cliente, não possuindo responsabilidade pelos atos de tratamento de dados pessoais de titulares realizados fora da execução do escopo contratual, tampouco sobre os atos realizados para o atendimento de solicitações do próprio titular.
            </p>

            <p className="text-iungo-gray leading-relaxed">
              A Política de Privacidade da IUNGO se aplica exclusivamente aos serviços por ela prestados, não se responsabilizando por outros serviços eventualmente regulados por Políticas de Privacidade autônomas que não integrem esta Política de Privacidade.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              9. DEVERES DA IUNGO COM SEUS COLABORADORES
            </h2>
            
            <p className="text-iungo-gray leading-relaxed mb-6">
              Na relação com seus colaboradores, a IUNGO atuará como Controladora de dados pessoais e o tratamento dos dados coletados se dará da seguinte forma:
            </p>

            <ul className="list-disc pl-6 space-y-4 text-iungo-gray mb-6">
              <li className="leading-relaxed">
                Todos os dados pessoais dos colaboradores serão armazenados em bancos de dados próprios e reservados, proporcionando a segurança das informações coletadas pela IUNGO. Os dados pessoais coletados dos colaboradores serão utilizados para fins de celebração do contrato de prestação de serviço ou de trabalho (i.e. dados cadastrais, filiação a sindicato, endereço, nomes dos genitores, escolaridade, situação familiar, nomes dos filhos, idade, tipo sanguíneo), além de outras situações que serão solicitadas e informadas o Colaborador, de acordo com a necessidade do contrato.
              </li>
              <li className="leading-relaxed">
                Poderá ser solicitado o cadastro biométrico para controle de acesso e ponto do Empregado no ambiente de trabalho da Empregadora.
              </li>
              <li className="leading-relaxed">
                Os dados do Colaborador poderão ser repassados a convênios médicos, planos de saúde, vales-refeição, vales-alimentação, vales-transporte, E-Social, consultorias contratadas, SESMT, ou qualquer outro parceiro fundamentais para execução das atividades contratadas.
              </li>
              <li className="leading-relaxed">
                Mesmo em razão do encerramento das relações contratuais com o Colaborador, a IUNGO manterá os dados necessários ao cumprimento de obrigações legais, previdenciárias, tributárias e fundiárias.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              10. CONHEÇA SEUS DIREITOS COMO TITULAR
            </h2>
            
            <p className="text-iungo-gray leading-relaxed mb-6">
              Como titulares de dados pessoais, usuários poderão solicitar aos Controladores:
            </p>

            <ul className="list-disc pl-6 space-y-3 text-iungo-gray mb-6">
              <li className="leading-relaxed">
                Confirmação de que estamos tratando seus dados pessoais;
              </li>
              <li className="leading-relaxed">
                Acesso aos seus dados que eventualmente tratamos;
              </li>
              <li className="leading-relaxed">
                Correção de dados incompletos, inexatos ou desatualizados;
              </li>
              <li className="leading-relaxed">
                Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;
              </li>
              <li className="leading-relaxed">
                A portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa e compatibilidade técnica;
              </li>
              <li className="leading-relaxed">
                A eliminação dos dados pessoais tratados com o consentimento do titular, exceto nas hipóteses previstas no art. 16 da LGPD;
              </li>
              <li className="leading-relaxed">
                Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;
              </li>
              <li className="leading-relaxed">
                Possibilidade de revogação do consentimento.
              </li>
            </ul>

            <div className="bg-iungo-light-gray/30 p-6 rounded-lg border border-iungo-light-gray">
              <p className="text-iungo-gray leading-relaxed">
                Para garantir sua segurança e evitar que terceiros exerçam tais direitos, os Controladores deverão solicitar informações para a identificação do requisitante, sendo-lhes reservado o direito de não dar atendimento a solicitações, sempre que estas não forem possíveis de serem cumpridas, ou essenciais para a continuidade da prestação dos serviços, quando destinados ao atendimento do titular, ou havendo respaldo legal.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              11. DISPOSIÇÕES FINAIS
            </h2>
            
            <div className="bg-iungo-accent/10 border-l-4 border-iungo-accent p-6 rounded-r-lg mb-6">
              <h3 className="text-lg font-bold text-iungo-navy mb-3">
                NOSSO CONTATO
              </h3>
              <p className="text-iungo-navy leading-relaxed mb-4">
                <strong>IUNGO INTELLIGENCE LTDA</strong>, pessoa jurídica de direito privado, devidamente inscrita no CNPJ/MF sob o nº 63.246.325/0001-79, com sede na Cidade de São Paulo, Estado de São Paulo, na Av. Brigadeiro Faria Lima, nº 1234, conj. 111, Jardim Paulistano, CEP 01451-913.
              </p>
              <p className="text-iungo-navy leading-relaxed">
                Para maiores esclarecimentos ou saber como exercer algum de seus direitos ligados à proteção de dados pessoais, você pode fazer contato com o <strong>Rafael Atma Mendes</strong>, nosso Guardião da Proteção de Dados, através do e-mail{' '}
                <a href="mailto:dpo@iungo-ai.com" className="font-bold underline hover:text-iungo-accent">
                  dpo@iungo-ai.com
                </a>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-iungo-navy mb-6">
              12. HISTÓRICO DE REVISÕES
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-iungo-light-gray">
                <thead className="bg-iungo-navy text-white">
                  <tr>
                    <th className="border border-iungo-light-gray px-4 py-3 text-left font-semibold">VERSÃO</th>
                    <th className="border border-iungo-light-gray px-4 py-3 text-left font-semibold">DATA DE ELABORAÇÃO</th>
                    <th className="border border-iungo-light-gray px-4 py-3 text-left font-semibold">REVISÃO</th>
                    <th className="border border-iungo-light-gray px-4 py-3 text-left font-semibold">AUTOR</th>
                    <th className="border border-iungo-light-gray px-4 py-3 text-left font-semibold">APROVAÇÃO</th>
                    <th className="border border-iungo-light-gray px-4 py-3 text-left font-semibold">HISTÓRICO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border border-iungo-light-gray px-4 py-3 text-iungo-gray">01</td>
                    <td className="border border-iungo-light-gray px-4 py-3 text-iungo-gray">19/11/2025</td>
                    <td className="border border-iungo-light-gray px-4 py-3 text-iungo-gray">Criação do documento</td>
                    <td className="border border-iungo-light-gray px-4 py-3 text-iungo-gray">Rafael Atma Mendes</td>
                    <td className="border border-iungo-light-gray px-4 py-3 text-iungo-gray">Douglas Kocsis</td>
                    <td className="border border-iungo-light-gray px-4 py-3 text-iungo-gray font-semibold">C</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-iungo-gray mt-3 italic">
                C = Criação | R = Revisão
              </p>
            </div>
          </section>

          <div className="bg-iungo-accent/10 border-l-4 border-iungo-accent p-6 rounded-r-lg mt-12">
            <p className="text-iungo-navy font-medium">
              <strong>Área:</strong> Compliance
            </p>
            <p className="text-iungo-navy font-medium mt-2">
              <strong>Data da Divulgação:</strong> 19/11/2025
            </p>
            <p className="text-iungo-navy font-medium mt-2">
              <strong>Data da Revisão:</strong> 19/11/2025
            </p>
            <p className="text-iungo-navy font-medium mt-2">
              <strong>Versão:</strong> 01
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

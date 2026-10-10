// Conteúdo do site AUPROIN. Edite aqui e rode `node src/build.mjs`.

// Fonte canônica pública. O domínio próprio é independente do endereço do
// repositório e deve ser usado em canonical, Open Graph, schema, sitemap e llms.
// Em prévias locais, pode ser sobrescrito: SITE_URL=... node src/build.mjs
export const siteUrl = 'https://auproin.com.br';

// Atualize somente quando o conteúdo público mudar. Manter a data explícita
// torna o build reproduzível e evita alterar todo o sitemap a cada execução.
export const ultimaAtualizacao = '2026-10-10';

export const empresa = {
  nome: 'AUPROIN',
  nomeCompleto: 'AUPROIN — Automação de Processos Industriais',
  razaoSocial: 'Paulo José da Silva Souza Automação de Processos Industriais Ltda',
  cnpj: '63.652.491/0001-75',
  crt: '270698738-32',
  responsavel: 'Paulo José da Silva Souza',
  cargo: 'Responsável Técnico e Diretor Executivo',
  telefone: '(15) 98801-6442',
  telefoneUrl: '+5515988016442',
  whatsapp: '5515988016442',
  email: 'paulo.souza@auproin.com.br',
  cidade: 'Alumínio/SP',
  linkedin: 'https://www.linkedin.com/in/paulo-souza-auproin-automacao',
  regiao: 'Alumínio, Mairinque, São Roque, Votorantim, Araçariguama, Iperó, Sorocaba, Itu e região',
};

export const waTextoPadrao = 'Olá Paulo, quero agendar um Diagnóstico de Automação na minha planta.';
export const waTextoParceiro = 'Olá Paulo, sou de uma integradora/montadora de painéis e quero conversar sobre uma parceria em programação e comissionamento.';

export const sintomas = [
  'Programa de CLP sem backup, sem comentários e sem documentação — ninguém sabe o que a máquina faz.',
  'Só o fabricante original consegue mexer no equipamento, e cada chamado custa caro e demora.',
  'Parada crônica que se repete há meses e ninguém consegue provar a causa.',
  'CLP ou IHM obsoletos, sem peça de reposição no mercado.',
  'Máquina antiga sem adequação à NR-12, travando auditoria ou liberação de seguro.',
  'Supervisório com centenas de alarmes que o operador aprendeu a ignorar.',
  'Comando por relés e contatores, sem diagnóstico algum para a manutenção.',
  'Dados de processo existem, mas não viram indicador de produção nem de consumo.',
];

export const diagnostico = [
  'Situação real do programa de CLP e do supervisório: backup, documentação e riscos.',
  'Levantamento de obsolescência de hardware e software.',
  'Lista priorizada das causas de parada.',
  'Plano de ação com estimativa de prazo e investimento por item.',
];

export const casos = [
  {
    n: '01',
    slug: 'retrofit-clp-ihm',
    area: 'Retrofit e modernização de máquina',
    titulo: 'Máquina comandada por relés vira máquina com CLP, IHM e diagnóstico',
    subtitulo: 'Retrofit de comando eletromecânico para arquitetura CLP + IHM em máquina de blocos de concreto',
    metaDescricao: 'Retrofit de comando eletromecânico para CLP + IHM em máquina de blocos de concreto: 196 pontos de I/O mapeados, 98 alarmes classificados por ISA-18.2 e lógica sequencial documentada.',
    situacao: 'A máquina operava com o comando original de fábrica: seletor rotativo passo a passo, contatores e relés. Não havia programa, diagrama atualizado nem qualquer diagnóstico — quando a máquina parava, a manutenção descobria a causa por tentativa e erro, medindo bornes. Componentes do comando já estavam fora de linha, e a lógica de operação existia apenas na cabeça de quem operava o equipamento há anos.',
    feito: [
      'Levantamento em campo e engenharia reversa da lógica: reconstrução documentada de toda a sequência de operação a partir do comando existente, transformada em descritivo funcional aprovado antes de programar.',
      'Mapeamento de 196 pontos de I/O em duas camadas, com tabela de símbolos global e POUs de leitura e escrita de I/O com arquitetura de override — o programa fica legível e a manutenção consegue forçar um ponto sem quebrar a lógica.',
      'Nova arquitetura CLP + IHM com CLP Delta série AS e interface de operação, substituindo integralmente o comando eletromecânico.',
      'Base mestre de 98 alarmes classificados e priorizados segundo ISA-18.2 / IEC 62682, com telas de intertravamento e interface de alta performance segundo ISA-101.',
      'Análise da distribuição 24 Vcc com estudo de seletividade e adequação documental conforme IEC 61082, 81346 e 61355 — a máquina passou a ter documentação elétrica coerente com a instalação real.',
    ],
    resultado: 'A máquina saiu de zero diagnóstico para um sistema em que operador e mantenedor veem na tela exatamente qual condição impede a partida ou derrubou o ciclo. Acabou a dependência de componentes de comando obsoletos e do conhecimento não documentado, e a planta passou a ter programa comentado, lista de I/O e descritivo funcional em mãos — sem depender do fabricante original para qualquer alteração.',
    numeros: [
      { v: '196', l: 'pontos de I/O mapeados e documentados' },
      { v: '98', l: 'alarmes classificados por ISA-18.2' },
      { v: '0 → 100%', l: 'da lógica sequencial documentada' },
      { v: '3 normas', l: 'IEC 61082, 81346 e 61355 atendidas' },
    ],
    plataforma: 'Plataforma: CLP Delta série AS (DIADesigner) e IHM · Linguagens: Ladder e SCL · Normas: ISA-18.2 / IEC 62682, ISA-101, NR-12, IEC 61082 / 81346 / 61355 · Também aplicável em: Siemens S7-1200 e S7-1500 (TIA Portal), com migração de IHM.',
    gancho: 'Tem máquina antiga rodando em relé, sem documentação e sem peça de reposição?',
    pdf: 'assets/pdf/AUPROIN_Ficha_01_Retrofit_CLP_IHM.pdf',
    foto: 'assets/img/painel-ihm-porta.jpg',
    fotoAlt: 'IHM Siemens montada na porta de painel de comando em aço inox',
  },
  {
    n: '02',
    slug: 'primeira-causa-first-out',
    area: 'Diagnóstico de paradas e falhas crônicas',
    titulo: 'Parada de emergência com 28 causas possíveis, identificada em segundos',
    subtitulo: 'Sistema de detecção de primeira causa (first-out) para eventos de emergência em conversor metalúrgico',
    metaDescricao: 'Detecção de primeira causa (first-out) em SCL sobre Siemens S7-1500: matriz de 28 condições e telas ISA-101 que mostram em uma tela o evento que derrubou o processo.',
    situacao: 'O equipamento entrava em condição de emergência e o supervisório mostrava um conjunto de alarmes disparando praticamente ao mesmo tempo. Como todas as condições apareciam juntas, ninguém conseguia provar qual delas causou a parada — a discussão entre operação, manutenção e processo se repetia a cada evento, e a mesma falha voltava porque a causa real nunca era isolada.',
    feito: [
      'Matriz de 28 condições levantada com operação e manutenção, cobrindo todas as origens possíveis do evento de emergência.',
      'Blocos de captura de primeira causa em SCL sobre CLP Siemens S7-1515-2 PN (TIA Portal V17): o programa congela a primeira condição que mudou de estado e a mantém registrada até o reconhecimento, separando causa de consequência.',
      'Telas de diagnóstico segundo ISA-101 no supervisório, mostrando em uma única tela o evento que derrubou o processo, o horário e as condições que vieram depois.',
      'Engenharia de alarmes: novas classes de alarme ISA no WinCC RT Professional, lista formal de alarmes e priorização — sem enterrar a informação útil em ruído.',
    ],
    resultado: 'O tempo entre a parada e a identificação da causa raiz caiu de uma investigação com várias pessoas para uma consulta de tela. Com a causa registrada evento a evento, passou a existir base de dados para atacar as falhas recorrentes por frequência — o mesmo método usado para eliminar definitivamente falhas crônicas de eletrônica de potência em fontes retificadoras e fontes de fornos.',
    numeros: [
      { v: '28', l: 'condições na matriz de primeira causa' },
      { v: '1 tela', l: 'para identificar a causa da parada' },
      { v: 'SCL', l: 'código parametrizado e replicável' },
      { v: 'ISA-101', l: 'interface de alta performance' },
    ],
    plataforma: 'Plataforma: Siemens S7-1500 (TIA Portal V17), WinCC RT Professional e AVEVA InTouch · Normas: ISA-18.2 / IEC 62682 e ISA-101 · Método: PDCA, MASP, FMEA, Ishikawa, 5 Porquês e Pareto, com dados de processo em alta velocidade (IbaPDA e Iba Analyzer).',
    gancho: 'Tem uma parada crônica que se repete e ninguém consegue provar a causa?',
    pdf: 'assets/pdf/AUPROIN_Ficha_02_Primeira_Causa_First_Out.pdf',
    foto: 'assets/img/painel-ihm-calcinador.jpg',
    fotoAlt: 'Painel de comando com IHM Siemens mostrando a tela do sistema de exaustão',
  },
  {
    n: '03',
    slug: 'projeto-e-comissionamento',
    area: 'Projeto, montagem e comissionamento',
    titulo: 'Do diagrama unifilar à planta produzindo: projeto, montagem e start-up',
    subtitulo: 'Projeto de automação de grande porte com centenas de pontos de I/O e comissionamento de plantas completas',
    metaDescricao: 'Projeto de automação com centenas de pontos de I/O em 6 CLPs, 4 IHMs e 2 sistemas SCADA, montagem de painéis e comissionamento a frio e a quente até a posta em marcha.',
    situacao: 'Implantação de plantas de processo novas — forno de indução primário, refino de metais com vaso AOD, granulação e sistemas auxiliares de refrigeração, despoeiramento e dosagem controlada de insumos. O escopo exigia um único responsável técnico da concepção ao start-up: projeto elétrico e de automação, especificação de dispositivos, coordenação da montagem em campo, comissionamento e entrega à produção.',
    feito: [
      'Projeto de automação com centenas de pontos de I/O distribuídos em 6 CLPs, 4 IHMs e 2 sistemas SCADA, incluindo descritivo funcional e lista de I/O.',
      'Arquitetura e topologia da rede industrial entre as camadas de campo, controle, supervisão e gerenciamento da produção — Profinet, Profibus-DP, Modbus TCP, AS-i e IO-Link.',
      'Projeto elétrico de painéis de comando, distribuição e potência (diagrama de blocos, unifilar e multifilar) conforme NBR 5410, NBR IEC 61439 e NR-10, com dimensionamento e especificação de todos os dispositivos e da instrumentação de campo.',
      'Coordenação da equipe na montagem e instalação dos painéis e na interligação elétrica entre painéis, máquinas e equipamentos.',
      'Comissionamento a frio e a quente, loop check, testes ponto a ponto e posta em marcha, incluindo recebimento e validação de equipamentos de fabricantes nacionais e estrangeiros.',
    ],
    resultado: 'Plantas entregues em operação, com a automação documentada e a equipe da fábrica treinada para sustentar o sistema. Integrações de porte no mesmo escopo: conjunto de potência de 7,5 MVA com retificador de 12 pulsos (4 MW) em forno a arco elétrico de corrente contínua de 40 t, e fonte de 4 MW com forno de indução de 20 t ligados aos sistemas de refrigeração e despoeiramento, com operação centralizada em supervisório.',
    numeros: [
      { v: '6 CLPs', l: '4 IHMs e 2 sistemas SCADA' },
      { v: '7,5 MVA', l: 'conjunto de potência integrado' },
      { v: '600 mil t/ano', l: 'planta de laminação comissionada' },
      { v: '28 anos', l: 'de start-ups industriais' },
    ],
    plataforma: 'Plataforma: Siemens S7-1200, S7-1500, S7-300/400 e ET200SP; WinCC RT Professional, AVEVA InTouch e GE iFix; IHM Siemens KTP e Weintek · Acionamentos: Siemens Sinamics e MasterDrives, WEG CFW, ABB ACS880, Delta C2000 e conversores CA/CC · Normas: NBR 5410, NBR IEC 61439, NR-10 e NR-12.',
    gancho: 'Vai instalar equipamento novo ou ampliar a planta e precisa de responsável técnico pelo controle?',
    pdf: 'assets/pdf/AUPROIN_Ficha_03_Projeto_e_Comissionamento.pdf',
    foto: 'assets/img/painel-clp-montagem.jpg',
    fotoAlt: 'Interior de painel de comando com CLP Siemens, borneiras e relés de interface',
  },
  {
    n: '04',
    slug: 'dados-e-indicadores',
    area: 'Dados de processo e indicadores',
    titulo: 'Dados que já existiam na máquina, transformados em indicador e em menos perda',
    subtitulo: 'Aquisição de dados de processo, painel de KPIs em tempo real e modelo preditivo de falha',
    metaDescricao: 'Aquisição de dados com IbaPDA, painel de KPIs em tempo real (kWh/t e t/h) e modelo preditivo que reduziu em 25% a ocorrência de um modo de falha recorrente.',
    situacao: 'Os sinais de processo estavam disponíveis no CLP e nos acionamentos, mas não viravam informação de gestão: consumo de energia por tonelada, taxa de produção e estabilidade do processo eram estimados no fim do mês, e um modo de falha recorrente na linha gerava perda de material sem que houvesse sinal de aviso antes da ocorrência.',
    feito: [
      'Aquisição de dados em alta velocidade com IbaPDA e análise com Iba Analyzer; mapa de sinais definido a partir do que a operação precisa decidir, não do que é fácil coletar.',
      'Plataforma de monitoramento em tempo real com coleta em nível 0/1, banco de dados, camada de KPI e aplicação web acessível pela fábrica.',
      'Indicadores operacionais de consumo específico de energia (kWh/t), taxa de produção (t/h) e estabilidade do processo, disponíveis durante o turno e não depois dele.',
      'Modelo preditivo (machine learning) para detecção e previsão de um modo de falha recorrente, treinado sobre o histórico de processo da própria linha.',
      'Integração com a camada de gestão via servidores e clientes OPC entre nível 1, 2 e MES, sustentando a rastreabilidade do produto.',
    ],
    resultado: 'Redução de 25% na ocorrência do modo de falha alvo, com o indicador acompanhado em tempo real pela operação. Como efeito colateral do mesmo trabalho, a padronização de software substituiu 26 redes redundantes em Ladder por dois blocos funcionais parametrizados, documentados e replicáveis — menos código para manter e menos lugar para o erro se esconder.',
    numeros: [
      { v: '25%', l: 'de redução no modo de falha alvo' },
      { v: 'kWh/t', l: 'consumo específico em tempo real' },
      { v: '26 → 2', l: 'redes de Ladder viraram blocos' },
      { v: 'Nível 0 a 3', l: 'do campo ao MES' },
    ],
    plataforma: 'Plataforma: IbaPDA e Iba Analyzer; servidores e clientes OPC; banco de dados e aplicação web; CLP Siemens S7-300/400 e S7-1500 · Entregas típicas: mapa de sinais, estrutura de KPI, painel operacional e procedimento de análise de perdas.',
    gancho: 'Sua planta gera dados que ninguém usa para decidir nada?',
    pdf: 'assets/pdf/AUPROIN_Ficha_04_Dados_e_Indicadores.pdf',
    foto: 'assets/img/painel-ihm-calcinador.jpg',
    fotoAlt: 'Tela de supervisório em IHM na porta de painel de comando',
  },
];

const caso = (slug) => casos.find((c) => c.slug === slug);

export const servicos = [
  {
    n: '01',
    slug: 'clp-ihm-scada',
    titulo: 'Programação de CLP, IHM e SCADA',
    tituloCurto: 'Programação de CLP, IHM e SCADA',
    metaTitulo: 'Programação de CLP, IHM e SCADA em Sorocaba e região',
    metaDescricao: 'Programação de CLP, IHM e SCADA em projeto novo, retrofit e migração de plataforma. Siemens TIA Portal, WinCC, InTouch e iFix, com responsabilidade técnica formal. Alumínio/SP.',
    resumo: 'Projeto novo, retrofit e migração de plataforma. Lógica de intertravamento, sequenciamento e diagnóstico; alarmes e telas que a operação consegue usar.',
    chamada: 'CLP, IHM e SCADA em projeto novo, retrofit e migração de plataforma. Mapeamento e remapeamento de I/O, lógica de intertravamento, sequenciamento e diagnóstico, parametrização de inversores, configuração e diagnóstico de redes industriais.',
    problema: [
      'Programa de CLP sem backup, sem comentários e sem documentação — ninguém sabe o que a máquina faz.',
      'Só o fabricante original consegue mexer no equipamento, e cada chamado custa caro e demora.',
      'Supervisório com centenas de alarmes que o operador aprendeu a ignorar.',
      'Parada crônica que se repete há meses e ninguém consegue provar a causa.',
    ],
    metodo: [
      'Levantamento de requisitos e descritivo funcional aprovado antes de programar.',
      'Mapeamento de I/O em camadas, tabela de símbolos global e blocos parametrizados, documentados e replicáveis.',
      'Sistemas de detecção de primeira causa (first-out) e telas de intertravamento para separar causa de consequência.',
      'Racionalização de alarmes ISA-18.2 / IEC 62682 e telas de alta performance ISA-101.',
      'Eliminação de falhas crônicas com PDCA, MASP, FMEA e Ishikawa.',
    ],
    entrega: [
      'Backup do programa comentado.',
      'Lista de I/O e descritivo funcional.',
      'Lista formal de alarmes, classificada e priorizada.',
      'Procedimentos e treinamento de operação e manutenção.',
    ],
    plataformas: 'CLP Siemens S7-1200, S7-1500, S7-300/400, S7-200 e ET200SP (TIA Portal, STEP 7 Manager e MicroWin); Delta série AS (DIADesigner). Linguagens IEC 61131-3: Ladder, FBD, STL e SCL. SCADA e IHM: Siemens WinCC RT Professional; AVEVA InTouch 2020 R2; GE Digital iFix 3.5, 5.1 e 6.1; IHM Siemens KTP700 Basic, KTP900 e KTP1500 Comfort; Weintek (EasyBuilder Pro); Delta DOP-3S. Redes: Profinet, Profibus-DP, Modbus TCP, TCP/IP, AS-i e IO-Link; servidores e clientes OPC entre nível 1, 2 e MES.',
    caso: caso('primeira-causa-first-out'),
    foto: 'assets/img/painel-ihm-porta.jpg',
    fotoAlt: 'IHM Siemens instalada na porta de painel de comando',
  },
  {
    n: '02',
    slug: 'retrofit-modernizacao',
    titulo: 'Retrofit e modernização de máquina',
    tituloCurto: 'Retrofit e modernização',
    metaTitulo: 'Retrofit e modernização de máquina — CLP, IHM e NR-12',
    metaDescricao: 'Retrofit de máquina industrial: troca de comando por relés ou de CLP e IHM obsoletos por arquitetura atual, com lógica reconstruída, documentada e adequação NR-12. São Roque, Sorocaba e região.',
    resumo: 'Comando por relés, CLP ou IHM obsoletos e máquina sem NR-12: nova arquitetura CLP + IHM com a lógica reconstruída e documentada.',
    chamada: 'Substituição de comando eletromecânico ou de CLP e IHM fora de linha por arquitetura CLP + IHM atual, com levantamento em campo, reconstrução documentada da lógica e adequação normativa — sem depender do fabricante original.',
    problema: [
      'CLP ou IHM obsoletos, sem peça de reposição no mercado.',
      'Comando por relés e contatores, sem diagnóstico algum para a manutenção.',
      'Máquina antiga sem adequação à NR-12, travando auditoria ou liberação de seguro.',
      'A lógica de operação existe apenas na cabeça de quem opera o equipamento há anos.',
    ],
    metodo: [
      'Levantamento em campo e engenharia reversa da lógica existente, transformada em descritivo funcional aprovado antes de programar.',
      'Migração de plataforma de CLP e IHM com mapeamento de I/O em camadas e arquitetura de override.',
      'Base de alarmes classificados segundo ISA-18.2 e telas de intertravamento ISA-101.',
      'Adequação NR-12 e análise da distribuição 24 Vcc com estudo de seletividade.',
      'Documentação elétrica conforme IEC 61082, 81346 e 61355, coerente com a instalação real.',
    ],
    entrega: [
      'Máquina com CLP e IHM atuais, com diagnóstico na tela.',
      'Programa comentado, lista de I/O e descritivo funcional.',
      'Documentação elétrica atualizada.',
      'Treinamento de operação e manutenção.',
    ],
    plataformas: 'CLP Siemens S7-1200 e S7-1500 (TIA Portal) e Delta série AS (DIADesigner); IHM Siemens KTP, Weintek e Delta DOP-3S; inversores Siemens Sinamics, WEG CFW, ABB ACS880 e Delta C2000. Normas: NR-12, ISA-18.2 / IEC 62682, ISA-101, IEC 61082 / 81346 / 61355.',
    caso: caso('retrofit-clp-ihm'),
    foto: 'assets/img/painel-clp-montagem.jpg',
    fotoAlt: 'Painel de comando com CLP Siemens e borneiras identificadas',
  },
  {
    n: '03',
    slug: 'projeto-eletrico-paineis',
    titulo: 'Projeto elétrico e de painéis',
    tituloCurto: 'Projeto elétrico e de painéis',
    metaTitulo: 'Projeto elétrico e de painéis industriais — NBR 5410 e IEC 61439',
    metaDescricao: 'Projeto elétrico de painéis de comando, distribuição e potência: diagrama de blocos, unifilar e multifilar, dimensionamento e especificação conforme NBR 5410, NBR IEC 61439 e NR-10.',
    resumo: 'Painéis de comando, distribuição e potência — bloco, unifilar e multifilar — com dimensionamento e especificação conforme NBR 5410, NBR IEC 61439 e NR-10.',
    chamada: 'Projeto elétrico de painéis de comando, distribuição e potência (diagrama de blocos, unifilar e multifilar), dimensionamento e especificação de dispositivos e instrumentação, e arquitetura da rede industrial entre campo, controle, supervisão e gestão.',
    problema: [
      'Equipamento novo ou ampliação de planta sem projeto elétrico e de automação integrados.',
      'Painéis sem diagrama atualizado, sem documentação coerente com a instalação real.',
      'Rede industrial montada sem arquitetura, com falhas de comunicação difíceis de diagnosticar.',
    ],
    metodo: [
      'Diagrama de blocos, unifilar e multifilar conforme NBR 5410, NBR IEC 61439 e NR-10.',
      'Dimensionamento e especificação de dispositivos e instrumentação de campo.',
      'Arquitetura e topologia da rede industrial — Profinet, Profibus-DP, Modbus TCP, AS-i e IO-Link.',
      'Documentação elétrica IEC 61082, 81346 e 61355; descritivo funcional e lista de I/O.',
      'Coordenação da equipe na montagem, instalação e interligação elétrica.',
    ],
    entrega: [
      'Projeto elétrico completo dos painéis.',
      'Lista de dispositivos e instrumentação especificada.',
      'Arquitetura de rede documentada.',
      'Descritivo funcional e lista de I/O.',
    ],
    plataformas: 'Normas: NBR 5410, NBR IEC 61439, NR-10 e NR-12; documentação IEC 61082, 81346 e 61355. Redes: Profinet, Profibus-DP, Modbus TCP, TCP/IP, AS-i e IO-Link. Acionamentos: Siemens Sinamics G120 e S120, MasterDrives e MicroMaster, Simoreg DC-Master; WEG CFW500, CFW700 e CFW11; ABB ACS880; Delta C2000; motores CA e CC de média e alta potência.',
    caso: caso('projeto-e-comissionamento'),
    foto: 'assets/img/painel-clp-montagem.jpg',
    fotoAlt: 'Interior de painel elétrico com disjuntores, contatores e cabeamento identificado',
  },
  {
    n: '04',
    slug: 'comissionamento-startup',
    titulo: 'Comissionamento e start-up',
    tituloCurto: 'Comissionamento e start-up',
    metaTitulo: 'Comissionamento e start-up industrial — loop check e posta em marcha',
    metaDescricao: 'Comissionamento a frio e a quente, loop check, testes ponto a ponto, start-up assistido e apoio em parada programada, com responsável técnico e habilitações vigentes.',
    resumo: 'Comissionamento a frio e a quente, loop check, testes ponto a ponto, start-up assistido e apoio em parada programada.',
    chamada: 'Comissionamento a frio e a quente, loop check e testes ponto a ponto, start-up assistido, apoio em parada programada e treinamento de operação e manutenção — com recebimento e validação de equipamentos de fabricantes nacionais e estrangeiros.',
    problema: [
      'Equipamento chegando de fabricante nacional ou estrangeiro sem responsável técnico pelo controle na sua planta.',
      'Parada programada com janela curta e sem equipe de automação disponível.',
      'Planta nova entregue sem documentação e sem a equipe treinada para sustentar o sistema.',
    ],
    metodo: [
      'Comissionamento a frio: loop check e testes ponto a ponto contra a lista de I/O.',
      'Comissionamento a quente e posta em marcha com a operação.',
      'Start-up assistido e apoio em parada programada.',
      'Recebimento e validação de equipamentos de fabricantes nacionais e estrangeiros.',
      'Treinamento de operação e manutenção antes da entrega.',
    ],
    entrega: [
      'Relatório de comissionamento.',
      'Backup do programa comentado e lista de I/O validada.',
      'Equipe da fábrica treinada.',
      'Planta em operação, documentada.',
    ],
    plataformas: 'Siemens S7-1200, S7-1500, S7-300/400 e ET200SP; WinCC RT Professional, AVEVA InTouch e GE iFix; inversores Siemens, WEG, ABB e Delta; redes Profinet, Profibus-DP, Modbus TCP, AS-i e IO-Link. Diária de campo ou hora técnica para comissionamento, parada programada e suporte pontual. Habilitação: NR-10 e SEP, NR-12, NR-35, ASO e CFT/CRT vigentes.',
    caso: caso('projeto-e-comissionamento'),
    foto: 'assets/img/painel-ihm-calcinador.jpg',
    fotoAlt: 'Painel de comando em campo durante comissionamento, com IHM em operação',
  },
];

export const parceiros = {
  colunas: [
    {
      titulo: 'Programação e integração',
      itens: [
        'CLP, IHM e SCADA em projeto novo, retrofit e migração de plataforma.',
        'Mapeamento e remapeamento de I/O; lógica de intertravamento, sequenciamento e diagnóstico.',
        'Parametrização de inversores; configuração e diagnóstico de redes industriais.',
      ],
    },
    {
      titulo: 'Comissionamento e campo',
      itens: [
        'Comissionamento a frio e a quente, loop check e testes ponto a ponto.',
        'Start-up assistido e apoio em parada programada.',
        'Treinamento de operação e manutenção.',
      ],
    },
    {
      titulo: 'Engenharia normativa e documentação',
      itens: [
        'Auditoria e revisão de programa de CLP.',
        'Racionalização de alarmes ISA-18.2 / IEC 62682 e telas de alta performance ISA-101.',
        'Adequação NR-12; documentação elétrica IEC 61082, 81346 e 61355; descritivo funcional e lista de I/O.',
      ],
    },
  ],
  como: [
    { n: '01', titulo: 'Contratação', texto: 'Por escopo fechado ou por diária de campo, conforme o formato do seu contrato.' },
    { n: '02', titulo: 'NDA e não-solicitação', texto: 'Assinados antes do início. A AUPROIN não aborda comercialmente o cliente do parceiro, durante nem após o serviço.' },
    { n: '03', titulo: 'Entrega documentada', texto: 'Backup do programa comentado, lista de I/O, descritivo funcional e relatório de comissionamento — o parceiro entrega ao cliente final com a sua marca.' },
    { n: '04', titulo: 'Responsabilidade formal', texto: 'Registro ativo no CFT/CRT, com emissão de TRT dentro das atribuições do técnico em eletrotécnica.' },
  ],
  referencias: [
    'Integração de conjunto de potência de 7,5 MVA com retificador de 12 pulsos (4 MW) a forno a arco elétrico de corrente contínua de 40 t — arquitetura de rede industrial, CLP S7-1500 e supervisório WinCC RT Professional.',
    'Integração de fonte de 4 MW e forno de indução de 20 t aos sistemas de refrigeração e despoeiramento — rede Profinet, comunicação S7 entre CLPs e operação centralizada em WinCC.',
    'Modernização de máquina de blocos de concreto: substituição de CLP e migração de IHM, com racionalização de 98 alarmes segundo ISA-18.2 e arquitetura de I/O em duas camadas.',
    'Sistema de detecção de primeira causa (first-out) em SCL para conversor metalúrgico, com integração ao supervisório AVEVA InTouch.',
  ],
  disponibilidade: [
    'Mobilização em 15 a 20 dias a partir do aceite, mediante programação de agenda. Dentro da janela contratada, dedicação integral ao escopo.',
    'Base em Alumínio/SP. Atendimento presencial no Estado de São Paulo e disponibilidade para viagem.',
    'Documentação para acesso a planta: CNPJ ativo, NR-10 e SEP, NR-35, ASO e registro CFT/CRT vigentes.',
  ],
};

export const sobre = {
  resumo: '28 anos de experiência em implantação e suporte de projetos de automação industrial, atuando do levantamento de requisitos ao start-up e à sustentação da operação, em plantas de siderurgia, metalurgia, fundição e materiais de construção. Técnico em Eletrotécnica com registro ativo no CFT/CRT, com atribuição para responsabilidade técnica e emissão de TRT.',
  ficha: [
    { k: 'Experiência', v: '28 anos em automação industrial' },
    { k: 'Registro', v: 'CFT/CRT 270698738-32 — ativo, com emissão de TRT' },
    { k: 'Setores', v: 'Siderurgia, metalurgia, fundição e materiais de construção' },
    { k: 'Razão social', v: 'Paulo José da Silva Souza Automação de Processos Industriais Ltda' },
    { k: 'CNPJ', v: '63.652.491/0001-75' },
    { k: 'Base', v: 'Alumínio/SP — atendimento em Sorocaba e região' },
  ],
  trajetoria: [
    { quando: '2026 – atual', org: 'AUPROIN — Automação de Processos Industriais', papel: 'Responsável Técnico e Consultor Sênior em Automação Industrial · Alumínio/SP' },
    { quando: '2022 – 2025', org: 'Moxba Metalúrgica do Brasil', papel: 'Especialista de Elétrica e Automação · Araçariguama/SP' },
    { quando: '2006 – 2022', org: 'Gerdau Aços Longos', papel: 'Técnico de Automação de Processos de Laminação; Técnico de Manutenção Elétrica' },
    { quando: '1998 – 2006', org: 'CBA — Companhia Brasileira de Alumínio', papel: 'Oficial de Manutenção · Alumínio/SP' },
  ],
  formacao: [
    'Engenharia de Controle e Automação — Faculdade Ampli, em andamento (conclusão prevista para 2028).',
    'Técnico em Eletrotécnica — ETE Rubens de Faria e Souza, 1998. Registro ativo no CFT/CRT.',
    'NR-10 e SEP, NR-12 e NR-35; ASO vigente.',
    'Programação de CLP e IHM Siemens (STEP 7 e TIA Portal); inversores Sinamics, MasterDrives e Simoreg; SCADA WinCC RT, iFix e InTouch; redes Profibus-DP; robô KUKA KRC4; IbaPDA e IbaAnalyzer.',
  ],
};

// Perguntas reais de gerente de manutenção. Viram seção na home e FAQPage
// no schema.org — é o que o Google usa para resposta direta e o que um LLM lê
// quando alguém pergunta "quem faz retrofit de CLP em Sorocaba".
export const faq = [
  {
    p: 'Quanto tempo leva um Diagnóstico de Automação?',
    r: 'Um dia na sua planta e relatório técnico em até cinco dias úteis. O escopo e o valor são fechados antes do início, e o relatório é seu com ou sem contratação da execução.',
  },
  {
    p: 'A AUPROIN atende quais cidades?',
    r: 'Base em Alumínio/SP, com atendimento presencial em Mairinque, São Roque, Votorantim, Araçariguama, Iperó, Sorocaba, Itu e demais cidades da região — deslocamento em até 30 a 50 minutos. Para projeto e comissionamento há disponibilidade para viagem em todo o Estado de São Paulo.',
  },
  {
    p: 'Dá para modernizar uma máquina antiga sem o programa e sem a documentação do fabricante?',
    r: 'Sim. O trabalho começa por levantamento em campo e engenharia reversa da lógica existente, que vira descritivo funcional aprovado antes de programar. Foi assim em máquina comandada por relés, com 196 pontos de I/O mapeados e 98 alarmes classificados por ISA-18.2.',
  },
  {
    p: 'Existe responsabilidade técnica formal pelo serviço?',
    r: 'Sim. O responsável técnico tem registro ativo no CFT/CRT (270698738-32), com atribuição para responsabilidade técnica e emissão de TRT dentro das atribuições do técnico em eletrotécnica.',
  },
  {
    p: 'Quais plataformas de CLP e SCADA são atendidas?',
    r: 'CLP Siemens S7-1200, S7-1500, S7-300/400, S7-200 e ET200SP (TIA Portal, STEP 7 e MicroWin) e Delta série AS. SCADA e IHM: WinCC RT Professional, AVEVA InTouch, GE iFix, IHM Siemens KTP, Weintek e Delta. Redes Profinet, Profibus-DP, Modbus TCP, AS-i e IO-Link.',
  },
  {
    p: 'Como funciona a contratação?',
    r: 'Por escopo fechado (preço e prazo definidos por projeto), por diária de campo ou hora técnica para comissionamento e parada programada, ou por contrato mensal de retenção com horas reservadas para suporte e sustentação.',
  },
];

export const contatoLinhas = [
  { k: 'Telefone', v: '(15) 98801-6442', href: 'tel:+5515988016442' },
  { k: 'E-mail', v: 'paulo.souza@auproin.com.br', href: 'mailto:paulo.souza@auproin.com.br' },
  { k: 'LinkedIn', v: 'paulo-souza-auproin-automacao', href: 'https://www.linkedin.com/in/paulo-souza-auproin-automacao' },
  { k: 'Base', v: 'Alumínio/SP — CNPJ 63.652.491/0001-75', href: null },
];

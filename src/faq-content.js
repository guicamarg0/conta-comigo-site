export const faqGroups = [
  {
    id: "empreendedores",
    title: "Para empreendedores e pequenas empresas",
    questions: [
      {
        question: "Para quem é o Conta Comigo?",
        answer: "Para profissionais autônomos e pequenas empresas prestadoras de serviços que querem manter clientes, orçamentos, contratos, serviços e agenda organizados.",
        featured: true,
      },
      {
        question: "Que partes da rotina posso organizar no sistema?",
        answer: "O Plano Essencial reúne cadastro de clientes, empresas e itens, propostas, modelos e histórico de contratos, serviços, agenda e painel de acompanhamento.",
      },
      {
        question: "A demonstração pública mostra dados de clientes reais?",
        answer: "Não. A demonstração e as capturas deste site usam dados fictícios para apresentar as telas e os recursos do sistema.",
        featured: true,
      },
      {
        question: "Quanto custa o sistema e como faço para contratar?",
        answer: "Os valores e formatos de contratação ainda estão em definição. Você pode entrar em contato para conversar; não há preço publicado nem contratação online neste site.",
      },
    ],
  },
  {
    id: "orcamentos",
    title: "Orçamentos",
    questions: [
      {
        question: "Como o Conta Comigo ajuda a preparar orçamentos de serviços?",
        answer: "Você pode montar propostas com itens, valores e condições, revisar as informações e gerar um PDF com a identidade visual da sua empresa.",
        featured: true,
      },
      {
        question: "O sistema mantém as revisões do orçamento?",
        answer: "Sim. Orçamentos com revisões fazem parte dos recursos atuais. Você também pode gerar um PDF com a identidade visual da sua empresa para apresentar a proposta.",
      },
    ],
  },
  {
    id: "contratos",
    title: "Contratos",
    questions: [
      {
        question: "Como contratos e modelos ficam organizados?",
        answer: "O Plano Essencial permite organizar modelos de contrato e manter o histórico ligado ao trabalho aprovado, para facilitar a consulta das informações depois.",
        featured: true,
      },
      {
        question: "O sistema cria automaticamente um contrato para cada orçamento?",
        answer: "O recurso descrito hoje é a organização de modelos e contratos com histórico. Não anunciamos geração automática de contratos a partir dos orçamentos.",
      },
    ],
  },
  {
    id: "servicos-gestao",
    title: "Serviços e gestão da rotina",
    questions: [
      {
        question: "Como acompanho os serviços e os próximos compromissos?",
        answer: "O sistema reúne os serviços, a agenda e um painel de acompanhamento para consultar o andamento e os próximos compromissos de cada atendimento.",
        featured: true,
      },
      {
        question: "O Conta Comigo já controla pagamentos e recebimentos?",
        answer: "Ainda não. Pagamentos e recebimentos estão entre as ideias futuras e não fazem parte dos recursos disponíveis do Plano Essencial.",
      },
      {
        question: "Existe aplicativo para celular?",
        answer: "O aplicativo móvel está nos planos futuros. Hoje, o Conta Comigo é apresentado como um sistema web.",
      },
    ],
  },
];

export const landingFaqItems = faqGroups.flatMap(({ questions }) =>
  questions.filter(({ featured }) => featured)
);

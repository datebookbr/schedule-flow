// API Configuration - URLs can be changed to ASP Classic endpoints
// Example: /api/land_precos.asp, /api/land_beneficios.asp, etc.

const API_BASE_URL = '/api';

// Site Configuration
export interface SiteConfig {
  name: string;
  logo?: string;
  tagline?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

// Promotion Configuration
export interface PromotionConfig {
  active: boolean;
  title: string;
  description: string;
  ctaText: string;
  trialDays?: number;
  expiresAt?: string;
}

// Legal Content Interfaces
export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalDocument {
  title: string;
  sections: LegalSection[];
}

export interface LegalContent {
  lastUpdate: string;
  termos: LegalDocument;
  privacidade: LegalDocument;
  cookies: LegalDocument;
}

// Benefit Interface
export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Service Interface
export interface Service {
  id: string;
  name: string;
  included: boolean;
}

// Pricing Plan Interface
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  period: string;
  description: string;
  professionals: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

// Customer Registration Interface
export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

// Payment Data Interface
export interface PaymentData {
  planId: string;
  customerId?: string;
  paymentMethod: 'credit_card' | 'pix';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

// Payment Response Interface
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  pixCode?: string;
  pixQrCode?: string;
  message?: string;
}

// Mock Data - Replace with actual API calls when endpoints are ready

export const mockSiteConfig: SiteConfig = {
  name: 'Datebook',
  logo: '',
  tagline: 'Sistema de Agendamentos',
  whatsapp: '5511999999999',
  email: 'contato@datebook.com.br',
  address: 'São Paulo, SP'
};

export const mockPromotion: PromotionConfig = {
  active: true,
  title: '🎉 Experimente 30 dias GRÁTIS!',
  description: 'Aproveite nossa promoção por tempo limitado e teste todos os recursos sem compromisso.',
  ctaText: 'Começar Teste Grátis',
  trialDays: 30,
  expiresAt: '2024-12-31'
};

export const mockLegalContent: LegalContent = {
  lastUpdate: '01 de Dezembro de 2024',
  termos: {
    title: 'Termos de Uso',
    sections: [
      {
        title: '1. Aceitação dos Termos',
        content: `Ao acessar e utilizar os serviços do Datebook ("Plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.

A Plataforma é operada pela Datebook Sistemas Ltda., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede na cidade de São Paulo, Estado de São Paulo.`
      },
      {
        title: '2. Descrição dos Serviços',
        content: `O Datebook é uma plataforma de agendamento online que permite a profissionais de saúde, beleza e bem-estar gerenciar suas agendas, clientes e serviços de forma integrada.

Nossos serviços incluem:
• Sistema de agendamento online
• Integração com WhatsApp para notificações
• Página exclusiva personalizada
• Gestão de múltiplos profissionais
• Relatórios e analytics
• Suporte técnico`
      },
      {
        title: '3. Cadastro e Conta',
        content: `Para utilizar a Plataforma, você deve criar uma conta fornecendo informações verdadeiras, completas e atualizadas. Você é responsável por:

• Manter a confidencialidade de sua senha
• Todas as atividades realizadas em sua conta
• Notificar imediatamente sobre qualquer uso não autorizado
• Manter seus dados cadastrais atualizados

Reservamo-nos o direito de suspender ou cancelar contas que violem estes termos.`
      },
      {
        title: '4. Planos e Pagamentos',
        content: `Os serviços são oferecidos em diferentes planos de assinatura mensal. Os valores e características de cada plano estão disponíveis em nossa página de preços.

• O pagamento é processado mensalmente de forma automática
• Alterações de plano podem ser realizadas a qualquer momento
• Cancelamentos devem ser solicitados com antecedência mínima de 5 dias úteis
• Não há reembolso para períodos parciais já pagos`
      },
      {
        title: '5. Uso Aceitável',
        content: `Ao utilizar a Plataforma, você concorda em não:

• Violar leis ou regulamentos aplicáveis
• Enviar conteúdo ilegal, ofensivo ou prejudicial
• Tentar acessar sistemas ou dados não autorizados
• Interferir no funcionamento da Plataforma
• Utilizar a Plataforma para spam ou marketing não solicitado
• Revender ou sublicenciar o acesso aos serviços`
      },
      {
        title: '6. Propriedade Intelectual',
        content: `Todo o conteúdo da Plataforma, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio e software, é propriedade do Datebook ou de seus licenciadores e está protegido por leis de direitos autorais.

Você mantém a propriedade de todo o conteúdo que você enviar à Plataforma, mas nos concede uma licença para usar, reproduzir e exibir esse conteúdo conforme necessário para fornecer os serviços.`
      },
      {
        title: '7. Limitação de Responsabilidade',
        content: `A Plataforma é fornecida "como está" e "conforme disponível". Não garantimos que os serviços serão ininterruptos, seguros ou livres de erros.

Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou incapacidade de uso da Plataforma.`
      },
      {
        title: '8. Alterações nos Termos',
        content: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na Plataforma.

O uso continuado dos serviços após as alterações constitui aceitação dos novos termos.`
      },
      {
        title: '9. Contato',
        content: `Para questões relacionadas a estes Termos de Uso, entre em contato conosco:

Email: contato@datebook.com.br
WhatsApp: (11) 99999-9999
Endereço: São Paulo, SP - Brasil`
      }
    ]
  },
  privacidade: {
    title: 'Política de Privacidade',
    sections: [
      {
        title: '1. Informações que Coletamos',
        content: `Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:

Informações fornecidas por você:
• Dados de cadastro (nome, email, telefone, CPF/CNPJ)
• Informações de pagamento
• Dados do estabelecimento
• Informações de clientes cadastrados

Informações coletadas automaticamente:
• Dados de uso da plataforma
• Endereço IP e informações do dispositivo
• Cookies e tecnologias similares`
      },
      {
        title: '2. Como Usamos suas Informações',
        content: `Utilizamos as informações coletadas para:

• Fornecer e manter nossos serviços
• Processar pagamentos e transações
• Enviar notificações e comunicações importantes
• Melhorar e personalizar a experiência do usuário
• Analisar uso e tendências
• Cumprir obrigações legais
• Proteger contra fraudes e abusos`
      },
      {
        title: '3. Compartilhamento de Informações',
        content: `Não vendemos suas informações pessoais. Podemos compartilhar dados com:

• Provedores de serviços terceirizados (processamento de pagamentos, hospedagem, etc.)
• Parceiros de integração (WhatsApp Business API)
• Autoridades legais quando exigido por lei
• Empresas do grupo Datebook

Todos os terceiros são obrigados contratualmente a proteger suas informações.`
      },
      {
        title: '4. Segurança dos Dados',
        content: `Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:

• Criptografia de dados em trânsito (SSL/TLS)
• Criptografia de dados sensíveis em repouso
• Controles de acesso rigorosos
• Monitoramento contínuo de segurança
• Backups regulares
• Políticas de retenção de dados`
      },
      {
        title: '5. Seus Direitos (LGPD)',
        content: `De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:

• Confirmar a existência de tratamento de dados
• Acessar seus dados pessoais
• Corrigir dados incompletos ou desatualizados
• Solicitar anonimização ou eliminação de dados
• Solicitar portabilidade dos dados
• Revogar consentimento

Para exercer seus direitos, entre em contato através do email: privacidade@datebook.com.br`
      },
      {
        title: '6. Retenção de Dados',
        content: `Mantemos suas informações pelo tempo necessário para:

• Fornecer os serviços contratados
• Cumprir obrigações legais e regulatórias
• Resolver disputas e fazer cumprir nossos acordos

Após o encerramento da conta, manteremos alguns dados por períodos determinados conforme exigido por lei.`
      },
      {
        title: '7. Transferência Internacional',
        content: `Seus dados podem ser processados em servidores localizados fora do Brasil. Garantimos que todas as transferências internacionais cumprem a legislação aplicável e utilizam medidas de proteção adequadas.`
      },
      {
        title: '8. Alterações nesta Política',
        content: `Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através da Plataforma ou por email.

A versão mais atual sempre estará disponível em nossa página.`
      }
    ]
  },
  cookies: {
    title: 'Política de Cookies',
    sections: [
      {
        title: '1. O que são Cookies',
        content: `Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um website. Eles permitem que o site reconheça seu dispositivo e lembre de informações sobre sua visita.`
      },
      {
        title: '2. Cookies que Utilizamos',
        content: `Utilizamos os seguintes tipos de cookies:

Cookies Essenciais:
• Necessários para o funcionamento da Plataforma
• Autenticação e segurança
• Preferências de sessão

Cookies de Desempenho:
• Análise de uso e comportamento
• Identificação de erros
• Melhoria de performance

Cookies de Funcionalidade:
• Lembrar preferências do usuário
• Personalização da experiência
• Configurações de idioma`
      },
      {
        title: '3. Cookies de Terceiros',
        content: `Utilizamos serviços de terceiros que podem definir cookies:

• Google Analytics: análise de tráfego e comportamento
• Stripe/Outros gateways: processamento de pagamentos
• WhatsApp: integração de mensagens

Cada serviço possui sua própria política de cookies e privacidade.`
      },
      {
        title: '4. Como Gerenciar Cookies',
        content: `Você pode controlar e gerenciar cookies através das configurações do seu navegador:

• Chrome: Configurações > Privacidade e segurança > Cookies
• Firefox: Opções > Privacidade e Segurança
• Safari: Preferências > Privacidade
• Edge: Configurações > Cookies e permissões do site

Note que desabilitar alguns cookies pode afetar a funcionalidade da Plataforma.`
      },
      {
        title: '5. Consentimento',
        content: `Ao continuar navegando em nossa Plataforma, você consente com o uso de cookies conforme descrito nesta política.

Você pode retirar seu consentimento a qualquer momento através das configurações do navegador ou entrando em contato conosco.`
      }
    ]
  }
};

export const mockBenefits: Benefit[] = [
  {
    id: '1',
    icon: 'MessageCircle',
    title: 'Integração WhatsApp',
    description: 'Envio automático de confirmações e lembretes diretamente no WhatsApp dos seus clientes.'
  },
  {
    id: '2',
    icon: 'Globe',
    title: 'Página Exclusiva',
    description: 'Sua própria página personalizada com endereço, mapa, profissionais e serviços.'
  },
  {
    id: '3',
    icon: 'Calendar',
    title: 'Gestão de Agenda',
    description: 'Sistema completo para gerenciar horários, bloqueios e feriados de forma simples.'
  },
  {
    id: '4',
    icon: 'Users',
    title: 'Multi-Profissionais',
    description: 'Cadastre múltiplos profissionais, cada um com seus próprios serviços e horários.'
  },
  {
    id: '5',
    icon: 'Share2',
    title: 'Redes Sociais',
    description: 'Integração com Instagram, Facebook e outras redes para ampliar sua presença online.'
  },
  {
    id: '6',
    icon: 'Bell',
    title: 'Notificações',
    description: 'Envie mensagens direcionadas aos seus clientes para promoções e novidades.'
  }
];

export const mockServices: Service[] = [
  { id: '1', name: 'Página exclusiva personalizada para seu estabelecimento', included: true },
  { id: '2', name: 'Integração completa com WhatsApp Business', included: true },
  { id: '3', name: 'Envio automático de confirmações de agendamento', included: true },
  { id: '4', name: 'Lembretes automáticos 24h antes do horário', included: true },
  { id: '5', name: 'Cadastro ilimitado de serviços por profissional', included: true },
  { id: '6', name: 'Bloqueio de datas e feriados (incluindo municipais)', included: true },
  { id: '7', name: 'Integração com redes sociais (Instagram, Facebook)', included: true },
  { id: '8', name: 'Painel administrativo completo', included: true },
  { id: '9', name: 'Relatórios de agendamentos e clientes', included: true },
  { id: '10', name: 'Suporte técnico por WhatsApp', included: true },
  { id: '11', name: 'Mapa interativo com localização do estabelecimento', included: true },
  { id: '12', name: 'Fotos e descrição dos profissionais', included: true },
];

export const mockPricing: PricingPlan[] = [
  {
    id: '1',
    name: 'Essencial',
    price: 'R$ 49,90',
    priceValue: 49.90,
    period: '/mês',
    description: 'Ideal para profissionais autônomos',
    professionals: 'Até 2 profissionais',
    features: [
      'Página exclusiva personalizada',
      'Integração WhatsApp',
      'Confirmações automáticas',
      'Bloqueio de feriados',
      'Suporte por WhatsApp'
    ],
    highlighted: false,
    cta: 'Começar Agora'
  },
  {
    id: '2',
    name: 'Profissional',
    price: 'R$ 89,90',
    priceValue: 89.90,
    period: '/mês',
    description: 'Perfeito para salões e clínicas',
    professionals: 'Até 5 profissionais',
    features: [
      'Tudo do plano Essencial',
      'Relatórios avançados',
      'Múltiplas redes sociais',
      'Promoções personalizadas',
      'Suporte prioritário'
    ],
    highlighted: true,
    cta: 'Mais Popular'
  },
  {
    id: '3',
    name: 'Empresarial',
    price: 'R$ 149,90',
    priceValue: 149.90,
    period: '/mês',
    description: 'Para estabelecimentos maiores',
    professionals: 'Profissionais ilimitados',
    features: [
      'Tudo do plano Profissional',
      'API personalizada',
      'Multi-unidades',
      'Dashboard gerencial',
      'Gerente de conta dedicado'
    ],
    highlighted: false,
    cta: 'Fale Conosco'
  }
];

// API Functions - Replace mock data with actual fetch calls

export async function fetchSiteConfig(): Promise<SiteConfig> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_config.asp`);
  // return response.json();
  return Promise.resolve(mockSiteConfig);
}

export async function fetchPromotion(): Promise<PromotionConfig | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_promocao.asp`);
  // return response.json();
  return Promise.resolve(mockPromotion);
}

export async function fetchLegalContent(): Promise<LegalContent> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_legal.asp`);
  // return response.json();
  return Promise.resolve(mockLegalContent);
}

export async function fetchBenefits(): Promise<Benefit[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_beneficios.asp`);
  // return response.json();
  return Promise.resolve(mockBenefits);
}

export async function fetchServices(): Promise<Service[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_servicos.asp`);
  // return response.json();
  return Promise.resolve(mockServices);
}

export async function fetchPricing(): Promise<PricingPlan[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_precos.asp`);
  // return response.json();
  return Promise.resolve(mockPricing);
}

export async function fetchPlanById(planId: string): Promise<PricingPlan | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_plano.asp?id=${planId}`);
  // return response.json();
  const plan = mockPricing.find(p => p.id === planId);
  return Promise.resolve(plan || null);
}

export async function registerCustomer(data: CustomerData): Promise<{ success: boolean; customerId?: string; message?: string }> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_cadastro.asp`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();
  
  // Mock response
  return Promise.resolve({
    success: true,
    customerId: 'CUST_' + Date.now(),
    message: 'Cadastro realizado com sucesso!'
  });
}

export async function processPayment(data: PaymentData): Promise<PaymentResponse> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/land_pagamento.asp`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();
  
  // Mock response
  if (data.paymentMethod === 'pix') {
    return Promise.resolve({
      success: true,
      transactionId: 'TXN_' + Date.now(),
      pixCode: '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-835d-09e3ee8e2f1e5204000053039865802BR5925DATEBOOK SISTEMAS LTDA6009SAO PAULO62070503***6304E2CA',
      pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      message: 'PIX gerado com sucesso!'
    });
  }
  
  return Promise.resolve({
    success: true,
    transactionId: 'TXN_' + Date.now(),
    message: 'Pagamento processado com sucesso!'
  });
}

// API Configuration - URLs for ASP Classic endpoints
const API_BASE_URL = '/api';

// Check if we're in development mode (Lovable preview)
const isDevelopment = window.location.hostname.includes('lovableproject.com') || 
                       window.location.hostname === 'localhost';

// Site Configuration
export interface SiteConfig {
  name: string;
  logo?: string;
  tagline?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Page Texts - All texts from the landing page
export interface PageTexts {
  header: {
    menuBeneficios: string;
    menuServicos: string;
    menuPrecos: string;
    ctaButton: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ value: string; label: string }>;
  };
  benefits: {
    sectionLabel: string;
    title: string;
    subtitle: string;
  };
  services: {
    sectionLabel: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaButton: string;
  };
  pricing: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    popularBadge: string;
    footnote: string;
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    whatsappNumber: string;
  };
  footer: {
    description: string;
    navTitle: string;
    legalTitle: string;
    legalTermos: string;
    legalPrivacidade: string;
    legalCookies: string;
    contactTitle: string;
    copyright: string;
    developedBy: string;
    socialLinks: Array<{ platform: string; url: string }>;
  };
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

// Portfolio Establishment Interface
export interface PortfolioEstabelecimento {
  id: string;
  nome: string;
  segmento: string;
  cidade: string;
  descricao: string;
  imagem: string;
  avaliacao?: number;
  totalAvaliacoes?: number;
}

// Portfolio Data Interface
export interface PortfolioData {
  ativo: boolean;
  titulo: string;
  subtitulo: string;
  estabelecimentos: PortfolioEstabelecimento[];
}

// ============= FALLBACK DATA FOR DEVELOPMENT =============
// These are used when APIs are not available (Lovable preview environment)

const fallbackSiteConfig: SiteConfig = {
  name: "Datebook",
  logo: "",
  tagline: "Sistema de Agendamento Online",
  whatsapp: "5511999999999",
  email: "contato@datebook.com.br",
  phone: "(11) 99999-9999",
  address: "São Paulo, SP"
};

const fallbackPageTexts: PageTexts = {
  header: {
    menuBeneficios: "Benefícios",
    menuServicos: "Serviços",
    menuPrecos: "Preços",
    ctaButton: "Contrate Agora"
  },
  hero: {
    badge: "Sistema completo de agendamentos",
    titlePart1: "Transforme seu negócio com",
    titleHighlight: "agendamentos inteligentes",
    subtitle: "Sistema integrado ao WhatsApp para profissionais de saúde e beleza. Automatize confirmações, gerencie sua agenda e fidelize seus clientes.",
    ctaPrimary: "Contrate Agora",
    ctaSecondary: "Ver Serviços",
    stats: [
      { value: "5.000+", label: "Profissionais" },
      { value: "100k+", label: "Agendamentos" },
      { value: "99%", label: "Satisfação" }
    ]
  },
  benefits: {
    sectionLabel: "Por que escolher",
    title: "Tudo que você precisa em um só lugar",
    subtitle: "Simplifique sua gestão com ferramentas poderosas integradas ao WhatsApp"
  },
  services: {
    sectionLabel: "Serviços Inclusos",
    title: "Tudo que você precisa para",
    titleHighlight: "crescer seu negócio",
    subtitle: "Nossa plataforma oferece todas as ferramentas necessárias para gerenciar seus agendamentos de forma profissional e eficiente.",
    ctaButton: "Contratar Agora"
  },
  pricing: {
    sectionLabel: "Planos e Preços",
    title: "Escolha o plano ideal para você",
    subtitle: "Comece com nosso plano essencial e escale conforme seu negócio cresce",
    popularBadge: "Mais Popular",
    footnote: "* Valores para pagamento mensal. Economize até 20% no plano anual."
  },
  cta: {
    badge: "Integração completa com WhatsApp",
    title: "Pronto para transformar seu negócio?",
    subtitle: "Junte-se a milhares de profissionais que já automatizaram seus agendamentos. Comece hoje com apenas R$ 49,90/mês.",
    ctaPrimary: "Começar Agora",
    ctaSecondary: "Falar com Consultor",
    whatsappNumber: "5511999999999"
  },
  footer: {
    description: "Sistema completo de agendamentos integrado ao WhatsApp para profissionais de saúde e beleza.",
    navTitle: "Navegação",
    legalTitle: "Legal",
    legalTermos: "Termos de Uso",
    legalPrivacidade: "Política de Privacidade",
    legalCookies: "Cookies",
    contactTitle: "Contato",
    copyright: "Todos os direitos reservados.",
    developedBy: "Desenvolvido com ❤️ no Brasil",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/datebook" },
      { platform: "facebook", url: "https://facebook.com/datebook" }
    ]
  }
};

const fallbackPromotion: PromotionConfig = {
  active: true,
  title: "Oferta Especial",
  description: "Experimente grátis por 30 dias! Sem compromisso.",
  ctaText: "Começar Teste Grátis",
  trialDays: 30
};

const fallbackBenefits: Benefit[] = [
  { id: "1", icon: "MessageCircle", title: "WhatsApp Integrado", description: "Envie lembretes automáticos de agendamentos diretamente pelo WhatsApp." },
  { id: "2", icon: "Globe", title: "Página Exclusiva", description: "Tenha sua própria página online com endereço, mapa e lista de serviços." },
  { id: "3", icon: "Calendar", title: "Agenda Inteligente", description: "Gerencie todos os seus agendamentos em um só lugar, de forma simples." },
  { id: "4", icon: "Users", title: "Múltiplos Profissionais", description: "Adicione quantos profissionais precisar com agendas independentes." },
  { id: "5", icon: "Share2", title: "Redes Sociais", description: "Integração com Instagram e Facebook para seus clientes agendarem direto." },
  { id: "6", icon: "Bell", title: "Notificações", description: "Receba alertas de novos agendamentos e confirmações em tempo real." }
];

const fallbackServices: Service[] = [
  { id: "1", name: "Página exclusiva do estabelecimento", included: true },
  { id: "2", name: "Agendamento online 24h", included: true },
  { id: "3", name: "Lembretes automáticos via WhatsApp", included: true },
  { id: "4", name: "Gestão de múltiplos profissionais", included: true },
  { id: "5", name: "Bloqueio de horários e feriados", included: true },
  { id: "6", name: "Integração com redes sociais", included: true },
  { id: "7", name: "Relatórios e estatísticas", included: true },
  { id: "8", name: "Suporte técnico dedicado", included: true }
];

const fallbackPricing: PricingPlan[] = [
  {
    id: "essencial",
    name: "Essencial",
    price: "R$ 49,90",
    priceValue: 49.90,
    period: "/mês",
    description: "Ideal para profissionais autônomos",
    professionals: "Até 2 profissionais",
    features: ["Página exclusiva", "Agendamento online", "WhatsApp integrado", "Suporte por email"],
    highlighted: false,
    cta: "Começar Agora"
  },
  {
    id: "profissional",
    name: "Profissional",
    price: "R$ 89,90",
    priceValue: 89.90,
    period: "/mês",
    description: "Para clínicas e salões em crescimento",
    professionals: "Até 5 profissionais",
    features: ["Tudo do Essencial", "Relatórios avançados", "Integração redes sociais", "Suporte prioritário"],
    highlighted: true,
    cta: "Mais Popular"
  },
  {
    id: "empresarial",
    name: "Empresarial",
    price: "R$ 149,90",
    priceValue: 149.90,
    period: "/mês",
    description: "Para grandes estabelecimentos",
    professionals: "Profissionais ilimitados",
    features: ["Tudo do Profissional", "API personalizada", "Múltiplas unidades", "Gerente de conta dedicado"],
    highlighted: false,
    cta: "Falar com Consultor"
  }
];

const fallbackLegalContent: LegalContent = {
  lastUpdate: "2024-01-01",
  termos: {
    title: "Termos de Uso",
    sections: [
      { title: "1. Aceitação dos Termos", content: "Ao utilizar nossos serviços, você concorda com estes termos." },
      { title: "2. Uso do Serviço", content: "O serviço destina-se ao agendamento online para profissionais." }
    ]
  },
  privacidade: {
    title: "Política de Privacidade",
    sections: [
      { title: "1. Coleta de Dados", content: "Coletamos apenas dados necessários para o funcionamento do serviço." },
      { title: "2. Uso dos Dados", content: "Seus dados são utilizados exclusivamente para prestação do serviço." }
    ]
  },
  cookies: {
    title: "Política de Cookies",
    sections: [
      { title: "1. O que são Cookies", content: "Cookies são pequenos arquivos armazenados em seu dispositivo." },
      { title: "2. Como Usamos", content: "Utilizamos cookies para melhorar sua experiência de navegação." }
    ]
  }
};

const fallbackPortfolio: PortfolioData = {
  ativo: true,
  titulo: "Quem já usa o Datebook",
  subtitulo: "Conheça alguns dos estabelecimentos que transformaram sua gestão de agendamentos",
  estabelecimentos: [
    {
      id: "1",
      nome: "Clínica Odonto Plus",
      segmento: "Odontologia",
      cidade: "São Paulo, SP",
      descricao: "Clínica odontológica especializada em tratamentos estéticos e ortodontia.",
      imagem: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop",
      avaliacao: 4.9,
      totalAvaliacoes: 127
    },
    {
      id: "2",
      nome: "Barbearia Classic",
      segmento: "Barbearia",
      cidade: "Rio de Janeiro, RJ",
      descricao: "Barbearia tradicional com cortes modernos e atendimento premium.",
      imagem: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop",
      avaliacao: 4.8,
      totalAvaliacoes: 89
    },
    {
      id: "3",
      nome: "Studio Beleza & Arte",
      segmento: "Salão de Beleza",
      cidade: "Belo Horizonte, MG",
      descricao: "Salão especializado em coloração, cortes e tratamentos capilares.",
      imagem: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
      avaliacao: 5.0,
      totalAvaliacoes: 203
    }
  ]
};

// ============= API FUNCTIONS WITH FALLBACK =============

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  if (isDevelopment) {
    console.log(`[DEV MODE] Using fallback data for: ${url}`);
    return fallback;
  }
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Check if response is HTML (error page) instead of JSON
    if (text.startsWith('<!') || text.startsWith('<html')) {
      console.warn(`API returned HTML instead of JSON: ${url}`);
      return fallback;
    }
    
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return fallback;
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  return safeFetch(`${API_BASE_URL}/land_config.asp`, fallbackSiteConfig);
}

export async function fetchPageTexts(): Promise<PageTexts> {
  return safeFetch(`${API_BASE_URL}/land_textos.asp`, fallbackPageTexts);
}

export async function fetchPromotion(): Promise<PromotionConfig | null> {
  return safeFetch(`${API_BASE_URL}/land_promocao.asp`, fallbackPromotion);
}

export async function fetchLegalContent(): Promise<LegalContent> {
  return safeFetch(`${API_BASE_URL}/land_legal.asp`, fallbackLegalContent);
}

export async function fetchBenefits(): Promise<Benefit[]> {
  return safeFetch(`${API_BASE_URL}/land_beneficios.asp`, fallbackBenefits);
}

export async function fetchServices(): Promise<Service[]> {
  return safeFetch(`${API_BASE_URL}/land_servicos.asp`, fallbackServices);
}

export async function fetchPricing(): Promise<PricingPlan[]> {
  return safeFetch(`${API_BASE_URL}/land_precos.asp`, fallbackPricing);
}

export async function fetchPlanById(id: string): Promise<PricingPlan | null> {
  if (isDevelopment) {
    return fallbackPricing.find(p => p.id === id) || null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/land_plano.asp?id=${id}`);
    const text = await response.text();
    if (text.startsWith('<!') || text.startsWith('<html')) {
      return fallbackPricing.find(p => p.id === id) || null;
    }
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error fetching plan ${id}:`, error);
    return fallbackPricing.find(p => p.id === id) || null;
  }
}

export async function registerCustomer(data: CustomerData): Promise<{ success: boolean; customerId?: string; message?: string }> {
  if (isDevelopment) {
    console.log('[DEV MODE] Simulating customer registration:', data);
    return { success: true, customerId: 'dev-' + Date.now(), message: 'Cadastro simulado com sucesso!' };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/land_cadastro.asp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error registering customer:', error);
    return { success: false, message: 'Erro ao processar cadastro.' };
  }
}

export async function processPayment(data: PaymentData): Promise<PaymentResponse> {
  if (isDevelopment) {
    console.log('[DEV MODE] Simulating payment:', data);
    return { 
      success: true, 
      transactionId: 'dev-tx-' + Date.now(),
      message: 'Pagamento simulado com sucesso!'
    };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/land_pagamento.asp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, message: 'Erro ao processar pagamento.' };
  }
}

export async function fetchPortfolio(): Promise<PortfolioData> {
  return safeFetch(`${API_BASE_URL}/land_portfolio.asp`, fallbackPortfolio);
}

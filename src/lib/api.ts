// API Configuration - URLs for ASP Classic endpoints
const API_BASE_URL = '/api';

// Check if we're in development mode (Lovable preview)
const isDevelopment = window.location.hostname.includes('lovableproject.com') || 
                       window.location.hostname === 'localhost';

// Debug mode - set to true to see detailed logs
const DEBUG_MODE = true;

function debugLog(category: string, message: string, data?: unknown) {
  if (DEBUG_MODE) {
    const timestamp = new Date().toISOString();
    console.log(`%c[${timestamp}] [${category}]`, 'color: #0ea5e9; font-weight: bold;', message, data || '');
  }
}

function debugError(category: string, message: string, error?: unknown) {
  if (DEBUG_MODE) {
    const timestamp = new Date().toISOString();
    console.error(`%c[${timestamp}] [${category}] ERROR:`, 'color: #ef4444; font-weight: bold;', message, error || '');
  }
}

function debugWarn(category: string, message: string, data?: unknown) {
  if (DEBUG_MODE) {
    const timestamp = new Date().toISOString();
    console.warn(`%c[${timestamp}] [${category}] WARNING:`, 'color: #f59e0b; font-weight: bold;', message, data || '');
  }
}

// Log environment info on load
debugLog('ENV', `Hostname: ${window.location.hostname}`);
debugLog('ENV', `isDevelopment: ${isDevelopment}`);
debugLog('ENV', `API_BASE_URL: ${API_BASE_URL}`);

// Helper function to extract text from fields that might be objects like {text, included}
// This normalizes API responses that return structured text objects instead of plain strings
function normalizeTextField(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  
  // If it's an object with 'text' property, extract the text
  if (typeof value === 'object' && value !== null && 'text' in value) {
    const obj = value as { text: string; included?: boolean };
    return obj.text;
  }
  
  // If it's an array, normalize each element
  if (Array.isArray(value)) {
    return value.map(item => normalizeTextField(item));
  }
  
  // If it's an object (but not with 'text'), recursively normalize all properties
  if (typeof value === 'object') {
    const normalized: Record<string, unknown> = {};
    for (const key in value) {
      normalized[key] = normalizeTextField((value as Record<string, unknown>)[key]);
    }
    return normalized;
  }
  
  // For primitives (strings, numbers, booleans), return as-is
  return value;
}

debugLog('API', 'Função normalizeTextField carregada para tratar campos {text, included}');

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

// Interface for wrapped API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function safeFetch<T>(url: string, fallback: T, apiName: string): Promise<T> {
  debugLog('API', `Iniciando fetch: ${apiName}`, { url, isDevelopment });
  
  if (isDevelopment) {
    debugWarn('API', `[DEV MODE] Usando fallback para: ${apiName}`, { url });
    return fallback;
  }
  
  try {
    debugLog('API', `Fazendo requisição para: ${url}`);
    const startTime = performance.now();
    
    const response = await fetch(url);
    const endTime = performance.now();
    
    debugLog('API', `Resposta recebida de ${apiName}`, {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      tempoMs: Math.round(endTime - startTime)
    });
    
    const text = await response.text();
    
    debugLog('API', `Conteúdo raw de ${apiName} (primeiros 200 chars):`, text.substring(0, 200));
    
    // Check if response is HTML (error page) instead of JSON
    if (text.startsWith('<!') || text.startsWith('<html') || text.startsWith('<HTML')) {
      debugError('API', `${apiName} retornou HTML ao invés de JSON!`, {
        url,
        status: response.status,
        primeiros100chars: text.substring(0, 100)
      });
      return fallback;
    }
    
    // Check for empty response
    if (!text || text.trim() === '') {
      debugError('API', `${apiName} retornou resposta vazia!`, { url });
      return fallback;
    }
    
    try {
      const parsed = JSON.parse(text);
      debugLog('API', `${apiName} parseado com sucesso!`, parsed);
      
      let result: unknown;
      
      // Check if response is wrapped in {success, data} format
      if (parsed && typeof parsed === 'object' && 'success' in parsed && 'data' in parsed) {
        debugLog('API', `${apiName} - Extraindo .data do response wrapper`, parsed.data);
        result = parsed.data;
      } else {
        result = parsed;
      }
      
      // Normalize fields that might be {text, included} objects
      const normalized = normalizeTextField(result);
      debugLog('API', `${apiName} - Dados normalizados`, normalized);
      
      return normalized as T;
    } catch (parseError) {
      debugError('API', `Erro ao parsear JSON de ${apiName}:`, {
        error: parseError,
        text: text.substring(0, 500)
      });
      return fallback;
    }
    
  } catch (error) {
    debugError('API', `Erro de rede em ${apiName}:`, {
      url,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error
    });
    return fallback;
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  return safeFetch(`${API_BASE_URL}/land_config.asp`, fallbackSiteConfig, 'fetchSiteConfig');
}

export async function fetchPageTexts(): Promise<PageTexts> {
  return safeFetch(`${API_BASE_URL}/land_textos.asp`, fallbackPageTexts, 'fetchPageTexts');
}

export async function fetchPromotion(): Promise<PromotionConfig | null> {
  return safeFetch(`${API_BASE_URL}/land_promocao.asp`, fallbackPromotion, 'fetchPromotion');
}

export async function fetchLegalContent(): Promise<LegalContent> {
  return safeFetch(`${API_BASE_URL}/land_legal.asp`, fallbackLegalContent, 'fetchLegalContent');
}

export async function fetchBenefits(): Promise<Benefit[]> {
  return safeFetch(`${API_BASE_URL}/land_beneficios.asp`, fallbackBenefits, 'fetchBenefits');
}

export async function fetchServices(): Promise<Service[]> {
  return safeFetch(`${API_BASE_URL}/land_servicos.asp`, fallbackServices, 'fetchServices');
}

export async function fetchPricing(): Promise<PricingPlan[]> {
  return safeFetch(`${API_BASE_URL}/land_precos.asp`, fallbackPricing, 'fetchPricing');
}

export async function fetchPlanById(id: string): Promise<PricingPlan | null> {
  debugLog('API', `fetchPlanById iniciado`, { id, isDevelopment });
  
  if (isDevelopment) {
    const plan = fallbackPricing.find(p => p.id === id) || null;
    debugWarn('API', `[DEV MODE] Usando fallback para fetchPlanById`, { id, encontrado: !!plan });
    return plan;
  }
  
  try {
    const url = `${API_BASE_URL}/land_plano.asp?id=${id}`;
    debugLog('API', `Fazendo requisição para: ${url}`);
    
    const response = await fetch(url);
    const text = await response.text();
    
    debugLog('API', `fetchPlanById resposta raw:`, text.substring(0, 200));
    
    if (text.startsWith('<!') || text.startsWith('<html')) {
      debugError('API', `fetchPlanById retornou HTML!`, { id });
      return fallbackPricing.find(p => p.id === id) || null;
    }
    
    const parsed = JSON.parse(text);
    debugLog('API', `fetchPlanById parseado com sucesso:`, parsed);
    
    // Extract data from {success, data} wrapper if present
    let planData = parsed;
    if (parsed && typeof parsed === 'object' && 'success' in parsed && 'data' in parsed) {
      debugLog('API', `fetchPlanById - Extraindo .data do response wrapper`);
      planData = parsed.data;
    }
    
    // Normalize fields and ensure features is always an array
    const normalizedPlan: PricingPlan = {
      id: String(planData.id || id),
      name: String(planData.name || ''),
      price: typeof planData.price === 'number' ? `R$ ${planData.price.toFixed(2).replace('.', ',')}` : String(planData.price || ''),
      priceValue: typeof planData.price === 'number' ? planData.price : parseFloat(String(planData.price || '0').replace(/[^\d.,]/g, '').replace(',', '.')),
      period: planData.period ? `/${planData.period}` : '/mês',
      description: String(planData.description || ''),
      professionals: String(planData.professionals || ''),
      features: Array.isArray(planData.features) ? planData.features.map((f: unknown) => String(f || '')) : [],
      highlighted: Boolean(planData.popular || planData.highlighted),
      cta: String(planData.cta || 'Contratar')
    };
    
    debugLog('API', `fetchPlanById normalizado:`, normalizedPlan);
    return normalizedPlan;
  } catch (error) {
    debugError('API', `Erro em fetchPlanById:`, { id, error });
    return fallbackPricing.find(p => p.id === id) || null;
  }
}

export async function registerCustomer(data: CustomerData): Promise<{ success: boolean; customerId?: string; message?: string }> {
  debugLog('API', `registerCustomer iniciado`, { data, isDevelopment });
  
  if (isDevelopment) {
    debugWarn('API', `[DEV MODE] Simulando registerCustomer`);
    return { success: true, customerId: 'dev-' + Date.now(), message: 'Cadastro simulado com sucesso!' };
  }
  
  try {
    const url = `${API_BASE_URL}/land_cadastro.asp`;
    debugLog('API', `Fazendo POST para: ${url}`, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    debugLog('API', `registerCustomer resposta:`, result);
    return result;
  } catch (error) {
    debugError('API', `Erro em registerCustomer:`, error);
    return { success: false, message: 'Erro ao processar cadastro.' };
  }
}

export async function processPayment(data: PaymentData): Promise<PaymentResponse> {
  debugLog('API', `processPayment iniciado`, { data, isDevelopment });
  
  if (isDevelopment) {
    debugWarn('API', `[DEV MODE] Simulando processPayment`);
    return { 
      success: true, 
      transactionId: 'dev-tx-' + Date.now(),
      pixCode: '00020126580014br.gov.bcb.pix0136dev-test-pix-code',
      pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      message: 'Pagamento simulado com sucesso!'
    };
  }
  
  try {
    const url = `${API_BASE_URL}/land_pagamento.asp`;
    debugLog('API', `Fazendo POST para: ${url}`, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    debugLog('API', `processPayment resposta:`, result);
    
    // Extract data from wrapped response {success, data} structure
    if (result.success && result.data) {
      return {
        success: true,
        transactionId: String(result.data.pagamento_id || ''),
        pixCode: result.data.pix_code || '',
        pixQrCode: result.data.pix_qrcode || '',
        message: result.message || 'Pagamento processado com sucesso!'
      };
    }
    
    return result;
  } catch (error) {
    debugError('API', `Erro em processPayment:`, error);
    return { success: false, message: 'Erro ao processar pagamento.' };
  }
}

export async function fetchPortfolio(): Promise<PortfolioData> {
  return safeFetch(`${API_BASE_URL}/land_portfolio.asp`, fallbackPortfolio, 'fetchPortfolio');
}

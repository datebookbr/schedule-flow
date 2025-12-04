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

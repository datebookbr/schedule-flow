// API Configuration - URLs for ASP Classic endpoints
const API_BASE_URL = '/api';

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

// API Functions

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const response = await fetch(`${API_BASE_URL}/land_config.asp`);
  return response.json();
}

export async function fetchPageTexts(): Promise<PageTexts> {
  const response = await fetch(`${API_BASE_URL}/land_textos.asp`);
  return response.json();
}

export async function fetchPromotion(): Promise<PromotionConfig | null> {
  const response = await fetch(`${API_BASE_URL}/land_promocao.asp`);
  return response.json();
}

export async function fetchLegalContent(): Promise<LegalContent> {
  const response = await fetch(`${API_BASE_URL}/land_legal.asp`);
  return response.json();
}

export async function fetchBenefits(): Promise<Benefit[]> {
  const response = await fetch(`${API_BASE_URL}/land_beneficios.asp`);
  return response.json();
}

export async function fetchServices(): Promise<Service[]> {
  const response = await fetch(`${API_BASE_URL}/land_servicos.asp`);
  return response.json();
}

export async function fetchPricing(): Promise<PricingPlan[]> {
  const response = await fetch(`${API_BASE_URL}/land_precos.asp`);
  return response.json();
}

export async function fetchPlanById(id: string): Promise<PricingPlan | null> {
  const response = await fetch(`${API_BASE_URL}/land_plano.asp?id=${id}`);
  return response.json();
}

export async function registerCustomer(data: CustomerData): Promise<{ success: boolean; customerId?: string; message?: string }> {
  const response = await fetch(`${API_BASE_URL}/land_cadastro.asp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function processPayment(data: PaymentData): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/land_pagamento.asp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function fetchPortfolio(): Promise<PortfolioData> {
  const response = await fetch(`${API_BASE_URL}/land_portfolio.asp`);
  return response.json();
}

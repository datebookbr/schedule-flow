import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');
const ASAAS_BASE_URL = 'https://api.asaas.com/v3'; // Use 'https://sandbox.asaas.com/api/v3' para testes

interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  city?: string;
  state?: string;
}

interface PaymentData {
  customerId: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  dueDate: string;
  description?: string;
  // Dados do cartão (apenas para CREDIT_CARD)
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();
    console.log(`[ASAAS] Action: ${action}`, JSON.stringify(data, null, 2));

    if (!ASAAS_API_KEY) {
      console.error('[ASAAS] API Key não configurada');
      return new Response(
        JSON.stringify({ success: false, error: 'API Key do Asaas não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'create_customer':
        return await createCustomer(data as CustomerData);
      
      case 'create_payment':
        return await createPayment(data as PaymentData);
      
      case 'get_pix_qrcode':
        return await getPixQrCode(data.paymentId);
      
      case 'get_payment_status':
        return await getPaymentStatus(data.paymentId);
      
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Ação não reconhecida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[ASAAS] Erro:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function createCustomer(customerData: CustomerData) {
  console.log('[ASAAS] Criando cliente:', customerData.email);
  
  // Primeiro, verificar se cliente já existe
  const existingResponse = await fetch(`${ASAAS_BASE_URL}/customers?email=${encodeURIComponent(customerData.email)}`, {
    headers: {
      'accept': 'application/json',
      'access_token': ASAAS_API_KEY!,
    },
  });
  
  const existingData = await existingResponse.json();
  console.log('[ASAAS] Busca cliente existente:', existingData);
  
  if (existingData.data && existingData.data.length > 0) {
    console.log('[ASAAS] Cliente já existe:', existingData.data[0].id);
    return new Response(
      JSON.stringify({ success: true, customerId: existingData.data[0].id, existing: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Criar novo cliente
  const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': ASAAS_API_KEY!,
    },
    body: JSON.stringify({
      name: customerData.name,
      email: customerData.email,
      cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
      phone: customerData.phone?.replace(/\D/g, ''),
      address: customerData.address,
      addressNumber: customerData.addressNumber,
      complement: customerData.complement,
      province: customerData.province,
      postalCode: customerData.postalCode?.replace(/\D/g, ''),
      city: customerData.city,
      state: customerData.state,
    }),
  });

  const result = await response.json();
  console.log('[ASAAS] Resposta criar cliente:', result);

  if (result.errors) {
    return new Response(
      JSON.stringify({ success: false, error: result.errors[0]?.description || 'Erro ao criar cliente' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, customerId: result.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createPayment(paymentData: PaymentData) {
  console.log('[ASAAS] Criando cobrança:', paymentData.billingType, paymentData.value);
  
  const payload: any = {
    customer: paymentData.customerId,
    billingType: paymentData.billingType,
    value: paymentData.value,
    dueDate: paymentData.dueDate,
    description: paymentData.description || 'Assinatura Datebook',
  };

  // Se for cartão de crédito, adicionar dados do cartão
  if (paymentData.billingType === 'CREDIT_CARD' && paymentData.creditCard) {
    payload.creditCard = {
      holderName: paymentData.creditCard.holderName,
      number: paymentData.creditCard.number.replace(/\D/g, ''),
      expiryMonth: paymentData.creditCard.expiryMonth,
      expiryYear: paymentData.creditCard.expiryYear,
      ccv: paymentData.creditCard.ccv,
    };
    payload.creditCardHolderInfo = paymentData.creditCardHolderInfo;
  }

  const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': ASAAS_API_KEY!,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log('[ASAAS] Resposta criar cobrança:', result);

  if (result.errors) {
    return new Response(
      JSON.stringify({ success: false, error: result.errors[0]?.description || 'Erro ao criar cobrança' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Para PIX, já retorna informações básicas, mas precisamos buscar o QR Code
  let pixData = null;
  if (paymentData.billingType === 'PIX') {
    pixData = await fetchPixQrCode(result.id);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      paymentId: result.id,
      status: result.status,
      invoiceUrl: result.invoiceUrl,
      bankSlipUrl: result.bankSlipUrl,
      pixData,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function fetchPixQrCode(paymentId: string) {
  console.log('[ASAAS] Buscando QR Code PIX para:', paymentId);
  
  const response = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}/pixQrCode`, {
    headers: {
      'accept': 'application/json',
      'access_token': ASAAS_API_KEY!,
    },
  });

  const result = await response.json();
  console.log('[ASAAS] QR Code PIX:', result.success !== false);
  
  return result;
}

async function getPixQrCode(paymentId: string) {
  const result = await fetchPixQrCode(paymentId);
  
  if (result.errors) {
    return new Response(
      JSON.stringify({ success: false, error: result.errors[0]?.description || 'Erro ao buscar QR Code' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, ...result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getPaymentStatus(paymentId: string) {
  console.log('[ASAAS] Verificando status do pagamento:', paymentId);
  
  const response = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}`, {
    headers: {
      'accept': 'application/json',
      'access_token': ASAAS_API_KEY!,
    },
  });

  const result = await response.json();
  console.log('[ASAAS] Status do pagamento:', result.status);

  if (result.errors) {
    return new Response(
      JSON.stringify({ success: false, error: result.errors[0]?.description || 'Erro ao verificar status' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      status: result.status,
      confirmedDate: result.confirmedDate,
      paymentDate: result.paymentDate,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

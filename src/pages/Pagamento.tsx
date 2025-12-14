import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, QrCode, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  fetchPlanById, 
  fetchSiteConfig, 
  createAsaasCustomer,
  createAsaasPayment,
  getAsaasPaymentStatus,
  type PricingPlan, 
  type SiteConfig 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type PaymentMethod = 'credit_card' | 'pix';

// Máscaras para campos de cartão
const maskCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const maskCardExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

const maskCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

export default function Pagamento() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const planId = searchParams.get('plano') || '1';
  const customerIdParam = searchParams.get('cliente') || '';
  const customerName = searchParams.get('nome') || '';
  const customerEmail = searchParams.get('email') || '';
  const customerCpfCnpj = searchParams.get('cpfCnpj') || '';
  const customerPhone = searchParams.get('telefone') || '';
  const customerAddress = searchParams.get('endereco') || '';
  const customerAddressNumber = searchParams.get('numero') || '';
  const customerPostalCode = searchParams.get('cep') || '';
  const customerCity = searchParams.get('cidade') || '';
  const customerState = searchParams.get('estado') || '';
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [pixCode, setPixCode] = useState<string>('');
  const [pixQrCode, setPixQrCode] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [asaasCustomerId, setAsaasCustomerId] = useState<string>('');
  const [checkingPayment, setCheckingPayment] = useState(false);
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    Promise.all([
      fetchSiteConfig(),
      fetchPlanById(planId)
    ]).then(([config, planData]) => {
      setSiteConfig(config);
      setPlan(planData);
    });
  }, [planId]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    
    if (name === 'cardNumber') {
      maskedValue = maskCardNumber(value);
    } else if (name === 'cardExpiry') {
      maskedValue = maskCardExpiry(value);
    } else if (name === 'cardCvv') {
      maskedValue = maskCVV(value);
    }
    
    setCardData(prev => ({ ...prev, [name]: maskedValue }));
  };

  // Criar cliente no Asaas
  const ensureAsaasCustomer = async (): Promise<string | null> => {
    if (asaasCustomerId) return asaasCustomerId;
    
    const customerResult = await createAsaasCustomer({
      name: customerName,
      email: customerEmail,
      cpfCnpj: customerCpfCnpj,
      phone: customerPhone,
      address: customerAddress,
      addressNumber: customerAddressNumber,
      postalCode: customerPostalCode,
      city: customerCity,
      state: customerState,
    });
    
    if (customerResult.success && customerResult.customerId) {
      setAsaasCustomerId(customerResult.customerId);
      return customerResult.customerId;
    }
    
    toast({
      title: 'Erro',
      description: customerResult.error || 'Não foi possível criar o cliente.',
      variant: 'destructive'
    });
    return null;
  };

  // Verificar status do pagamento PIX
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentId || paymentSuccess) return;
    
    setCheckingPayment(true);
    const result = await getAsaasPaymentStatus(paymentId);
    setCheckingPayment(false);
    
    if (result.success && (result.status === 'CONFIRMED' || result.status === 'RECEIVED')) {
      setPaymentSuccess(true);
      toast({
        title: 'Pagamento confirmado!',
        description: 'Seu pagamento foi processado com sucesso.'
      });
    }
  }, [paymentId, paymentSuccess, toast]);

  // Polling para verificar status do PIX
  useEffect(() => {
    if (!paymentId || paymentSuccess) return;
    
    const interval = setInterval(checkPaymentStatus, 5000); // Verificar a cada 5 segundos
    return () => clearInterval(interval);
  }, [paymentId, paymentSuccess, checkPaymentStatus]);

  const handleGeneratePix = async () => {
    setLoading(true);
    
    try {
      const customerId = await ensureAsaasCustomer();
      if (!customerId) {
        setLoading(false);
        return;
      }
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      
      const result = await createAsaasPayment({
        customerId,
        billingType: 'PIX',
        value: plan?.priceValue || 49.90,
        dueDate: dueDate.toISOString().split('T')[0],
        description: `Assinatura ${plan?.name || 'Datebook'}`
      });
      
      if (result.success && result.paymentId) {
        setPaymentId(result.paymentId);
        
        if (result.pixData) {
          setPixCode(result.pixData.payload || '');
          if (result.pixData.encodedImage) {
            setPixQrCode(`data:image/png;base64,${result.pixData.encodedImage}`);
          }
        }
        
        toast({
          title: 'PIX gerado!',
          description: 'Copie o código ou escaneie o QR Code para pagar.'
        });
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Não foi possível gerar o código PIX.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o código PIX.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardData.cardNumber || !cardData.cardName || !cardData.cardExpiry || !cardData.cardCvv) {
      toast({
        title: 'Dados incompletos',
        description: 'Preencha todos os dados do cartão.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const customerId = await ensureAsaasCustomer();
      if (!customerId) {
        setLoading(false);
        return;
      }
      
      const [expiryMonth, expiryYear] = cardData.cardExpiry.split('/');
      const fullYear = expiryYear.length === 2 ? `20${expiryYear}` : expiryYear;
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      
      const result = await createAsaasPayment({
        customerId,
        billingType: 'CREDIT_CARD',
        value: plan?.priceValue || 49.90,
        dueDate: dueDate.toISOString().split('T')[0],
        description: `Assinatura ${plan?.name || 'Datebook'}`,
        creditCard: {
          holderName: cardData.cardName,
          number: cardData.cardNumber.replace(/\s/g, ''),
          expiryMonth,
          expiryYear: fullYear,
          ccv: cardData.cardCvv
        },
        creditCardHolderInfo: {
          name: customerName,
          email: customerEmail,
          cpfCnpj: customerCpfCnpj,
          postalCode: customerPostalCode,
          addressNumber: customerAddressNumber,
          phone: customerPhone
        }
      });
      
      if (result.success && (result.status === 'CONFIRMED' || result.status === 'PENDING')) {
        setPaymentSuccess(true);
        toast({
          title: 'Pagamento aprovado!',
          description: 'Seu pagamento foi processado com sucesso.'
        });
      } else {
        toast({
          title: 'Pagamento não aprovado',
          description: result.error || 'Verifique os dados do cartão.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar o pagamento.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: 'Código copiado!',
      description: 'Cole no app do seu banco para pagar.'
    });
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-muted-foreground mb-6">
            Seu plano {plan?.name} foi ativado com sucesso. Você receberá um e-mail com as instruções de acesso.
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate('/')}>
            Voltar para o início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(`/cadastro?plano=${planId}`)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              {siteConfig?.logo ? (
                <img src={siteConfig.logo} alt={siteConfig.name} className="h-8" />
              ) : (
                <span className="text-xl font-bold text-primary">{siteConfig?.name || 'Datebook'}</span>
              )}
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Cadastro</span>
            </div>
            <div className="w-12 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-foreground">Pagamento</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Forma de Pagamento
                </h1>
                <p className="text-muted-foreground mb-8">
                  Escolha como deseja pagar sua assinatura
                </p>

                {/* Payment Method Selection */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'pix' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">PIX</p>
                        <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'credit_card' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Parcele em até 12x</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* PIX Payment */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-6">
                    {!pixCode ? (
                      <div className="text-center py-8">
                        <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <QrCode className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Clique no botão abaixo para gerar o código PIX
                        </p>
                        <Button 
                          variant="hero" 
                          size="lg" 
                          onClick={handleGeneratePix}
                          disabled={loading}
                        >
                          {loading ? 'Gerando...' : 'Gerar código PIX'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-xl">
                          <p className="text-sm text-muted-foreground mb-2">Código PIX Copia e Cola:</p>
                          <div className="flex gap-2">
                            <Input 
                              value={pixCode} 
                              readOnly 
                              className="font-mono text-xs"
                            />
                            <Button variant="outline" size="icon" onClick={copyPixCode}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-center p-6 bg-background rounded-xl border border-border">
                          {pixQrCode ? (
                            <img 
                              src={pixQrCode} 
                              alt="QR Code PIX" 
                              className="w-48 h-48 mx-auto mb-4 rounded-xl"
                            />
                          ) : (
                            <div className="w-48 h-48 bg-muted rounded-xl mx-auto mb-4 flex items-center justify-center">
                              <QrCode className="w-24 h-24 text-muted-foreground" />
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Escaneie o QR Code com o app do seu banco
                          </p>
                        </div>
                        {checkingPayment && (
                          <div className="flex items-center justify-center gap-2 text-sm text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verificando pagamento...
                          </div>
                        )}
                        <p className="text-sm text-center text-muted-foreground">
                          O status do pagamento será atualizado automaticamente.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Credit Card Payment */}
                {paymentMethod === 'credit_card' && (
                  <form onSubmit={handlePayWithCard} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número do cartão</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Nome no cartão</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardInputChange}
                        placeholder="Como está impresso no cartão"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          value={cardData.cardExpiry}
                          onChange={handleCardInputChange}
                          placeholder="MM/AA"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          value={cardData.cardCvv}
                          onChange={handleCardInputChange}
                          placeholder="000"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full mt-4"
                      disabled={loading}
                    >
                      {loading ? 'Processando...' : `Pagar ${plan?.price || ''}`}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Resumo do Pedido
                </h3>
                
                {plan ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plano {plan.name}</span>
                      <span className="font-medium text-foreground">{plan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{plan.professionals}</span>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-foreground">Total</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground text-sm">{plan.period}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ Cancele quando quiser
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-20 bg-muted rounded" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

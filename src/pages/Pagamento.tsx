import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, QrCode, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  fetchSlugConfig,
  createPayment,
  checkPaymentStatus,
  type SlugConfig 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type PaymentMethod = 'pix' | 'cartao';

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

// Payment Status Polling Constants
const POLLING_INTERVAL = 3000; // 3 seconds
const POLLING_TIMEOUT = 600000; // 10 minutes

export default function Pagamento() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const slug = searchParams.get('slug') || 'datebook';
  const customerId = searchParams.get('customerId') || '';
  const asaasCustomerId = searchParams.get('asaasCustomerId') || '';
  const valorParam = searchParams.get('valor') || '49.90';
  const clientRedirect = searchParams.get('clientRedirect') || '';
  
  const [slugConfig, setSlugConfig] = useState<SlugConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  
  // PIX State
  const [pixCode, setPixCode] = useState<string>('');
  const [pixQrCode, setPixQrCode] = useState<string>('');
  const [asaasPaymentId, setAsaasPaymentId] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle');
  const [checkingPayment, setCheckingPayment] = useState(false);
  
  // Redirect countdown
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  // Polling refs
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pollingStartRef = useRef<number>(0);
  
  // Card data
  const [cardData, setCardData] = useState({
    cardNumero: '',
    cardNome: '',
    cardValidade: '',
    cardCvv: ''
  });

  const valor = parseFloat(valorParam);

  // Load slug config
  useEffect(() => {
    const loadConfig = async () => {
      setLoadingConfig(true);
      const config = await fetchSlugConfig(slug);
      setSlugConfig(config);
      setLoadingConfig(false);
    };
    
    loadConfig();
  }, [slug]);

  // Handle card input changes
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    
    if (name === 'cardNumero') {
      maskedValue = maskCardNumber(value);
    } else if (name === 'cardValidade') {
      maskedValue = maskCardExpiry(value);
    } else if (name === 'cardCvv') {
      maskedValue = maskCVV(value);
    }
    
    setCardData(prev => ({ ...prev, [name]: maskedValue }));
  };

  // Status polling function
  const pollPaymentStatus = useCallback(async () => {
    if (!asaasPaymentId || paymentStatus === 'confirmed') {
      console.log('[POLLING] Stopped - no paymentId or already confirmed');
      return;
    }
    
    // Check timeout (10 minutes)
    const elapsed = Date.now() - pollingStartRef.current;
    if (elapsed > POLLING_TIMEOUT) {
      console.log('[POLLING] Timeout reached - stopping');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      toast({
        title: 'Tempo esgotado',
        description: 'O tempo para confirmação do pagamento expirou. Tente novamente.',
        variant: 'destructive'
      });
      return;
    }
    
    setCheckingPayment(true);
    console.log('[POLLING] Checking payment status for:', asaasPaymentId);
    
    const result = await checkPaymentStatus(asaasPaymentId);
    
    console.log('[POLLING] Status result:', result);
    setCheckingPayment(false);
    
    if (result.status === 'confirmed') {
      console.log('[POLLING] Payment CONFIRMED!');
      setPaymentStatus('confirmed');
      
      // Stop polling
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      toast({
        title: '✅ Pagamento confirmado!',
        description: 'Seu pagamento foi processado com sucesso.'
      });
    } else if (result.status === 'failed') {
      console.log('[POLLING] Payment FAILED');
      setPaymentStatus('failed');
      
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      toast({
        title: 'Pagamento não aprovado',
        description: 'Houve um problema com seu pagamento. Tente novamente.',
        variant: 'destructive'
      });
    }
  }, [asaasPaymentId, paymentStatus, toast]);

  // Start polling when we have a payment ID
  useEffect(() => {
    if (asaasPaymentId && paymentStatus === 'pending') {
      console.log('[POLLING] Starting polling for:', asaasPaymentId);
      pollingStartRef.current = Date.now();
      
      // Initial check
      pollPaymentStatus();
      
      // Start interval
      pollingRef.current = setInterval(pollPaymentStatus, POLLING_INTERVAL);
      
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    }
  }, [asaasPaymentId, paymentStatus, pollPaymentStatus]);

  // Redirect countdown after confirmation
  useEffect(() => {
    if (paymentStatus === 'confirmed') {
      const countdown = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            // Use client redirect URL from clientes table (passed via query param), fallback to slugConfig
            const redirectUrl = clientRedirect || slugConfig?.redirect || '/';
            console.log('[REDIRECT] Redirecting to:', redirectUrl);
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdown);
    }
  }, [paymentStatus, clientRedirect, slugConfig]);

  // Generate PIX QR Code
  const handleGeneratePix = async () => {
    if (!customerId || !asaasCustomerId) {
      toast({
        title: 'Erro',
        description: 'Dados do cliente não encontrados. Volte e refaça o cadastro.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    console.log('[PIX] Generating PIX for customer:', { customerId, asaasCustomerId, valor, slug });
    
    try {
      const result = await createPayment({
        asaasCustomerId,
        customerId,
        valor,
        metodo: 'PIX',
        slug
      });
      
      console.log('[PIX] createPayment result:', result);
      
      if (result.success && result.asaasPaymentId) {
        setAsaasPaymentId(result.asaasPaymentId);
        setPaymentStatus('pending');
        
        if (result.pixCode) {
          setPixCode(result.pixCode);
        }
        
        if (result.pixQrCode) {
          // Check if it's already a data URL or just base64
          if (result.pixQrCode.startsWith('data:')) {
            setPixQrCode(result.pixQrCode);
          } else {
            setPixQrCode(`data:image/png;base64,${result.pixQrCode}`);
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
      console.error('[PIX] Error:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o código PIX.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Pay with credit card
  const handlePayWithCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardData.cardNumero || !cardData.cardNome || !cardData.cardValidade || !cardData.cardCvv) {
      toast({
        title: 'Dados incompletos',
        description: 'Preencha todos os dados do cartão.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!customerId || !asaasCustomerId) {
      toast({
        title: 'Erro',
        description: 'Dados do cliente não encontrados. Volte e refaça o cadastro.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    console.log('[CARD] Processing card payment:', { customerId, asaasCustomerId, valor, slug });
    
    try {
      const result = await createPayment({
        asaasCustomerId,
        customerId,
        valor,
        metodo: 'CARTAO',
        slug,
        cardNumero: cardData.cardNumero.replace(/\s/g, ''),
        cardNome: cardData.cardNome,
        cardValidade: cardData.cardValidade,
        cardCvv: cardData.cardCvv
      });
      
      console.log('[CARD] createPayment result:', result);
      
      if (result.success) {
        if (result.status === 'confirmed') {
          setPaymentStatus('confirmed');
          toast({
            title: '✅ Pagamento aprovado!',
            description: 'Seu pagamento foi processado com sucesso.'
          });
        } else {
          setAsaasPaymentId(result.asaasPaymentId || '');
          setPaymentStatus('pending');
          toast({
            title: 'Pagamento em processamento',
            description: 'Aguarde a confirmação.'
          });
        }
      } else {
        toast({
          title: 'Pagamento não aprovado',
          description: result.error || 'Verifique os dados do cartão.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('[CARD] Error:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar o pagamento.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy PIX code
  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: 'Código copiado!',
      description: 'Cole no app do seu banco para pagar.'
    });
  };

  // Loading state
  if (loadingConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Payment confirmed screen
  if (paymentStatus === 'confirmed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-muted-foreground mb-4">
            Seu pagamento para {slugConfig?.destinatario || 'Datebook'} foi processado com sucesso.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Você será redirecionado em <span className="font-bold text-primary">{redirectCountdown}</span> segundos...
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => {
              // Use client redirect URL from clientes table, fallback to slugConfig
              const redirectUrl = clientRedirect || slugConfig?.redirect || '/';
              window.location.href = redirectUrl;
            }}
          >
            Continuar agora
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
              onClick={() => navigate(`/cadastro?slug=${slug}`)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                {slugConfig?.destinatario || 'Datebook'}
              </span>
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
                  Escolha como deseja pagar
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
                    onClick={() => setPaymentMethod('cartao')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cartao'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'cartao' ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
                    {paymentStatus === 'idle' ? (
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
                        {/* QR Code */}
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

                        {/* PIX Copy/Paste Code */}
                        {pixCode && (
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
                        )}

                        {/* Payment Status */}
                        <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-primary/5 text-primary">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">
                            {checkingPayment ? 'Verificando pagamento...' : 'Aguardando pagamento...'}
                          </span>
                        </div>

                        <p className="text-sm text-center text-muted-foreground">
                          O status será atualizado automaticamente após o pagamento.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Credit Card Payment */}
                {paymentMethod === 'cartao' && (
                  <form onSubmit={handlePayWithCard} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumero">Número do cartão</Label>
                      <Input
                        id="cardNumero"
                        name="cardNumero"
                        value={cardData.cardNumero}
                        onChange={handleCardInputChange}
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNome">Nome no cartão</Label>
                      <Input
                        id="cardNome"
                        name="cardNome"
                        value={cardData.cardNome}
                        onChange={handleCardInputChange}
                        placeholder="Como está impresso no cartão"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardValidade">Validade</Label>
                        <Input
                          id="cardValidade"
                          name="cardValidade"
                          value={cardData.cardValidade}
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
                      {loading ? 'Processando...' : `Pagar R$ ${valor.toFixed(2).replace('.', ',')}`}
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
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {slugConfig?.descricaoProduto || 'Assinatura'}
                    </span>
                    <span className="font-medium text-foreground">
                      R$ {valor.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {slugConfig?.destinatario || 'Datebook'}
                    </span>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-foreground">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-foreground">
                          R$ {valor.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Pagamento seguro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

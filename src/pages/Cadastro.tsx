import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, User, MapPin, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  fetchSlugConfig,
  registerCustomer,
  type SlugConfig,
  type CustomerData 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  maskPhone,
  maskCpfCnpj,
  maskCEP,
  detectDocumentType,
  isValidEmail,
  isValidCpfCnpj,
  isValidPhone,
  ESTADOS_BR
} from '@/hooks/use-input-masks';

export default function Cadastro() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const slug = searchParams.get('slug') || 'datebook';
  const plano = searchParams.get('plano') || '';
  
  const [slugConfig, setSlugConfig] = useState<SlugConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [clientType, setClientType] = useState<'pf' | 'pj'>('pf');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cpfCnpj: '',
    companhia: '',
    slugSite: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    descricao: ''
  });
  
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [slugError, setSlugError] = useState('');
  const slugCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSuggestedSlugRef = useRef<string>('');

  useEffect(() => {
    const loadConfig = async () => {
      setLoadingConfig(true);
      console.log('[CADASTRO] Carregando config com slug:', slug, 'plano:', plano);
      const config = await fetchSlugConfig(slug, plano);
      setSlugConfig(config);
      setLoadingConfig(false);
      
      if (!config.success) {
        toast({
          title: 'Configuração não encontrada',
          description: 'Verifique o link de acesso.',
          variant: 'destructive'
        });
      }
    };
    
    loadConfig();
  }, [slug, plano, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let maskedValue = value;
    
    switch (name) {
      case 'whatsapp':
        maskedValue = maskPhone(value);
        break;
      case 'cpfCnpj':
        maskedValue = maskCpfCnpj(value);
        setClientType(detectDocumentType(maskedValue));
        break;
      case 'cep':
        maskedValue = maskCEP(value);
        break;
      default:
        maskedValue = value;
    }
    
    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };
  
  const handleStateChange = (value: string) => {
    setFormData(prev => ({ ...prev, uf: value }));
  };

  // Generate slug from company name
  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9]/g, '')       // remove especiais e espaços
      .substring(0, 20);
  };

  // Check slug availability via API
  const checkSlugAvailability = useCallback(async (slugValue: string) => {
    if (!slugValue || slugValue.length < 3) {
      setSlugStatus('idle');
      setSlugError('');
      return;
    }
    
    setSlugStatus('checking');
    
    try {
      const response = await fetch(`/api/check_slug.asp?slug=${encodeURIComponent(slugValue)}`);
      const data = await response.json();
      
      if (data.disponivel) {
        setSlugStatus('available');
        setSlugError('');
      } else {
        setSlugStatus('unavailable');
        setSlugError('Este endereço já está em uso');
      }
    } catch (error) {
      console.error('[SLUG] Erro ao verificar disponibilidade:', error);
      setSlugStatus('idle');
      setSlugError('Erro ao verificar disponibilidade');
    }
  }, []);

  // Handle slug input change with debounce
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    
    setFormData(prev => ({ ...prev, slugSite: value }));
    
    // Clear previous timeout
    if (slugCheckTimeoutRef.current) {
      clearTimeout(slugCheckTimeoutRef.current);
    }
    
    // Set new timeout for debounce (500ms)
    slugCheckTimeoutRef.current = setTimeout(() => {
      checkSlugAvailability(value);
    }, 500);
  };

  // Auto-suggest slug when company name changes
  useEffect(() => {
    if (formData.companhia) {
      const suggestedSlug = generateSlugFromName(formData.companhia);
      
      // Only auto-fill if slugSite is empty or equals previous suggestion
      if (!formData.slugSite || formData.slugSite === lastSuggestedSlugRef.current) {
        setFormData(prev => ({ ...prev, slugSite: suggestedSlug }));
        lastSuggestedSlugRef.current = suggestedSlug;
        
        // Check availability
        if (slugCheckTimeoutRef.current) {
          clearTimeout(slugCheckTimeoutRef.current);
        }
        slugCheckTimeoutRef.current = setTimeout(() => {
          checkSlugAvailability(suggestedSlug);
        }, 500);
      }
    }
  }, [formData.companhia, checkSlugAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos obrigatórios
    if (!formData.nome || !formData.email || !formData.whatsapp || !formData.cpfCnpj) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validação de email
    if (!isValidEmail(formData.email)) {
      toast({
        title: 'E-mail inválido',
        description: 'Por favor, insira um e-mail válido.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validação de telefone
    if (!isValidPhone(formData.whatsapp)) {
      toast({
        title: 'Telefone inválido',
        description: 'Por favor, insira um telefone válido com DDD.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validação de CPF/CNPJ
    if (!isValidCpfCnpj(formData.cpfCnpj)) {
      toast({
        title: clientType === 'pf' ? 'CPF inválido' : 'CNPJ inválido',
        description: `Por favor, insira um ${clientType === 'pf' ? 'CPF' : 'CNPJ'} válido.`,
        variant: 'destructive'
      });
      return;
    }
    
    // Validação de slug
    if (formData.slugSite && formData.slugSite.length < 3) {
      toast({
        title: 'Endereço do site inválido',
        description: 'O endereço deve ter pelo menos 3 caracteres.',
        variant: 'destructive'
      });
      return;
    }
    
    if (slugStatus === 'unavailable') {
      toast({
        title: 'Endereço indisponível',
        description: 'Este endereço já está em uso. Escolha outro.',
        variant: 'destructive'
      });
      return;
    }
    
    if (slugStatus === 'checking') {
      toast({
        title: 'Aguarde',
        description: 'Verificando disponibilidade do endereço...',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const customerData: CustomerData = {
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        cpfCnpj: formData.cpfCnpj,
        tipoPessoa: clientType === 'pf' ? 'PF' : 'PJ',
        companhia: formData.companhia || undefined,
        slugSite: formData.slugSite || undefined,
        rua: formData.rua || undefined,
        numero: formData.numero || undefined,
        bairro: formData.bairro || undefined,
        cidade: formData.cidade || undefined,
        uf: formData.uf || undefined,
        cep: formData.cep || undefined,
        descricao: formData.descricao || undefined,
        slug: slug
      };
      
      console.log('[CADASTRO] Enviando dados:', customerData);
      
      const result = await registerCustomer(customerData);
      
      console.log('[CADASTRO] Resultado:', result);
      
      if (result.success && result.customerId && result.asaasCustomerId) {
        toast({
          title: 'Cadastro realizado!',
          description: result.message || 'Cliente cadastrado com sucesso.'
        });
        
        // Check if plan is promotional (value = 0)
        const planValue = slugConfig?.valor ?? 0;
        const isPromotional = planValue === 0;
        
        if (isPromotional && result.redirect) {
          // Redirect directly to the client's redirect URL for promotional plans
          console.log('[CADASTRO] Plano promocional detectado (valor = 0). Redirecionando para:', result.redirect);
          window.location.href = result.redirect;
        } else {
          // Navigate to payment page with all necessary IDs including client redirect
          const params = new URLSearchParams({
            slug: slug,
            customerId: result.customerId,
            asaasCustomerId: result.asaasCustomerId,
            valor: String(planValue),
            ...(result.redirect && { clientRedirect: result.redirect })
          });
          
          navigate(`/pagamento?${params.toString()}`);
        }
      } else {
        toast({
          title: 'Erro no cadastro',
          description: result.error || result.message || 'Ocorreu um erro ao processar seu cadastro.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('[CADASTRO] Erro:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              onClick={() => navigate('/')}
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
                1
              </div>
              <span className="text-sm font-medium text-foreground">Cadastro</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-muted-foreground">Pagamento</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Complete seu cadastro
                </h1>
                <p className="text-muted-foreground mb-8">
                  Preencha os dados abaixo para continuar com a contratação
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Data */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="nome">Nome completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="cpfCnpj">
                          {clientType === 'pf' ? 'CPF' : 'CNPJ'} * 
                          <span className="ml-2 text-xs text-muted-foreground font-normal">
                            ({clientType === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'})
                          </span>
                        </Label>
                        <Input
                          id="cpfCnpj"
                          name="cpfCnpj"
                          value={formData.cpfCnpj}
                          onChange={handleInputChange}
                          placeholder={clientType === 'pf' ? '000.000.000-00' : '00.000.000/0001-00'}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Data */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Dados do Estabelecimento</h2>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="companhia">Nome do estabelecimento</Label>
                        <Input
                          id="companhia"
                          name="companhia"
                          value={formData.companhia}
                          onChange={handleInputChange}
                          placeholder="Nome da sua empresa ou estabelecimento"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="slugSite">Endereço do site</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">
                            datebook.com.br/
                          </span>
                          <div className="relative flex-1">
                            <Input
                              id="slugSite"
                              name="slugSite"
                              value={formData.slugSite}
                              onChange={handleSlugChange}
                              placeholder="suaempresa"
                              maxLength={20}
                              className={`rounded-l-none ${
                                slugStatus === 'available' ? 'border-green-500 focus-visible:ring-green-500' : ''
                              } ${
                                slugStatus === 'unavailable' ? 'border-red-500 focus-visible:ring-red-500' : ''
                              }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {slugStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                              {slugStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                              {slugStatus === 'unavailable' && <X className="w-4 h-4 text-red-500" />}
                            </div>
                          </div>
                        </div>
                        {slugError && <p className="text-sm text-red-500 mt-1">{slugError}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          Máximo de 20 caracteres. Use apenas letras minúsculas e números.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Data */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Endereço</h2>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="rua">Rua / Logradouro</Label>
                        <Input
                          id="rua"
                          name="rua"
                          value={formData.rua}
                          onChange={handleInputChange}
                          placeholder="Nome da rua"
                        />
                      </div>
                      <div>
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          name="numero"
                          value={formData.numero}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input
                          id="bairro"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleInputChange}
                          placeholder="Nome do bairro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          placeholder="Sua cidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="uf">Estado</Label>
                        <Select value={formData.uf} onValueChange={handleStateChange}>
                          <SelectTrigger id="uf" className="bg-background">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border border-border">
                            {ESTADOS_BR.map((uf) => (
                              <SelectItem key={uf} value={uf}>
                                {uf}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="descricao">Observações (opcional)</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      placeholder="Alguma informação adicional..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="xl" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Continuar para Pagamento'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Resumo
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Produto</p>
                    <p className="text-xl font-bold text-foreground">
                      {slugConfig?.descricaoProduto || 'Assinatura'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {slugConfig?.destinatario || 'Datebook'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="text-2xl font-bold text-foreground">
                      R$ {(slugConfig?.valor || 49.90).toFixed(2).replace('.', ',')}
                    </span>
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

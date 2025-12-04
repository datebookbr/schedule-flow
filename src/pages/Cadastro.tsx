import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  fetchPlanById, 
  fetchSiteConfig, 
  registerCustomer,
  type PricingPlan, 
  type SiteConfig,
  type CustomerData 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Cadastro() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const planId = searchParams.get('plano') || '1';
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.cpfCnpj) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await registerCustomer(formData);
      
      if (result.success) {
        toast({
          title: 'Cadastro realizado!',
          description: result.message
        });
        
        // Navigate to payment page with customer ID
        navigate(`/pagamento?plano=${planId}&cliente=${result.customerId}`);
      } else {
        toast({
          title: 'Erro no cadastro',
          description: result.message || 'Ocorreu um erro ao processar seu cadastro.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
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
                        <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="cpfCnpj">CPF ou CNPJ *</Label>
                        <Input
                          id="cpfCnpj"
                          name="cpfCnpj"
                          value={formData.cpfCnpj}
                          onChange={handleInputChange}
                          placeholder="000.000.000-00 ou 00.000.000/0001-00"
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
                        <Label htmlFor="company">Nome do estabelecimento</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Nome da sua empresa ou estabelecimento"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Rua, número, complemento"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Sua cidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="UF"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
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

            {/* Plan Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Resumo do Plano
                </h3>
                
                {plan ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Plano selecionado</p>
                      <p className="text-xl font-bold text-foreground">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.professionals}</p>
                    </div>
                    
                    <div className="flex justify-between items-baseline">
                      <span className="text-muted-foreground">Valor mensal</span>
                      <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Incluso no plano:</p>
                      <ul className="space-y-2">
                        {plan.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-muted rounded-xl" />
                    <div className="h-8 bg-muted rounded" />
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

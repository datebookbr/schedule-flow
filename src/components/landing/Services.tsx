import { useEffect, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchServices, fetchPageTexts, type Service, type PageTexts, type ApiError, isApiFailure } from '@/lib/api';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [texts, setTexts] = useState<PageTexts['services'] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const [servicesResult, textsResult] = await Promise.all([
      fetchServices(),
      fetchPageTexts()
    ]);
    
    if (isApiFailure(servicesResult)) {
      setError(servicesResult.error);
      setLoading(false);
      return;
    }
    setServices(servicesResult.data);
    
    if (isApiFailure(textsResult)) {
      setError(textsResult.error);
      setLoading(false);
      return;
    }
    setTexts(textsResult.data.services);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section id="servicos" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Carregando serviços...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="servicos" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar Serviços" />
        </div>
      </section>
    );
  }

  if (!texts) return null;

  return (
    <section id="servicos" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {texts.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {texts.title}{' '}
              <span className="text-gradient-primary">{texts.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {texts.subtitle}
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => scrollToSection('precos')}
            >
              {texts.ctaButton}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Right - Services List */}
          <div className="bg-gradient-card rounded-3xl p-6 md:p-8 shadow-lg border border-border/50">
            <div className="grid gap-4">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

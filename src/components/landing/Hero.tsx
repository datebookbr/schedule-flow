import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { fetchPageTexts, PageTexts, ApiError, isApiFailure } from '@/lib/api';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

export function Hero() {
  const [texts, setTexts] = useState<PageTexts['hero'] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchPageTexts();
    if (isApiFailure(result)) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setTexts(result.data.hero);
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
      <section className="relative min-h-screen bg-gradient-hero overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-primary-foreground">Carregando...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-hero overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar Hero" />
        </div>
      </section>
    );
  }

  if (!texts) return null;

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 md:right-20 animate-float opacity-20">
        <Calendar className="w-16 h-16 md:w-24 md:h-24 text-primary-foreground" />
      </div>
      <div className="absolute bottom-1/3 left-10 md:left-20 animate-float opacity-20" style={{ animationDelay: '2s' }}>
        <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse-soft" />
            <span className="text-sm font-medium text-primary-foreground/90">
              {texts.badge}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-up-delay-1">
            {texts.titlePart1}{' '}
            <span className="relative">
              {texts.titleHighlight}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10C50 4 100 4 150 7C200 10 250 6 298 4"
                  stroke="hsl(var(--accent))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-up-delay-2">
            {texts.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button
              variant="hero"
              size="xl"
              onClick={() => scrollToSection('precos')}
              className="w-full sm:w-auto"
            >
              {texts.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              onClick={() => scrollToSection('servicos')}
              className="w-full sm:w-auto"
            >
              {texts.ctaSecondary}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 md:mt-20 max-w-xl mx-auto">
            {texts.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-primary-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}

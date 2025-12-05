import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { fetchPageTexts, PageTexts } from '@/lib/api';

export function CTA() {
  const [texts, setTexts] = useState<PageTexts['cta'] | null>(null);

  useEffect(() => {
    fetchPageTexts().then(data => setTexts(data.cta));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!texts) return null;

  return (
    <section className="py-20 md:py-32 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-8">
            <MessageCircle className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground/90">
              {texts.badge}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {texts.title}
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            {texts.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="hero"
              size="xl"
              onClick={() => scrollToSection('precos')}
            >
              {texts.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              onClick={() => window.open(`https://wa.me/${texts.whatsappNumber}`, '_blank')}
            >
              {texts.ctaSecondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

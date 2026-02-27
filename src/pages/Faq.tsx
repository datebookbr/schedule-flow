import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { fetchFaq, FaqItem, ApiError, isApiFailure } from '@/lib/api';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import { FaqPageSchema } from '@/components/SeoSchemas';

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchFaq();
    if (isApiFailure(result)) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setFaqs(result.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    document.title = 'Perguntas Frequentes | Datebook';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Tire suas dúvidas sobre o Datebook, sistema de agendamento online para salões de beleza e barbearias. Veja perguntas frequentes sobre preços, funcionalidades e mais.');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://datebook.com.br/faq');

    return () => {
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* FAQPage Schema */}
      {faqs.length > 0 && <FaqPageSchema faqs={faqs} />}

      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o site
          </Link>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">FAQ</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
              Tire suas dúvidas sobre o Datebook, o sistema de agendamento online feito para salões de beleza e barbearias.
            </p>
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-14 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar perguntas frequentes" />
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-border/50">
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium text-foreground hover:text-primary hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-gradient-subtle py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Não encontrou sua dúvida?
          </h2>
          <p className="text-muted-foreground mb-8">
            Fale com a nossa equipe ou conheça os planos do Datebook.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/#precos">
              <Button variant="hero" size="lg">
                Ver planos e preços
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg">
                Ler nosso blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Datebook. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link to="/faq" className="hover:text-primary transition-colors font-medium text-foreground">FAQ</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Shield, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchSiteConfig, fetchLegalContent, SiteConfig, LegalContent, ApiError, isApiFailure } from '@/lib/api';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

export default function Termos() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ name: 'Datebook' });
  const [legalContent, setLegalContent] = useState<LegalContent | null>(null);
  const [activeSection, setActiveSection] = useState<string>('termos');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const [configResult, legalResult] = await Promise.all([
      fetchSiteConfig(),
      fetchLegalContent()
    ]);
    
    if (isApiFailure(configResult)) {
      setError(configResult.error);
      setLoading(false);
      return;
    }
    setSiteConfig(configResult.data);
    
    if (isApiFailure(legalResult)) {
      setError(legalResult.error);
      setLoading(false);
      return;
    }
    setLegalContent(legalResult.data);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sections = [
    { id: 'termos', label: 'Termos de Uso', icon: FileText },
    { id: 'privacidade', label: 'Política de Privacidade', icon: Shield },
    { id: 'cookies', label: 'Política de Cookies', icon: Scale },
  ];

  const getCurrentContent = () => {
    if (!legalContent) return null;
    switch (activeSection) {
      case 'termos':
        return legalContent.termos;
      case 'privacidade':
        return legalContent.privacidade;
      case 'cookies':
        return legalContent.cookies;
      default:
        return legalContent.termos;
    }
  };

  const content = getCurrentContent();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-hero text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link to="/">
              <Button variant="ghost" className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Documentos Legais
            </h2>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar conteúdo legal" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Documentos Legais
          </h2>
          <p className="text-primary-foreground/80">
            Última atualização: {legalContent?.lastUpdate || (loading ? 'Carregando...' : 'Não disponível')}
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6 mb-2" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </div>
          ) : content ? (
            <article className="prose prose-lg max-w-none">
              <h1 className="text-3xl font-bold text-foreground mb-8">
                {content.title}
              </h1>
              
              {content.sections.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </section>
              ))}
            </article>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Conteúdo não disponível
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.</p>
          <p className="mt-2">
            Dúvidas? Entre em contato: {siteConfig.email || 'contato@datebook.com.br'}
          </p>
        </div>
      </footer>
    </div>
  );
}

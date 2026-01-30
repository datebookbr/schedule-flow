import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { fetchSiteConfig, fetchPageTexts, SiteConfig, PageTexts, ApiError, isApiFailure } from '@/lib/api';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ name: 'Datebook' });
  const [texts, setTexts] = useState<PageTexts['footer'] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const [configResult, textsResult] = await Promise.all([
      fetchSiteConfig(),
      fetchPageTexts()
    ]);
    
    if (isApiFailure(configResult)) {
      setError(configResult.error);
      setLoading(false);
      return;
    }
    setSiteConfig(configResult.data);
    
    if (isApiFailure(textsResult)) {
      setError(textsResult.error);
      setLoading(false);
      return;
    }
    setTexts(textsResult.data.footer);
    
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
      <footer className="bg-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar Footer" />
        </div>
      </footer>
    );
  }

  if (!texts) return null;

  const menuItems = [
    { label: texts.navTitle === 'Navegação' ? 'Benefícios' : texts.navTitle, id: 'beneficios' },
    { label: 'Serviços', id: 'servicos' },
    { label: 'Preços', id: 'precos' },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {siteConfig.logo ? (
                <img 
                  src={siteConfig.logo} 
                  alt={siteConfig.name} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">{siteConfig.name}</span>
                </>
              )}
            </div>
            <p className="text-primary-foreground/60 text-sm mb-6">
              {texts.description}
            </p>
            <div className="flex items-center gap-4">
              {texts.socialLinks.map((social, index) => {
                const IconComponent = socialIconMap[social.platform] || Instagram;
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {texts.navTitle}
            </h4>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-primary-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {texts.legalTitle}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/termos"
                  className="text-primary-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
                >
                  {texts.legalTermos}
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  onClick={() => setTimeout(() => document.querySelector('button[data-section="privacidade"]')?.dispatchEvent(new MouseEvent('click')), 100)}
                  className="text-primary-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
                >
                  {texts.legalPrivacidade}
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  className="text-primary-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
                >
                  {texts.legalCookies}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {texts.contactTitle}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/60 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                {siteConfig.email}
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/60 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {siteConfig.phone}
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {siteConfig.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/40 text-sm">
              © {currentYear} {siteConfig.name}. {texts.copyright}
            </p>
            <p className="text-primary-foreground/40 text-sm">
              {texts.developedBy}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

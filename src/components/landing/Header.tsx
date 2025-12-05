import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar } from 'lucide-react';
import { fetchSiteConfig, fetchPageTexts, SiteConfig, PageTexts } from '@/lib/api';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ name: 'Datebook' });
  const [texts, setTexts] = useState<PageTexts['header'] | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchSiteConfig().then(setSiteConfig);
    fetchPageTexts().then(data => setTexts(data.header));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = texts ? [
    { label: texts.menuBeneficios, id: 'beneficios' },
    { label: texts.menuServicos, id: 'servicos' },
    { label: texts.menuPrecos, id: 'precos' },
  ] : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {siteConfig.logo ? (
              <img 
                src={siteConfig.logo} 
                alt={siteConfig.name} 
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}>
                  {siteConfig.name}
                </span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                  isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant={isScrolled ? 'default' : 'heroOutline'}
              onClick={() => scrollToSection('precos')}
            >
              {texts?.ctaButton || 'Contrate Agora'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md rounded-xl shadow-lg p-4 mb-4 animate-fade-up">
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant="hero"
                className="w-full mt-2"
                onClick={() => scrollToSection('precos')}
              >
                {texts?.ctaButton || 'Contrate Agora'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

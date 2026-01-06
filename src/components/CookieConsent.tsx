import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 hidden md:block" />
          <p className="text-sm text-slate-200 flex-1">
            Nós usamos cookies e outras tecnologias semelhantes para melhorar a sua experiência em nossos serviços, personalizar publicidade e recomendar conteúdo de seu interesse. Ao utilizar nossos serviços, você está ciente dessa funcionalidade.{' '}
            <Link to="/termos" className="text-primary hover:underline">
              Saiba mais
            </Link>
          </p>
          <Button 
            onClick={handleAccept}
            size="sm"
            className="flex-shrink-0 whitespace-nowrap"
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

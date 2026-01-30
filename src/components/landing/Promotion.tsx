import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Clock, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchPromotion, PromotionConfig, ApiError, isApiFailure } from '@/lib/api';

export function Promotion() {
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<PromotionConfig | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchPromotion().then((result) => {
      if (isApiFailure(result)) {
        setError(result.error);
        console.error('[Promotion] Erro ao carregar promoção:', result.error);
        return;
      }
      if (result.data?.active) {
        setPromotion(result.data);
      }
    });
  }, []);

  // Don't show anything if there's an error or no active promotion
  if (error || !promotion || !promotion.active || !isVisible) {
    return null;
  }

  const handleClick = () => {
    navigate('/cadastro?slug=datebook&plano=promo');
  };

  return (
    <section className="relative overflow-hidden py-6 bg-gradient-to-r from-accent via-accent to-accent-glow">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-4 left-[10%] w-6 h-6 text-white/30 animate-float" />
        <Sparkles className="absolute bottom-4 right-[15%] w-5 h-5 text-white/20 animate-float" style={{ animationDelay: '2s' }} />
        <Gift className="absolute top-6 right-[25%] w-8 h-8 text-white/20 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-4 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
        aria-label="Fechar promoção"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Tempo Limitado
            </span>
          </div>

          {/* Main text */}
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold">
              {promotion.title}
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              {promotion.description}
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleClick}
            className="bg-white text-accent hover:bg-white/90 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Gift className="w-5 h-5 mr-2" />
            {promotion.ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { MessageCircle, Globe, Calendar, Users, Share2, Bell } from 'lucide-react';
import { fetchBenefits, fetchPageTexts, type Benefit, type PageTexts, type ApiError, isApiFailure } from '@/lib/api';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Globe,
  Calendar,
  Users,
  Share2,
  Bell,
};

export function Benefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [texts, setTexts] = useState<PageTexts['benefits'] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const [benefitsResult, textsResult] = await Promise.all([
      fetchBenefits(),
      fetchPageTexts()
    ]);
    
    if (isApiFailure(benefitsResult)) {
      setError(benefitsResult.error);
      setLoading(false);
      return;
    }
    setBenefits(benefitsResult.data);
    
    if (isApiFailure(textsResult)) {
      setError(textsResult.error);
      setLoading(false);
      return;
    }
    setTexts(textsResult.data.benefits);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <section id="beneficios" className="py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Carregando benefícios...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="beneficios" className="py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar Benefícios" />
        </div>
      </section>
    );
  }

  if (!texts) return null;

  return (
    <section id="beneficios" className="py-20 md:py-32 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {texts.sectionLabel}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {texts.title}
          </h2>
          <p className="text-muted-foreground">
            {texts.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || Calendar;
            return (
              <div
                key={benefit.id}
                className="group bg-card rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

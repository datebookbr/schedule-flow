import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchPricing, fetchPageTexts, type PricingPlan, type PageTexts } from '@/lib/api';

export function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [texts, setTexts] = useState<PageTexts['pricing'] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPricing().then(setPlans);
    fetchPageTexts().then(data => setTexts(data.pricing));
  }, []);

  const handleSelectPlan = (plan: PricingPlan) => {
    navigate(`/cadastro?slug=datebook&plano=${plan.id}`);
  };

  if (!texts) return null;

  return (
    <section id="precos" className="py-20 md:py-32 bg-gradient-subtle">
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-card rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? 'border-2 border-primary shadow-glow scale-105 md:scale-110'
                  : 'border border-border/50 shadow-sm hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-hero text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    {texts.popularBadge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-primary font-medium mt-2">
                  {plan.professionals}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.highlighted ? 'hero' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          {texts.footnote}
        </p>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { PricingPlan, FaqItem } from '@/lib/api';

// ============= Organization Schema =============
interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export function OrganizationSchema({ name, url, logo, socialLinks }: OrganizationSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url,
      ...(logo && { logo }),
      ...(socialLinks && socialLinks.length > 0 && {
        sameAs: socialLinks.map(s => s.url)
      })
    };

    let script = document.querySelector('script[data-schema="organization"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'organization');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const s = document.querySelector('script[data-schema="organization"]');
      if (s) s.remove();
    };
  }, [name, url, logo, socialLinks]);

  return null;
}

// ============= SoftwareApplication Schema =============
interface SoftwareAppSchemaProps {
  plans?: PricingPlan[];
}

export function SoftwareApplicationSchema({ plans }: SoftwareAppSchemaProps) {
  useEffect(() => {
    const lowestPrice = plans && plans.length > 0
      ? Math.min(...plans.map(p => p.priceValue))
      : 49.90;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Datebook',
      description: 'Sistema de agendamento online para salões de beleza e barbearias com integração ao WhatsApp.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://datebook.com.br',
      offers: {
        '@type': 'Offer',
        price: lowestPrice.toFixed(2),
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '127'
      }
    };

    let script = document.querySelector('script[data-schema="software-app"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'software-app');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const s = document.querySelector('script[data-schema="software-app"]');
      if (s) s.remove();
    };
  }, [plans]);

  return null;
}

// ============= FAQPage Schema =============
interface FaqPageSchemaProps {
  faqs: FaqItem[];
}

export function FaqPageSchema({ faqs }: FaqPageSchemaProps) {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    let script = document.querySelector('script[data-schema="faq-page"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'faq-page');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const s = document.querySelector('script[data-schema="faq-page"]');
      if (s) s.remove();
    };
  }, [faqs]);

  return null;
}

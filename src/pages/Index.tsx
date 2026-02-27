import { useEffect, useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Promotion } from '@/components/landing/Promotion';
import { Benefits } from '@/components/landing/Benefits';
import { Services } from '@/components/landing/Services';
import { Portfolio } from '@/components/landing/Portfolio';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { OrganizationSchema, SoftwareApplicationSchema } from '@/components/SeoSchemas';
import { fetchPricing, fetchSiteConfig, fetchPageTexts, PricingPlan, isApiFailure } from '@/lib/api';

const Index = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [orgData, setOrgData] = useState<{ name: string; socialLinks?: Array<{ platform: string; url: string }> }>({ name: 'Datebook' });

  useEffect(() => {
    // Load pricing for SoftwareApplication schema
    fetchPricing().then(result => {
      if (!isApiFailure(result)) {
        setPlans(result.data);
      }
    });
    // Load config + texts for Organization schema
    fetchSiteConfig().then(result => {
      if (!isApiFailure(result)) {
        setOrgData(prev => ({ ...prev, name: result.data.name }));
      }
    });
    fetchPageTexts().then(result => {
      if (!isApiFailure(result)) {
        setOrgData(prev => ({ ...prev, socialLinks: result.data.footer.socialLinks }));
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Schemas */}
      <OrganizationSchema
        name={orgData.name}
        url="https://datebook.com.br"
        logo="https://datebook.com.br/favicon.ico"
        socialLinks={orgData.socialLinks}
      />
      <SoftwareApplicationSchema plans={plans} />

      <Header />
      <main>
        <Hero />
        <Promotion />
        <Benefits />
        <Services />
        <Portfolio />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

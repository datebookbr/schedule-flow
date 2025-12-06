import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Promotion } from '@/components/landing/Promotion';
import { Benefits } from '@/components/landing/Benefits';
import { Services } from '@/components/landing/Services';
import { Portfolio } from '@/components/landing/Portfolio';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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

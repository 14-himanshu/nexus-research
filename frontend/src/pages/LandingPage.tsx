import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialProof } from '../components/landing/SocialProof';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { FooterSection } from '../components/landing/FooterSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 relative overflow-x-hidden">
      
      {/* Premium subtle background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <Navbar />
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <FeaturesGrid />
      <FooterSection />
      
    </div>
  );
}

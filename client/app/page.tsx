import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProblemBento from '@/components/landing/ProblemBento';
import ArchitecturePipeline from '@/components/landing/ArchitecturePipeline';
import InteractiveScoring from '@/components/landing/InteractiveScoring';
import DemoTeaser from '@/components/landing/DemoTeaser';
import Footer from '@/components/landing/Footer';

/**
 * CivicPulse BRICS — Landing Page
 *
 * Composed from modular section components. Each section
 * is a client component with Framer Motion scroll animations.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemBento />
        <ArchitecturePipeline />
        <InteractiveScoring />
        <DemoTeaser />
      </main>
      <Footer />
    </>
  );
}

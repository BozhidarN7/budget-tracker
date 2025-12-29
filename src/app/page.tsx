import {
  BeforeAfterSection,
  CtaSection,
  FeaturesSection,
  HeroSection,
  HomeFooter,
  HomeHeader,
  InterfaceTourSection,
  SHOW_TESTIMONIALS,
  TestimonialsSection,
  TrustSection,
  WorkflowSection,
  beforeAfterMeta,
  beforeAfterStats,
  deepLinks,
  featureHighlights,
  interfaceSlides,
  navLinks,
  partnerLogos,
  testimonials,
  trustSignals,
  workflowBeats,
} from '@/components/Home';

export default function HomePage() {
  return (
    <main className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.25),_transparent_60%)] blur-3xl" />
        <div className="absolute right-0 bottom-12 h-56 w-56 translate-x-1/2 rounded-full bg-[linear-gradient(120deg,_rgba(16,185,129,0.35),_rgba(59,130,246,0.25))] opacity-60 blur-[90px] motion-safe:animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-10 pb-24 lg:px-10">
        <HomeHeader links={navLinks} />
        <HeroSection />
        <FeaturesSection features={featureHighlights} />
        <InterfaceTourSection slides={interfaceSlides} />
        <BeforeAfterSection meta={beforeAfterMeta} stats={beforeAfterStats} />
        <WorkflowSection beats={workflowBeats} links={deepLinks} />
        {SHOW_TESTIMONIALS ? (
          <TestimonialsSection
            logos={partnerLogos}
            testimonials={testimonials}
          />
        ) : null}
        <TrustSection signals={trustSignals} />
        <CtaSection />
        <HomeFooter />
      </div>
    </main>
  );
}

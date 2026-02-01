import './framer/styles.css'

// Navigation
import NavbarFramerComponent from './framer/navigation/navbar'

// Hero elements
import ParticlesBackgroundFramerComponent from './framer/particles-background'
import BadgeFramerComponent from './framer/elements/badge'
import CtaButtonFramerComponent from './framer/cta-button'

// Process cards
import AnalyzeCardFramerComponent from './framer/analyze-card'
import DevelopmentCardFramerComponent from './framer/development-card'
import MaintenanceCardFramerComponent from './framer/maintenance-card'

// Service cards
import AiConsultingCardFramerComponent from './framer/ai-consulting-card'
import LlmDevelopmentFramerComponent from './framer/llm-development'
import EndToEndDevelopmentServicesFramerComponent from './framer/end-to-end-development-services'
import BusinessChatbotFramerComponent from './framer/business-chatbot'
import DataAnalysticCardFramerComponent from './framer/data-analystic-card'
import ContentCreationCardFramerComponent from './framer/content-creation-card'
import LeadGenerationCardFramerComponent from './framer/lead-generation-card'

// FAQ
import AccordionFramerComponent from './framer/accordion'

// Footer
import FooterFramerComponent from './framer/footer/footer'
import CopyrightFramerComponent from './framer/footer/copyright'

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ============ NAVBAR ============ */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <NavbarFramerComponent.Responsive />
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24">
        {/* Particles Background */}
        <div className="absolute inset-0 z-0">
          <ParticlesBackgroundFramerComponent.Responsive
            CDhM3va4w={"rgb(0, 0, 0)"}
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <BadgeFramerComponent.Responsive
            LZ2eCPtLx={14}
            OLBJJ2ZZ2={"Vertical AI Agents for Business Growth"}
            bWKfsW3Ha={"rgb(13, 13, 13)"}
            sVlsQOR6K={"rgb(255, 255, 255)"}
            zKyvF25Hr={0.9}
          />
          
          <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6">
            Replace Busywork With AI Agents That Drive Growth
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            We build secure, enterprise-grade AI systems that eliminate repetitive work, 
            cut operational costs, and scale your business with compliance at the core.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <CtaButtonFramerComponent.Responsive
              IHCtoN6iC={true}
              NAbd17i0q={"Get Started"}
              ae3kdG3b0={"rgb(81, 47, 235)"}
              t90xdY6CE={"/#contact"}
              yt52UU3wF={15}
            />
          </div>
        </div>
      </section>

      {/* ============ OUR PROCESS SECTION ============ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-purple-400 mb-4">The Process</p>
            <h2 className="text-3xl md:text-5xl font-bold">Our Process</h2>
            <p className="text-gray-400 mt-4">A simple, effective approach to deliver excellence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnalyzeCardFramerComponent.Responsive />
            <DevelopmentCardFramerComponent.Responsive />
            <MaintenanceCardFramerComponent.Responsive />
          </div>
        </div>
      </section>

      {/* ============ SERVICES SECTION ============ */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Innovative services for growth</h2>
            <p className="text-gray-400 mt-4">Tailored solutions to streamline, innovate, and grow.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BusinessChatbotFramerComponent.Responsive />
            <EndToEndDevelopmentServicesFramerComponent.Responsive />
            <LlmDevelopmentFramerComponent.Responsive />
            <DataAnalysticCardFramerComponent.Responsive />
            <AiConsultingCardFramerComponent.Responsive />
            <LeadGenerationCardFramerComponent.Responsive />
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">We're here to help</h2>
            <p className="text-gray-400 mt-4">FAQs designed to provide the information you need.</p>
          </div>
          
          <AccordionFramerComponent.Responsive
            Cex7wM3dD={"Will AI automation disrupt my current operations?"}
            FUmxS9SsG={"The timeline varies depending on the complexity of your business needs. On average, it takes a few weeks for smaller projects, while more complex implementations can take several months. We'll provide a detailed timeline during our consultation."}
            OLAbE1hoB={"The cost depends on the complexity of the solution and the scope of automation required. We offer flexible pricing options tailored to your business needs, which will be discussed during the initial consultation."}
            PoFu0ampR={"What types of processes can be automated using AI?"}
            SpwCTlbpl={"What are AI development services?"}
            VgfoicLnB={"At their core, Artificial Intelligence (AI) development services revolve around designing and tailoring artificial intelligence solutions to meet specific business needs."}
            dtRgj2l7C={"How much does AI automation cost?"}
            fJGxNpSee={"AI can automate a wide range of tasks, from data entry and customer support to decision-making and workflow optimization. We tailor solutions based on your business needs."}
            j7x1ztZZn={"We aim to minimize any disruption to your business. Our team works closely with you to ensure the integration is seamless."}
            o8grCgBRZ={"How long does it take to implement AI automation?"}
          />
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let's talk about your next big move
          </h2>
          <p className="text-gray-400 mb-8">
            Unlock untapped potential with safe, responsible, and powerful AI solutions.
          </p>
          <CtaButtonFramerComponent.Responsive
            IHCtoN6iC={true}
            NAbd17i0q={"Book a Call"}
            ae3kdG3b0={"rgb(81, 47, 235)"}
            t90xdY6CE={"/#contact"}
            yt52UU3wF={16}
          />
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <FooterFramerComponent.Responsive />
          <div className="mt-8 pt-8 border-t border-zinc-800">
            <CopyrightFramerComponent.Responsive />
          </div>
        </div>
      </footer>
    </div>
  );
}

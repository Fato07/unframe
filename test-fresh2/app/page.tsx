import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { ElementsBadge } from '@/components/elements-badge'
import { CTAButton } from '@/components/cta-button'
import { ParticlesBackground } from '@/components/particles-background'
import { AnalyzeCard } from '@/components/analyze-card'
import { Developmentcard } from '@/components/developmentcard'
import { Maintenancecard } from '@/components/maintenancecard'
import { BusinessChatbot } from '@/components/business-chatbot'
import { Endtoenddevelopmentservices } from '@/components/endtoenddevelopmentservices'
import { LLMDevelopment } from '@/components/llm-development'
import { Dataanalysticcard } from '@/components/dataanalysticcard'
import { AIconsultingcard } from '@/components/a-iconsultingcard'
import { Accordion } from '@/components/accordion'
import { FooterFooter } from '@/components/footer-footer'
import { FooterCopyright } from '@/components/footer-copyright'

export default function HomePage() {
  return (
  <div className="w-full max-w-7xl h-fit bg-[var(--color-background)] flex flex-col justify-start items-center">
    <NavigationNavbar />
    <NavigationNavbar />
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[180px] pr-10 pb-[100px] pl-10">
      <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
        <ElementsBadge
  text="Vertical AI Agents for Business Growth"
  textColor="rgb(255, 255, 255)"
  color="rgb(13, 13, 13)"
  opacity={0.9}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="w-full h-fit max-w-[900px]">Replace Busywork With AI Agents That Drive Growth</h1>
            <p className="w-full h-fit max-w-[500px]">
              We build secure, enterprise-grade AI systems that eliminate repetitive work, cut operational costs, and scale your business with compliance at the core.
            </p>
          </div>
          <div className="w-fit h-fit rounded-[0px] flex flex-row gap-[15px] justify-center items-center py-0 px-0">
            <CTAButton
  text="Our Services"
  color="rgb(81, 47, 235)"
  enabled
  href="/#services"
  size={15}
 />
          </div>
        </div>
      </div>
      <div className="w-[1085px] h-[184px] opacity-55">
      </div>
      <div className="w-[1085px] h-[184px] opacity-55">
      </div>
      <ParticlesBackground backgroundColor="rgb(0, 0, 0)" />
    </div>
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[25px] justify-center items-center py-[50px] px-10">
      <ElementsBadge
  text="Secure AI Systems · SOC 2 · GDPR"
  textColor="rgba(255, 255, 255, 0.7)"
  color="rgb(13, 13, 13)"
  opacity={1}
  size={14}
 />
      <div className="w-full h-fit flex flex-col gap-[25px] justify-center items-center">
        <h3 className="w-[1035px] h-fit">
          From vertical AI agents in finance, healthcare, and SaaS, to workflow automation and custom LLMs, we help you scale faster, reduce costs, and stay compliant with SOC 2, HIPAA, and GDPR.
        </h3>
      </div>
    </div>
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[100px] px-10">
      <div className="w-full h-fit flex flex-col gap-[25px] justify-center items-center">
        <ElementsBadge
  text="The Process"
  textColor="rgba(255, 255, 255, 0.7)"
  color="rgb(13, 13, 13)"
  opacity={1}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
          <h2 className="w-full h-fit max-w-[900px]">Our Process</h2>
          <p className="w-full h-fit max-w-[600px]">A simple, effective approach to deliver excellence.</p>
        </div>
      </div>
      <div className="w-full h-fit max-w-[1200px] grid grid-cols-3 gap-[30px]">
        <div className="w-[364px] h-fit bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-center py-5 px-[30px]">
          <AnalyzeCard />
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <p className="w-full h-fit">Discovery &amp; Analysis</p>
            <p className="w-full h-fit">
              We dive deep into your needs, exploring ideas and defining strategies for long-term success.
            </p>
          </div>
        </div>
        <div className="w-[364px] h-fit bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-center py-5 px-[30px]">
          <Developmentcard />
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <p className="w-full h-fit">Development &amp; Test</p>
            <p className="w-full h-fit">
              We craft tailored solutions for your goals and rigorously test them for top-notch reliability.
            </p>
          </div>
        </div>
        <div className="w-[364px] h-fit bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-center py-5 px-[30px]">
          <Maintenancecard />
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <p className="w-full h-fit">Launch &amp; Maintain</p>
            <p className="w-full h-fit">
              We deploy your solution seamlessly and ensure its continued performance with ongoing care.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[100px] px-10">
      <div className="w-full h-fit flex flex-col gap-[25px] justify-center items-center">
        <ElementsBadge
  text="Services"
  textColor="rgba(255, 255, 255, 0.7)"
  color="rgb(13, 13, 13)"
  opacity={1}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
          <h2 className="w-full h-fit max-w-[900px]">Innovative services for growth</h2>
          <p className="w-full h-fit max-w-[600px]">Tailored solutions to streamline, innovate, and grow.</p>
        </div>
      </div>
      <div className="w-full h-fit max-w-[1200px] flex flex-col gap-[15px] justify-center items-center">
        <div className="w-full h-fit grid grid-cols-3 gap-[15px]">
          <div className="w-[138px] h-fit bg-[var(--color-card-background)] rounded-[10px] flex flex-col gap-5 justify-center items-center py-5 px-[30px]">
            <BusinessChatbot />
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
              <p className="w-full h-fit">Vertical AI Agent Development</p>
              <p className="w-full h-fit">
                We build domain-specific AI agents that act like specialized team members whether it’s an AI receptionist for healthcare, a compliance assistant for finance, or an intelligent growth agent for SaaS.
              </p>
            </div>
          </div>
          <div className="w-[377px] h-fit bg-[var(--color-card-background)] rounded-[10px] flex flex-col gap-[51px] justify-center items-center py-[45px] px-[30px]">
            <Endtoenddevelopmentservices />
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
              <p className="w-full h-fit">End-to-End AI Development</p>
              <p className="w-full h-fit">
                From idea to deployment, we handle the full lifecycle strategy, design, development, and scaling so you get AI systems that deliver measurable business outcomes.
              </p>
            </div>
          </div>
          <div className="w-[378px] h-fit bg-[var(--color-card-background)] rounded-[10px] flex flex-col gap-5 justify-center items-center py-[53px] px-[30px]">
            <LLMDevelopment />
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
              <p className="w-full h-fit">LLM Development</p>
              <p className="w-full h-fit">
                We customize large language models to your business secure, private, and aligned with your workflows. From RAG pipelines to fine-tuned models, we make AI work on your terms.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-fit grid grid-cols-2 gap-[15px]">
          <div className="w-[138px] h-fit bg-[var(--color-card-background)] rounded-[10px] flex flex-col gap-5 justify-center items-center py-5 px-[30px]">
            <Dataanalysticcard />
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
              <p className="w-full h-fit">Workflow Automations</p>
              <p className="w-full h-fit">
                We connect your CRMs, ERPs, and internal systems with AI to eliminate repetitive tasks, reduce errors, and save hundreds of hours across teams every month.
              </p>
            </div>
          </div>
          <div className="w-[571px] h-fit bg-[var(--color-card-background)] rounded-[10px] flex flex-col gap-5 justify-center items-center py-5 px-[30px]">
            <AIconsultingcard />
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
              <p className="w-full h-fit">AI Consulting</p>
              <p className="w-full h-fit">
                We assess where AI will create the highest leverage in your company, run compliance &amp; risk audits, and design AI roadmaps that scale safely and efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[100px] px-10">
      <div className="w-full h-fit flex flex-col gap-[25px] justify-center items-center">
        <ElementsBadge
  text="Benefits"
  textColor="rgba(255, 255, 255, 0.7)"
  color="rgb(13, 13, 13)"
  opacity={1}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
          <h2 className="w-full h-fit max-w-[900px]">Maximize efficiency and impact</h2>
          <p className="w-full h-fit max-w-[600px]">Discover the key benefits of partnering with us.</p>
        </div>
      </div>
      <div className="w-full h-fit max-w-[1200px] grid grid-cols-3 gap-[30px]">
        <div className="w-[138px] h-fit bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-start py-5 px-[30px]">
          <div className="w-[100px] h-[100px] bg-[rgba(81,_47,_235,_0.5)] rounded-[231px]">
          </div>
          <div className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
            <div className="w-5 h-5">
            </div>
          </div>
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <p className="w-full h-fit">Cost reduction</p>
            <p className="w-full h-fit">
              Optimize business processes and streamline operations to significantly minimize costs and maximize overall efficiency.
            </p>
          </div>
        </div>
        <div className="w-[364px] h-fit bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-start py-5 px-[30px]">
          <div className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
            <div className="w-5 h-5">
            </div>
          </div>
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <p className="w-full h-fit">Improved outcomes</p>
            <p className="w-full h-fit">
              Leverage powerful data-driven insights and innovative strategies to enhance business performance and achieve superior outcomes.
            </p>
          </div>
          <div className="w-[100px] h-[100px] bg-[rgba(81,_47,_235,_0.5)] rounded-[231px]">
          </div>
        </div>
        <div className="w-[364px] h-fit bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-start py-5 px-[30px]">
          <div className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
            <div className="w-5 h-5">
            </div>
          </div>
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <p className="w-full h-fit">Increased productivity</p>
            <p className="w-full h-fit">
              Enhance group performance and output by automating redundant tasks, refining processes, and speeding up business functions.
            </p>
          </div>
          <div className="w-[100px] h-[100px] bg-[rgba(81,_47,_235,_0.5)] rounded-[231px]">
          </div>
        </div>
      </div>
    </div>
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[100px] px-10">
      <div className="w-full h-fit flex flex-col gap-[25px] justify-center items-center">
        <ElementsBadge
  text="FAQs"
  textColor="rgba(255, 255, 255, 0.7)"
  color="rgb(13, 13, 13)"
  opacity={1}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
          <h2 className="w-full h-fit max-w-[900px]">We’re here to help</h2>
          <p className="w-full h-fit max-w-[600px]">FAQs designed to provide the information you need.</p>
        </div>
      </div>
      <div className="w-[95%] h-fit max-w-[1200px] flex flex-row gap-2.5 justify-center items-center">
        <Accordion
  maxWidth="950px"
  SpwCTlbpl="What are AI development services?"
  text="At their core, Artificial Intelligence (AI) development services revolve around designing and tailoring artificial intelligence solutions to meet specific business needs. It's akin to architects and builders coming together; while the fundamental principles remain consistent, the final outcome is custom-built to fit an individual's requirements. So, when we discuss AI development, we're delving into specialized domains—like machine learning, natural language processing, or computer vision—each designed to address unique challenges in analytics, communication, or data interpretation."
  text2="What types of processes can be automated using AI?"
  fJGxNpSee="AI can automate a wide range of tasks, from data entry and customer support to decision-making and workflow optimization. We tailor solutions based on your business needs, whether it's automating routine operations or more complex tasks."
  text3="How long does it take to implement AI automation?"
  text4="The timeline varies depending on the complexity of your business needs. On average, it takes a few weeks for smaller projects, while more complex implementations can take several months. We’ll provide a detailed timeline during our consultation."
  text5="Will AI automation disrupt my current operations?"
  label="We aim to minimize any disruption to your business. Our team works closely with you to ensure the integration is seamless, and we handle the entire process, including testing and troubleshooting, to avoid downtime."
  label2="How much does AI automation cost?"
  label3="The cost depends on the complexity of the solution and the scope of automation required. We offer flexible pricing options tailored to your business needs, which will be discussed during the initial consultation."
 />
      </div>
      <div className="w-full h-fit max-w-[950px] rounded-[30px] flex flex-col gap-[30px] justify-center items-center py-[60px] px-0">
        <ElementsBadge
  text="codesdevs"
  textColor="rgb(255, 255, 255)"
  color="rgb(13, 13, 13)"
  opacity={1}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
          <h2 className="w-fit h-fit max-w-[500px]">Let’s talk about your next big move</h2>
          <p className="w-fit h-fit max-w-[450px]">
            Unlock untapped potential with safe, responsible, and powerful AI solutions.
          </p>
        </div>
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
          <CTAButton
  text="Get in touch"
  color="rgb(81, 47, 235)"
  enabled
  href="https://cal.com/fathin/codes-devs-consulting"
  size={15}
 />
        </div>
      </div>
    </div>
    <FooterFooter />
    <FooterCopyright />
  </div>
  )
}

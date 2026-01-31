import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'

export default function HomePage() {
  return (
  <div className="absolute w-[1200px] h-fit top-0 left-0 bg-[var(--color-background)] flex flex-col justify-start items-center">
    <NavigationNavbar />
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[180px] pr-10 pb-[100px] pl-10">
      <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="w-full h-fit max-w-[900px]">Replace Busywork With AI Agents That Drive Growth</h1>
            <p className="w-full h-fit max-w-[500px]">
              We build secure, enterprise-grade AI systems that eliminate repetitive work.
            </p>
          </div>
          <div className="w-fit h-fit flex flex-row gap-3 justify-center items-center">
            <div className="w-fit h-fit bg-[var(--color-blue)] rounded-lg flex flex-col items-center py-4 px-8">
              <p>Get Started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-full h-fit bg-[var(--color-background)] flex flex-col gap-12 items-center py-[100px] px-10">
      <div className="w-full h-fit flex flex-col gap-4 items-center">
        <h2>AI-Powered Solutions</h2>
        <p>Transform your business with intelligent automation</p>
      </div>
      <div className="w-full h-fit max-w-[1200px] grid grid-cols-3 gap-6">
        <div className="w-full h-fit bg-[var(--color-card-background)] rounded-2xl flex flex-col gap-4 p-8">
          <h2>Smart Automation</h2>
          <p>
            Automate repetitive tasks with AI agents that learn and adapt.
          </p>
        </div>
        <div className="w-full h-fit bg-[var(--color-card-background)] rounded-2xl flex flex-col gap-4 p-8">
          <h2>Data Analysis</h2>
          <p>
            Get insights from your data with intelligent analysis tools.
          </p>
        </div>
        <div className="w-full h-fit bg-[var(--color-card-background)] rounded-2xl flex flex-col gap-4 p-8">
          <h2>Secure &amp; Private</h2>
          <p>
            Enterprise-grade security with your data privacy guaranteed.
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

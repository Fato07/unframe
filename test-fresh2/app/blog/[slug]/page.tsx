import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { FooterFooter } from '@/components/footer-footer'
import { FooterCopyright } from '@/components/footer-copyright'

export default function BlogSlugPage() {
  return (
  <div className="w-full max-w-7xl h-fit bg-[var(--color-background)] flex flex-col justify-start items-center py-0 px-5">
    <NavigationNavbar />
    <div className="w-[97%] h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[180px] pr-10 pb-12 pl-10">
      <div className="w-[700px] h-fit max-w-full flex flex-col gap-[45px] justify-start items-center">
        <div className="w-[600px] h-fit max-w-full flex flex-col gap-[15px] justify-start items-center">
          <div className="w-fit h-fit flex flex-row gap-2.5 justify-center items-center">
            <div className="w-fit h-fit bg-[#00000008] rounded-lg flex flex-row gap-2.5 justify-start items-start py-0 px-2">
              <p className="w-fit h-fit">Enterprise Security</p>
            </div>
          </div>
          <h1 className="w-full h-fit max-w-[600px]">Why SOC 2 Compliance Matters for AI Agents</h1>
          <p className="w-full h-fit max-w-[600px]">Jan 31, 2026</p>
        </div>
        <div className="w-full h-fit max-w-[600px] flex flex-row gap-2.5 justify-center items-center">
          <div className="w-full h-[1fr]">
          </div>
          <a className="w-fit h-fit" href="/blog/:slug">Vertical vs Horizontal AI: Which Scales Better? ›</a>
        </div>
        <div className="w-full h-[400px] rounded-3xl">
        </div>
        <p className="w-[600px] h-fit max-w-[600px]">Content</p>
      </div>
    </div>
    <FooterFooter />
    <FooterCopyright />
  </div>
  )
}

import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { ElementsBadge } from '@/components/elements-badge'
import { CTAButton } from '@/components/cta-button'
import { FooterFooter } from '@/components/footer-footer'

export default function Page404Page() {
  return (
  <div className="w-full max-w-7xl h-fit bg-[var(--color-background)] flex flex-col justify-start items-center">
    <NavigationNavbar />
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[180px] pr-10 pb-[120px] pl-10">
      <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
        <ElementsBadge
  text="Page not found"
  textColor="rgb(255, 255, 255)"
  color="rgb(13, 13, 13)"
  opacity={0.9}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="w-full h-fit max-w-[900px]">Oops! Page Not Found</h1>
            <p className="w-full h-fit max-w-[500px]">
              It looks like the page you’re searching for doesn’t exist or has been moved. Let’s get you back to where you need to be.
            </p>
          </div>
          <div className="w-fit h-fit rounded-[0px] flex flex-row gap-[15px] justify-center items-center py-0 px-0">
            <CTAButton
  text="Let's go home"
  color="rgb(81, 47, 235)"
  enabled
  href="/"
  size={15}
 />
          </div>
        </div>
      </div>
      <div className="w-[1085px] h-[184px] opacity-40">
      </div>
      <div className="w-[1085px] h-[184px] opacity-40">
      </div>
    </div>
    <FooterFooter maxWidth="1200px" />
    <div className="w-fit h-fit">
    </div>
  </div>
  )
}

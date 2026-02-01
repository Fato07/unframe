import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { ElementsBadge } from '@/components/elements-badge'
import { FooterFooter } from '@/components/footer-footer'

export default function ComingSoonPage() {
  return (
  <div className="absolute w-full max-w-7xl h-fit top-0 left-0 bg-[var(--color-background)] flex flex-col justify-start items-center">
    <NavigationNavbar />
    <div className="w-full h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[180px] pr-10 pb-[120px] pl-10">
      <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
        <ElementsBadge
  text="Coming soon"
  textColor="rgb(255, 255, 255)"
  color="rgb(13, 13, 13)"
  opacity={0.9}
  size={14}
 />
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="w-full h-fit max-w-[900px]">We’re Launching Soon!</h1>
            <p className="w-full h-fit max-w-[500px]">
              Something amazing is coming your way soon. Enter your email below to join our early-access list.
            </p>
          </div>
          <div className="w-full h-fit max-w-[400px] rounded-[0px] flex flex-row gap-[15px] justify-center items-center py-0 px-0">
            <div className="w-full h-fit">
            </div>
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

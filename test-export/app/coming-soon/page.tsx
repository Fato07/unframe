import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { ElementsBadge } from '@/components/elements-badge'
import { FooterFooter } from '@/components/footer-footer'

export default function ComingSoonPage() {
  return (
  <div className="absolute w-[1200px] h-fit top-0 left-0 bg-[var(--color-background)] flex flex-col justify-start items-center">
    <NavigationNavbar />
    <div className="absolute w-full h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[180px] pr-10 pb-[120px] pl-10">
      <div className="absolute w-full h-fit top-[165px] left-0 flex flex-col gap-[15px] justify-center items-center">
        <ElementsBadge
  OLBJJ2ZZ2="Coming soon"
  sVlsQOR6K="rgb(255, 255, 255)"
  bWKfsW3Ha="rgb(13, 13, 13)"
  zKyvF25Hr={0.9}
  LZ2eCPtLx={14}
 />
        <div className="absolute w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="absolute w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="absolute w-full h-fit max-w-[900px]">We’re Launching Soon!</h1>
            <p className="absolute w-full h-fit max-w-[500px]">
              Something amazing is coming your way soon. Enter your email below to join our early-access list.
            </p>
          </div>
          <div className="absolute w-full h-fit max-w-[400px] top-0 left-0 rounded-[0px] flex flex-row gap-[15px] justify-center items-center py-0 px-0">
            <div className="absolute w-full h-fit">
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-[1085px] h-[184px] right-[-46px] bottom-[30px] opacity-40">
      </div>
      <div className="absolute w-[1085px] h-[184px] top-[30px] left-[-46px] opacity-40">
      </div>
    </div>
    <FooterFooter maxWidth="1200px" />
    <div className="absolute w-fit h-fit">
    </div>
  </div>
  )
}

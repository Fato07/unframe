import Image from 'next/image'
import { Navitems } from '@/components/navitems'
import { CTAButton } from '@/components/cta-button'

export function NavigationNavbar() {
  return (
  <div>
    <div className="absolute w-full max-w-7xl h-fit top-0 left-0 flex flex-row gap-6 justify-center items-center py-5 px-10">
      <div className="w-full h-fit max-w-[1200px] bg-[rgba(0,_0,_0,_0.5)] rounded-lg flex flex-row gap-4 justify-center items-center py-2.5 px-[18px]">
        <div className="w-full h-fit flex flex-row gap-4 justify-between items-center">
          <div className="w-9 h-9">
            <Image
              className="absolute w-9 h-9 flex flex-row gap-2 justify-start items-center"
              src="https://framerusercontent.com/images/ef9qyeTSc2x0goX2BOGuWMIOk.svg"
              alt=""
              fill
             />
          </div>
          <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-0.5 px-0">
            <Navitems text="Process" QuWKPWgPR="/#process" />
            <Navitems text="Services" QuWKPWgPR="/#services" />
            <Navitems text="Benefits" QuWKPWgPR="/#benefits" />
            <Navitems text="Contact" QuWKPWgPR="/#contact" />
            <Navitems text="Blog" QuWKPWgPR="/blog" />
          </div>
          <div className="w-full h-fit flex flex-row gap-2.5 justify-end items-center">
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
    </div>
    <div className="absolute w-[340px] h-16 top-0 left-[1300px] bg-black flex flex-col gap-6 justify-start items-center pt-4 pr-5 pb-5 pl-5">
    </div>
    <div className="absolute w-[340px] h-fit top-0 left-[1740px] bg-black flex flex-col gap-6 justify-start items-center pt-4 pr-5 pb-5 pl-5">
    </div>
    <div className="absolute w-full max-w-7xl h-fit top-[202px] left-0 flex flex-row gap-6 justify-center items-center py-5 px-10">
    </div>
    <div className="absolute w-full max-w-7xl h-fit top-[362px] left-0 flex flex-row gap-6 justify-center items-center py-5 px-10">
    </div>
    <div className="absolute w-full max-w-7xl h-fit top-[522px] left-0 flex flex-row gap-6 justify-center items-center py-5 px-10">
    </div>
    <div className="absolute w-full max-w-7xl h-fit top-[682px] left-0 flex flex-row gap-6 justify-center items-center py-5 px-10">
    </div>
    <div className="absolute w-full max-w-7xl h-fit top-[826px] left-0 flex flex-row gap-6 justify-center items-center py-5 px-10">
    </div>
  </div>
  )
}

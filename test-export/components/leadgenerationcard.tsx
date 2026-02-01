import Image from 'next/image'
import { CardsAnimatedBorderButton } from '@/components/cards-animatedborderbutton'

export function LeadGenerationCard(props: any) {
  return (
  <div>
    <div className="absolute w-[303px] h-[280px] top-0 left-0 rounded-xl flex flex-col gap-2.5 justify-center items-center py-0 px-0">
      <div className="absolute w-full h-[1fr] top-2.5 left-2.5 rounded-xl flex flex-col gap-2.5 justify-center items-center pt-2.5 pr-0 pb-0 pl-0">
        <div className="absolute w-full h-[1fr] top-8 left-0 flex flex-col gap-[5px] justify-center items-end">
          <div className="absolute w-full h-fit bg-[var(--color-cards-ui-2)] rounded-lg flex flex-row gap-2.5 justify-start items-center p-2.5">
            <div className="absolute w-[35px] h-[35px] left-[23px] bg-[rgba(255,_255,_255,_0.12)] rounded-[36px]">
            </div>
            <div className="absolute w-full h-fit top-[19px] left-0 flex flex-col gap-[3px] justify-center items-start">
              <p className="absolute w-fit h-fit">Jack Daniel</p>
              <p className="absolute w-fit h-fit">Founder</p>
            </div>
            <div className="absolute w-6 h-6 flex flex-row gap-2.5 justify-center items-center">
            </div>
          </div>
          <div className="absolute w-full h-[1fr] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-start items-start p-2.5">
            <div className="absolute w-full h-fit flex flex-row gap-2.5 justify-center items-center">
              <div className="absolute w-[35px] h-[35px] bg-[rgba(255,_255,_255,_0.12)] rounded-[36px]">
              </div>
              <div className="absolute w-full h-fit flex flex-col gap-[3px] justify-center items-start">
                <p className="absolute w-fit h-fit">Justin Rocks</p>
                <p className="absolute w-fit h-fit">Marketing head</p>
              </div>
              <div className="absolute w-6 h-6 flex flex-row gap-2.5 justify-center items-center">
              </div>
            </div>
            <div className="absolute w-full h-[1fr] bottom-[59px] grid grid-cols-2 gap-2.5">
              <p className="absolute w-fit h-fit">E-mailjustin@main.com</p>
              <p className="absolute w-fit h-fit">Phone+1(812)98XXX</p>
              <p className="absolute w-fit h-fit">CompanyXYZ LLC</p>
              <p className="absolute w-fit h-fit">VerifiedYes</p>
            </div>
          </div>
        </div>
        <CardsAnimatedBorderButton
  ofLqZhEO8="Generate Leads"
  Rb5OgUSWE={14}
  BrUi5h7tU="rgba(255, 255, 255, 0.9)"
  PPM8eZNfR="rgb(49, 49, 49)"
  VGW0OvIrj={false}
 />
      </div>
    </div>
  </div>
  )
}

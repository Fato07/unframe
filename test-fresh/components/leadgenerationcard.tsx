import Image from 'next/image'
import { CardsAnimatedborderbutton } from '@/components/cards-animatedborderbutton'

export function Leadgenerationcard() {
  return (
  <div>
    <div className="absolute w-[303px] h-[280px] top-0 left-0 rounded-xl flex flex-col gap-2.5 justify-center items-center py-0 px-0">
      <div className="w-full h-[1fr] rounded-xl flex flex-col gap-2.5 justify-center items-center pt-2.5 pr-0 pb-0 pl-0">
        <div className="w-full h-[1fr] flex flex-col gap-[5px] justify-center items-end">
          <div className="w-full h-fit bg-[var(--color-cards-ui-2)] rounded-lg flex flex-row gap-2.5 justify-start items-center p-2.5">
            <div className="w-[35px] h-[35px] bg-[rgba(255,_255,_255,_0.12)] rounded-[36px]">
            </div>
            <div className="w-full h-fit flex flex-col gap-[3px] justify-center items-start">
              <p className="w-fit h-fit">Jack Daniel</p>
              <p className="w-fit h-fit">Founder</p>
            </div>
            <div className="w-6 h-6 flex flex-row gap-2.5 justify-center items-center">
            </div>
          </div>
          <div className="w-full h-[1fr] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-start items-start p-2.5">
            <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center">
              <div className="w-[35px] h-[35px] bg-[rgba(255,_255,_255,_0.12)] rounded-[36px]">
              </div>
              <div className="w-full h-fit flex flex-col gap-[3px] justify-center items-start">
                <p className="w-fit h-fit">Justin Rocks</p>
                <p className="w-fit h-fit">Marketing head</p>
              </div>
              <div className="w-6 h-6 flex flex-row gap-2.5 justify-center items-center">
              </div>
            </div>
            <div className="w-full h-[1fr] grid grid-cols-2 gap-2.5">
              <p className="w-fit h-fit">E-mailjustin@main.com</p>
              <p className="w-fit h-fit">Phone+1(812)98XXX</p>
              <p className="w-fit h-fit">CompanyXYZ LLC</p>
              <p className="w-fit h-fit">VerifiedYes</p>
            </div>
          </div>
        </div>
        <CardsAnimatedborderbutton
  text="Generate Leads"
  size={14}
  textColor="rgba(255, 255, 255, 0.9)"
  color="rgb(49, 49, 49)"
  enabled={false}
 />
      </div>
    </div>
  </div>
  )
}

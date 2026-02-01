import Image from 'next/image'
import { CardsCodeAnimation } from '@/components/cards-codeanimation'

export function EndToEndDevelopmentServices(props: any) {
  return (
  <div>
    <div className="absolute w-[200px] h-[200px] top-0 left-0">
      <div className="absolute h-[194px] right-0 bottom-0 left-0 bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center">
        <div className="absolute w-full h-[15px] top-[29px] left-4 bg-[var(--color-cards-ui-1)] flex flex-row gap-[5px] justify-start items-center py-0 px-2.5">
          <div className="absolute w-[5px] h-[5px] bottom-1 left-[15px] bg-[rgba(255,_51,_51,_0.5)] rounded-[5px]">
          </div>
          <div className="absolute w-[5px] h-[5px] bottom-1 left-[15px] bg-[rgba(230,_255,_0,_0.5)] rounded-[5px]">
          </div>
          <div className="absolute w-[5px] h-[5px] bottom-1 left-[15px] bg-[rgba(51,_255,_78,_0.5)] rounded-[5px]">
          </div>
        </div>
        <div className="absolute w-full h-fit top-[25px] left-0 flex flex-row gap-2.5 justify-center items-center py-0 px-[5px]">
          <CardsCodeAnimation />
        </div>
      </div>
    </div>
  </div>
  )
}

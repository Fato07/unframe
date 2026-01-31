import Image from 'next/image'

export function CardsBarchartanimation() {
  return (
  <div>
    <div className="absolute w-fit h-[50px] top-0 left-0 flex flex-row gap-[7px] justify-center items-end">
      <div className="absolute w-2 h-5 bg-[var(--color-cards-ui-1)] rounded-[1px 1px 0px 0px] flex flex-col gap-2.5 justify-center items-center">
        <div className="absolute w-2 h-5 bottom-[-25px] bg-[var(--color-cards-blue-accent)]">
        </div>
      </div>
      <div className="absolute w-2 h-2.5 bg-[var(--color-cards-ui-1)] rounded-[1px 1px 0px 0px] flex flex-col gap-2.5 justify-center items-center">
        <div className="absolute w-2 h-2.5 bottom-[-15px] bg-[var(--color-cards-blue-accent)]">
        </div>
      </div>
      <div className="absolute w-2 h-[25px] bg-[rgba(255,_255,_255,_0.12)] rounded-[1px 1px 0px 0px] flex flex-col gap-2.5 justify-center items-center">
        <div className="absolute w-2 h-[25px] bottom-0 bg-[var(--color-cards-blue-accent)]">
        </div>
      </div>
      <div className="absolute w-2 h-[30px] bg-[var(--color-cards-ui-1)] rounded-[1px 1px 0px 0px] flex flex-col gap-2.5 justify-center items-center">
        <div className="absolute w-2 h-[30px] bottom-[-35px] bg-[var(--color-cards-blue-accent)]">
        </div>
      </div>
    </div>
    <div className="absolute w-fit h-[50px] top-0 left-[183px] flex flex-row gap-[7px] justify-center items-end">
    </div>
    <div className="absolute w-fit h-[50px] top-0 left-[366px] flex flex-row gap-[7px] justify-center items-end">
    </div>
    <div className="absolute w-fit h-[50px] top-0 left-[501px] flex flex-row gap-[7px] justify-center items-end">
    </div>
  </div>
  )
}

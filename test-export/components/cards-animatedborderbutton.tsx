import Image from 'next/image'

export function CardsAnimatedborderbutton() {
  return (
  <div>
    <div className="absolute w-fit h-fit top-0 left-0 bg-[rgba(255,_255,_255,_0.05)] rounded-lg flex flex-row gap-2.5 justify-between items-center py-2.5 px-5">
      <div className="absolute top-0 right-[67.5px] bottom-0 left-0 rounded-[7px]">
      </div>
      <div className="absolute top-0 right-[-0.5px] bottom-0 left-0 rounded-[7px]">
      </div>
      <div className="absolute top-0.5 right-px bottom-0.5 left-0.5 rounded-lg">
      </div>
      <p className="absolute w-fit h-fit">Running stroke</p>
      <div className="absolute w-[25px] h-[25px] left-[23px] bg-[var(--color-cards-ui-2)] rounded flex flex-row gap-2.5 justify-center items-center">
        <div className="absolute w-[15px] top-[-18px] right-[-60px] bottom-7">
        </div>
      </div>
    </div>
    <div className="absolute w-fit h-fit top-0 left-[266.5px] bg-[rgba(255,_255,_255,_0.05)] rounded-lg flex flex-row gap-2.5 justify-between items-center py-2.5 px-5">
    </div>
    <div className="absolute w-fit h-fit top-0 left-[533px] bg-[rgba(255,_255,_255,_0.05)] rounded-lg flex flex-row gap-2.5 justify-between items-center py-2.5 px-5">
    </div>
    <div className="absolute w-fit h-fit top-0 left-[799.5px] bg-[rgba(255,_255,_255,_0.05)] rounded-lg flex flex-row gap-2.5 justify-between items-center py-2.5 px-5">
    </div>
  </div>
  )
}

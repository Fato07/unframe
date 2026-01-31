import Image from 'next/image'

export function Testimonialcard() {
  return (
  <div>
    <div className="absolute w-[353px] h-fit top-0 left-0 bg-[var(--color-card-background)] rounded-[30px] flex flex-col gap-5 justify-center items-start py-5 px-[30px]">
      <div className="absolute w-[100px] h-[100px] top-[-11px] right-[-11px] bg-[rgba(81,_47,_235,_0.5)] rounded-[231px]">
      </div>
      <div className="absolute w-full h-fit flex flex-col gap-2.5 justify-center items-center">
        <p className="absolute w-full h-fit">
          "Optimize business processes and streamline operations to significantly minimize costs and maximize overall efficiency."
        </p>
      </div>
      <div className="absolute w-full h-fit flex flex-row gap-2.5 justify-start items-center">
        <div className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[3px]">
          <div className="absolute w-10 h-10 left-3 rounded-lg">
          </div>
        </div>
        <div className="absolute w-full h-fit flex flex-col justify-center items-center">
          <p className="absolute w-full h-fit">Dean watson</p>
          <p className="absolute w-full h-fit">Managing director : Farmland</p>
        </div>
      </div>
    </div>
  </div>
  )
}

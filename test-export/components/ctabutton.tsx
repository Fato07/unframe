import Image from 'next/image'

export function CTAButton(props: any) {
  return (
  <div>
    <div className="absolute w-fit h-fit top-0 left-0 rounded-lg flex flex-row gap-2.5 justify-center items-center py-2.5 px-[15px]">
      <div className="absolute w-fit h-[18px] top-3 left-0 flex flex-col gap-2.5 justify-start items-center">
        <div className="absolute w-full h-fit top-0 left-0 flex flex-row gap-[5px] justify-center items-end">
          <p className="absolute w-fit h-fit">Get in touch</p>
          <div className="absolute w-4 h-4 top-[-24px] left-[45px]">
          </div>
        </div>
        <div className="absolute w-full h-fit top-7 left-0 flex flex-row gap-[5px] justify-center items-end">
          <p className="absolute w-fit h-fit">Get in touch</p>
          <div className="absolute w-4 h-4 top-[-24px] left-[45px]">
          </div>
        </div>
      </div>
    </div>
    <div className="absolute w-fit h-fit top-[142px] left-0 rounded-lg flex flex-row gap-2.5 justify-center items-center py-2.5 px-[15px]">
    </div>
    <div className="absolute w-fit h-fit top-0 left-[231px] rounded-lg flex flex-row gap-2.5 justify-center items-center py-2 px-3">
    </div>
    <div className="absolute w-fit h-fit top-[138px] left-[231px] rounded-lg flex flex-row gap-2.5 justify-center items-center py-2 px-3">
    </div>
  </div>
  )
}

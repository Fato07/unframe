import Image from 'next/image'

export function CTAButton() {
  return (
  <div>
    <div className="absolute w-fit h-fit top-0 left-0 rounded-lg flex flex-row gap-2.5 justify-center items-center py-2.5 px-[15px]">
      <div className="w-fit h-[18px] flex flex-col gap-2.5 justify-start items-center">
        <div className="w-full h-fit flex flex-row gap-[5px] justify-center items-end">
          <p className="w-fit h-fit">Get in touch</p>
          <div className="w-4 h-4">
          </div>
        </div>
        <div className="w-full h-fit flex flex-row gap-[5px] justify-center items-end">
          <p className="w-fit h-fit">Get in touch</p>
          <div className="w-4 h-4">
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

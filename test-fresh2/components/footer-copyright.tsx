import Image from 'next/image'

export function FooterCopyright() {
  return (
  <div>
    <div className="absolute w-full max-w-7xl h-fit top-0 left-0 rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[25px] px-10">
      <div className="w-full h-fit flex flex-row gap-2.5 justify-between items-center">
        <p className="w-fit h-fit">© 2025, CodesDevs OÜ All right reserved</p>
      </div>
    </div>
    <div className="absolute w-[390px] h-fit top-0 left-[1300px] rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[25px] px-10">
    </div>
  </div>
  )
}

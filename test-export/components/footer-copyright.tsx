import Image from 'next/image'

export function FooterCopyright(props: any) {
  return (
  <div>
    <div className="absolute w-[1200px] h-fit top-0 left-0 rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[25px] px-10">
      <div className="absolute w-full h-fit top-[272px] flex flex-row gap-2.5 justify-between items-center">
        <p className="absolute w-fit h-fit top-[57px] left-[188px]">© 2025, CodesDevs OÜ All right reserved</p>
      </div>
    </div>
    <div className="absolute w-[390px] h-fit top-0 left-[1300px] rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-[25px] px-10">
    </div>
  </div>
  )
}

import Image from 'next/image'

export function ElementsBadge(props: any) {
  return (
  <div>
    <div className="absolute w-fit h-fit top-0 left-0 rounded-lg flex flex-row gap-2 justify-center items-center py-2 px-[19px]">
      <Image
        className="absolute w-[15px] h-[15px] flex flex-row gap-2.5 justify-center items-center"
        src="https://framerusercontent.com/images/ef9qyeTSc2x0goX2BOGuWMIOk.svg"
        alt=""
        fill
       />
      <p className="absolute w-fit h-fit top-1 left-[55px]">Radison</p>
    </div>
  </div>
  )
}

import Image from 'next/image'

export function ElementsBadge() {
  return (
  <div>
    <div className="absolute w-fit h-fit top-0 left-0 rounded-lg flex flex-row gap-2 justify-center items-center py-2 px-[19px]">
      <Image
        className="w-[15px] h-[15px] flex flex-row gap-2.5 justify-center items-center"
        src="https://framerusercontent.com/images/ef9qyeTSc2x0goX2BOGuWMIOk.svg"
        alt=""
        fill
       />
      <p className="w-fit h-fit">Radison</p>
    </div>
  </div>
  )
}

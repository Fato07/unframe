import Image from 'next/image'

export function NavigationHamburger() {
  return (
  <div>
    <div className="absolute w-[31px] h-[31px] top-0 left-0">
      <div className="absolute w-[27px] h-0.5 top-1.5 bg-white">
      </div>
      <div className="absolute w-[27px] h-0.5 bg-white">
      </div>
      <div className="absolute w-[27px] h-0.5 bottom-[5px] bg-white">
      </div>
    </div>
    <div className="absolute w-[31px] h-[31px] top-0 left-[131px]">
    </div>
  </div>
  )
}

import Image from 'next/image'

export function Navitems(props: any) {
  return (
  <div>
    <div className="absolute w-fit h-fit top-0 left-0 rounded flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
      <p className="absolute w-fit h-fit top-0">Process</p>
    </div>
    <div className="absolute w-fit h-fit top-[127px] left-0 bg-[var(--color-border)] rounded flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
    </div>
    <div className="absolute w-fit h-fit top-0 left-[164px] bg-[var(--color-border)] rounded flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
    </div>
  </div>
  )
}

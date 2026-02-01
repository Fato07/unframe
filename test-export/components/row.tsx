import Image from 'next/image'

export function Row(props: any) {
  return (
  <div>
    <div className="absolute w-[400px] h-fit top-0 left-0 bg-[var(--color-card-background)] rounded-[20px] flex flex-col gap-4 justify-start items-start py-[18px] px-5">
      <div className="absolute w-full h-fit left-6 rounded-[0px] flex flex-row gap-6 justify-between items-center py-0 px-0">
        <p className="absolute w-full h-fit right-0">Question</p>
        <div className="absolute w-4 h-4 right-[119px] bottom-5 flex flex-row gap-2.5 justify-center items-center">
          <div className="absolute w-[15px] h-[15px] top-[-24px] left-[-26px]">
          </div>
        </div>
      </div>
    </div>
    <div className="absolute w-[400px] h-fit top-0 left-[500px] bg-[var(--color-card-background)] rounded-[20px] flex flex-col gap-4 justify-start items-start py-[18px] px-5">
    </div>
  </div>
  )
}

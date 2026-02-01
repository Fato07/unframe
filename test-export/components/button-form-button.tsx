import Image from 'next/image'

export function ButtonFormButton(props: any) {
  return (
  <div>
    <div className="absolute w-60 h-10 top-0 left-0 bg-[var(--color-blue)] rounded-lg flex flex-row justify-center items-center">
      <p className="absolute w-fit h-fit">Submit</p>
    </div>
    <div className="absolute w-60 h-10 top-[140px] left-0 bg-[rgba(51,_51,_51,_0.85)] rounded-lg flex flex-row justify-center items-center">
    </div>
    <div className="absolute w-60 h-10 top-[280px] left-0 bg-[rgb(51,_51,_51)] rounded-lg flex flex-row justify-center items-center">
    </div>
    <div className="absolute w-60 h-10 top-0 left-[340px] bg-[var(--color-blue)] rounded-lg flex flex-row justify-center items-center">
    </div>
    <div className="absolute w-60 h-10 top-0 left-[680px] opacity-50 bg-[var(--color-blue)] rounded-lg flex flex-row justify-center items-center">
    </div>
    <div className="absolute w-60 h-10 top-0 left-[1020px] bg-[var(--color-blue)] rounded-lg flex flex-row justify-center items-center">
    </div>
    <div className="absolute w-60 h-10 top-0 left-[1360px] bg-[rgba(255,_34,_68,_0.15)] rounded-lg flex flex-row justify-center items-center">
    </div>
  </div>
  )
}

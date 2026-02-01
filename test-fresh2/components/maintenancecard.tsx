import Image from 'next/image'

export function Maintenancecard() {
  return (
  <div>
    <div className="absolute w-[280px] h-[180px] top-0 left-0 bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center">
      <div className="w-full h-[15px] bg-[var(--color-cards-ui-1)] flex flex-row gap-[5px] justify-start items-center py-0 px-2.5">
        <div className="w-[5px] h-[5px] bg-[rgba(255,_51,_51,_0.5)] rounded-[5px]">
        </div>
        <div className="w-[5px] h-[5px] bg-[rgba(230,_255,_0,_0.5)] rounded-[5px]">
        </div>
        <div className="w-[5px] h-[5px] bg-[rgba(51,_255,_78,_0.5)] rounded-[5px]">
        </div>
      </div>
      <div className="w-full h-[1fr] rounded-[0px] flex flex-row gap-[5px] justify-center items-center pt-0 pr-[3px] pb-2.5 pl-[3px]">
        <div className="w-full h-[1fr] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center pt-[5px] pr-[5px] pb-[3px] pl-[5px]">
          <div className="w-full h-fit rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
            </div>
            <p className="w-full h-fit">Security</p>
          </div>
          <div className="w-full h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center p-0.5">
            </div>
            <p className="w-full h-fit">Efficiency</p>
          </div>
          <div className="w-full h-fit rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
            </div>
            <p className="w-full h-fit">Speed</p>
          </div>
          <div className="w-full h-fit rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
              <svg className="w-3 h-3">
              </svg>
            </div>
            <p className="w-full h-fit">Accuracy</p>
          </div>
        </div>
        <div className="w-full h-[1fr] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center pt-[5px] pr-[5px] pb-[3px] pl-[5px]">
          <p className="w-full h-fit">Status:</p>
          <div className="w-full h-fit flex flex-col gap-[5px] justify-center items-center">
            <div className="w-10 h-10">
              <div className="absolute top-0 right-0 bottom-0 left-0">
              </div>
            </div>
            <div className="w-full h-fit flex flex-col gap-[5px] justify-center items-center">
              <div className="w-[70%] h-[3px] bg-[rgba(255,_255,_255,_0.5)] rounded-lg flex flex-row gap-2.5 justify-center items-center">
                <div className="w-5 h-[3px] bg-[rgba(81,_47,_235,_0.8)] rounded-lg">
                </div>
              </div>
            </div>
          </div>
          <p className="w-full h-fit">Updating:</p>
        </div>
      </div>
    </div>
  </div>
  )
}

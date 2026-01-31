import Image from 'next/image'

export function Maintenancecard() {
  return (
  <div>
    <div className="absolute w-[280px] h-[180px] top-0 left-0 bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center">
      <div className="absolute w-full h-[15px] top-[29px] left-4 bg-[var(--color-cards-ui-1)] flex flex-row gap-[5px] justify-start items-center py-0 px-2.5">
        <div className="absolute w-[5px] h-[5px] bottom-1 left-[15px] bg-[rgba(255,_51,_51,_0.5)] rounded-[5px]">
        </div>
        <div className="absolute w-[5px] h-[5px] bottom-1 left-[15px] bg-[rgba(230,_255,_0,_0.5)] rounded-[5px]">
        </div>
        <div className="absolute w-[5px] h-[5px] bottom-1 left-[15px] bg-[rgba(51,_255,_78,_0.5)] rounded-[5px]">
        </div>
      </div>
      <div className="absolute w-full h-[1fr] top-0 left-0 rounded-[0px] flex flex-row gap-[5px] justify-center items-center pt-0 pr-[3px] pb-2.5 pl-[3px]">
        <div className="absolute w-full h-[1fr] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center pt-[5px] pr-[5px] pb-[3px] pl-[5px]">
          <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
            </div>
            <p className="absolute w-full h-fit">Security</p>
          </div>
          <div className="absolute w-full h-fit top-[15px] left-0 bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center p-0.5">
            </div>
            <p className="absolute w-full h-fit">Efficiency</p>
          </div>
          <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
            </div>
            <p className="absolute w-full h-fit">Speed</p>
          </div>
          <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-[7px] justify-center items-center py-[3px] px-[5px]">
            <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
              <svg className="absolute w-3 h-3 top-0 left-0">
              </svg>
            </div>
            <p className="absolute w-full h-fit">Accuracy</p>
          </div>
        </div>
        <div className="absolute w-full h-[1fr] top-6 left-4 bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center pt-[5px] pr-[5px] pb-[3px] pl-[5px]">
          <p className="absolute w-full h-fit top-0 left-0">Status:</p>
          <div className="absolute w-full h-fit top-[34px] left-0 flex flex-col gap-[5px] justify-center items-center">
            <div className="absolute w-10 h-10">
              <div className="absolute top-0 right-0 bottom-0 left-0">
              </div>
            </div>
            <div className="absolute w-full h-fit flex flex-col gap-[5px] justify-center items-center">
              <div className="absolute w-[70%] h-[3px] bg-[rgba(255,_255,_255,_0.5)] rounded-lg flex flex-row gap-2.5 justify-center items-center">
                <div className="absolute w-5 h-[3px] left-[-20px] bg-[rgba(81,_47,_235,_0.8)] rounded-lg">
                </div>
              </div>
            </div>
          </div>
          <p className="absolute w-full h-fit top-0 left-0">Updating:</p>
        </div>
      </div>
    </div>
  </div>
  )
}

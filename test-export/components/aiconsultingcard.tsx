import Image from 'next/image'
import { CardsVoiceAnimation } from '@/components/cards-voice-animation'

export function AIconsultingcard() {
  return (
  <div>
    <div className="absolute w-[492px] h-fit top-0 left-0 rounded-xl flex flex-row gap-2.5 justify-center items-center py-2.5 px-2.5">
      <div className="absolute w-full h-[207px] top-[68px] left-[67px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center p-[5px]">
        <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <div className="absolute w-2 h-2 bg-[rgb(103,_255,_1)] rounded-[10px]">
          </div>
          <p className="absolute w-full h-fit">On Call..</p>
        </div>
        <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="absolute w-full h-fit">Mic On</p>
        </div>
        <div className="absolute w-full h-fit top-[15px] left-0 bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="absolute w-full h-fit">Video Off</p>
        </div>
        <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="absolute w-full h-fit">Caption On</p>
        </div>
        <div className="absolute w-full h-fit top-[15px] left-0 rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="absolute w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="absolute w-full h-fit">Present</p>
        </div>
        <div className="absolute w-full h-fit top-[154px] left-0 flex flex-row gap-2.5 justify-center items-center py-0 px-[5px]">
          <div className="absolute w-full h-fit bg-[rgba(255,_3,_62,_0.8)] rounded-lg flex flex-row gap-[7px] justify-center items-center py-px px-2.5">
          </div>
        </div>
      </div>
      <div className="absolute w-[2fr] h-[207px] top-[68px] left-[67px] bg-[var(--color-cards-ui-2)] rounded-lg grid grid-cols-2 gap-2.5 py-[15px] px-2.5">
        <div className="absolute w-[68px] h-[57px] top-6 left-7 bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <CardsVoiceAnimation />
          <p className="absolute w-fit h-fit top-[82px] left-[78px]">AI Developer</p>
        </div>
        <div className="absolute w-[117px] h-[84px] top-[15px] left-2.5 bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <p className="absolute w-fit h-fit top-[82px] left-[78px]">Sales expert</p>
        </div>
        <div className="absolute w-[117px] h-[84px] top-[15px] right-[-117px] bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <p className="absolute w-fit h-fit top-[82px] left-[78px]">Marketing expert</p>
        </div>
        <div className="absolute w-[117px] h-[83px] bottom-[-79px] left-[-117px] bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <CardsVoiceAnimation />
          <p className="absolute w-fit h-fit top-[82px] left-[78px]">You</p>
        </div>
      </div>
      <div className="absolute w-full h-[207px] top-[68px] left-[67px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-start items-center p-[5px]">
        <div className="absolute w-full h-fit top-[15px] left-0 flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="absolute w-full h-fit">Note Taking…</p>
        </div>
        <div className="absolute w-full h-fit bottom-2.5 flex flex-col gap-2.5 justify-center items-center py-0 px-2">
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="absolute w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="absolute w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute w-[303px] h-fit top-0 left-[592px] rounded-xl flex flex-row gap-2.5 justify-center items-start">
    </div>
  </div>
  )
}

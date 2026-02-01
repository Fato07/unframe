import Image from 'next/image'
import { CardsVoiceanimation } from '@/components/cards-voiceanimation'

export function AIconsultingcard() {
  return (
  <div>
    <div className="absolute w-[492px] h-fit top-0 left-0 rounded-xl flex flex-row gap-2.5 justify-center items-center py-2.5 px-2.5">
      <div className="w-full h-[207px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center p-[5px]">
        <div className="w-full h-fit rounded-lg flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <div className="w-2 h-2 bg-[rgb(103,_255,_1)] rounded-[10px]">
          </div>
          <p className="w-full h-fit">On Call..</p>
        </div>
        <div className="w-full h-fit rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="w-full h-fit">Mic On</p>
        </div>
        <div className="w-full h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="w-full h-fit">Video Off</p>
        </div>
        <div className="w-full h-fit rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="w-full h-fit">Caption On</p>
        </div>
        <div className="w-full h-fit rounded-lg flex flex-row gap-[7px] justify-center items-center py-[5px] px-2">
          <div className="w-[15px] h-[15px] bg-[var(--color-cards-ui-3)] rounded flex flex-row gap-2.5 justify-center items-center">
          </div>
          <p className="w-full h-fit">Present</p>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-0 px-[5px]">
          <div className="w-full h-fit bg-[rgba(255,_3,_62,_0.8)] rounded-lg flex flex-row gap-[7px] justify-center items-center py-px px-2.5">
          </div>
        </div>
      </div>
      <div className="w-[2fr] h-[207px] bg-[var(--color-cards-ui-2)] rounded-lg grid grid-cols-2 gap-2.5 py-[15px] px-2.5">
        <div className="w-[68px] h-[57px] bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <CardsVoiceanimation />
          <p className="w-fit h-fit">AI Developer</p>
        </div>
        <div className="w-[117px] h-[84px] bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <p className="w-fit h-fit">Sales expert</p>
        </div>
        <div className="w-[117px] h-[84px] bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <p className="w-fit h-fit">Marketing expert</p>
        </div>
        <div className="w-[117px] h-[83px] bg-[var(--color-cards-ui-1)] rounded-lg flex flex-col gap-2.5 justify-center items-center">
          <CardsVoiceanimation />
          <p className="w-fit h-fit">You</p>
        </div>
      </div>
      <div className="w-full h-[207px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-start items-center p-[5px]">
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Note Taking…</p>
        </div>
        <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center py-0 px-2">
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
          </div>
          <div className="w-full h-0.5 flex flex-row gap-0.5 justify-start items-center">
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
            </div>
            <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
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

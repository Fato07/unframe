import Image from 'next/image'
import { CardsAnimatedborderbutton } from '@/components/cards-animatedborderbutton'

export function Dataanalysticcard() {
  return (
  <div>
    <div className="absolute w-[493px] h-fit top-0 left-0 rounded-xl flex flex-row gap-2.5 justify-center items-center py-2.5 px-2.5">
      <div className="w-full h-[207px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[5px] justify-start items-center p-[5px]">
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Filters :</p>
        </div>
        <div className="w-full h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Work Efficiency</p>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Cost Reduction</p>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Automated Tasks</p>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Lead Nurturing</p>
        </div>
      </div>
      <div className="w-[2fr] h-[207px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-[15px] justify-start items-center py-[15px] px-2.5">
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center">
          <p className="w-full h-fit">+23%</p>
          <p className="w-full h-fit">Work Efficiency</p>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-center py-0 px-2.5">
          <div className="w-px h-[107px] bg-[rgba(255,_255,_255,_0.5)] flex flex-col gap-[15px] justify-center items-center">
            <div className="h-px bg-[rgba(255,_255,_255,_0.5)]">
            </div>
            <div className="h-px bg-[rgba(255,_255,_255,_0.5)]">
            </div>
            <div className="h-px bg-[rgba(255,_255,_255,_0.5)]">
            </div>
            <div className="h-px bg-[rgba(255,_255,_255,_0.5)]">
            </div>
            <div className="h-px bg-[rgba(255,_255,_255,_0.5)]">
            </div>
            <div className="h-px bg-[rgba(255,_255,_255,_0.5)]">
            </div>
          </div>
          <div className="w-full h-[1fr] flex flex-col gap-2.5 justify-end items-start pt-2.5 pr-[5px] pb-0 pl-[5px]">
            <div className="w-full h-[70%]">
            </div>
            <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <p className="w-fit h-fit">Day 1</p>
              <p className="w-fit h-fit">Day 2</p>
              <p className="w-fit h-fit">Day 3</p>
              <p className="w-fit h-fit">Day 4</p>
              <p className="w-fit h-fit">Day 5</p>
              <p className="w-fit h-fit">Day 6</p>
              <p className="w-fit h-fit">Day 7</p>
            </div>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center">
          <p className="w-full h-fit">
            Work efficiency in this week increased to 23% as compared to last week.
          </p>
        </div>
      </div>
      <div className="w-full h-[207px] bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-start items-center p-[5px]">
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">Overall :</p>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center">
          <p className="w-fit h-fit">48.9%</p>
        </div>
        <div className="w-[73%] h-[3px] bg-[rgba(255,_255,_255,_0.5)] rounded-[5px]">
          <div className="absolute w-[48%] top-0 bottom-0 left-[-49px] bg-[rgba(81,_47,_235,_0.8)]">
          </div>
        </div>
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-center py-[5px] px-2">
          <p className="w-full h-fit">
            Overall now you have 48.9% better system as compared to previous week
          </p>
        </div>
        <CardsAnimatedborderbutton
  text="Export"
  size={14}
  textColor="rgb(255, 255, 255)"
  color="rgb(49, 49, 49)"
  enabled={false}
 />
      </div>
    </div>
    <div className="absolute w-[303px] h-fit top-0 left-[593px] rounded-xl flex flex-row gap-2.5 justify-center items-start">
    </div>
  </div>
  )
}

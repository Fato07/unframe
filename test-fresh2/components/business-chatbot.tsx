import Image from 'next/image'
import { CardsAnimatedborderbutton } from '@/components/cards-animatedborderbutton'

export function BusinessChatbot() {
  return (
  <div>
    <div className="absolute w-[303px] h-[280px] top-0 left-0 rounded-xl flex flex-col gap-2.5 justify-center items-center">
      <div className="w-full h-fit rounded-xl flex flex-col gap-0.5 justify-center items-center">
        <div className="w-full h-fit flex flex-col justify-center items-center">
          <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-start p-2.5">
            <div className="w-[30px] h-[30px] bg-[var(--color-cards-ui-2)] rounded-md">
            </div>
            <div className="w-full h-fit bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-center items-start py-2.5 px-2.5">
              <div className="w-[55px] h-1 bg-[var(--color-cards-card-text)] rounded-sm">
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-start p-2.5">
            <div className="w-full h-fit bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-center items-end py-2.5 px-2.5">
              <div className="w-[55px] h-1 bg-[var(--color-cards-card-text)] rounded-sm">
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
            </div>
            <div className="w-[30px] h-[30px] bg-[var(--color-cards-ui-2)] rounded-md">
            </div>
          </div>
          <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-start p-2.5">
            <div className="w-[30px] h-[30px] bg-[var(--color-cards-ui-2)] rounded-md">
            </div>
            <div className="w-full h-fit bg-[var(--color-cards-ui-2)] rounded-lg flex flex-col gap-2.5 justify-center items-start py-2.5 px-2.5">
              <div className="w-[55px] h-1 bg-[var(--color-cards-card-text)] rounded-sm">
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
              <div className="w-full h-[3px] flex flex-row gap-0.5 justify-start items-center">
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
                <div className="w-full h-[1fr] bg-[var(--color-cards-card-lines)] rounded-sm">
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardsAnimatedborderbutton
  text="Ask me something.."
  size={14}
  textColor="rgba(255, 255, 255, 0.8)"
  color="rgb(49, 49, 49)"
  enabled
 />
      </div>
    </div>
  </div>
  )
}

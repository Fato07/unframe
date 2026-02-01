import Image from 'next/image'
import { CTAButton } from '@/components/cta-button'
import { PricingPlanfeatures } from '@/components/pricing-planfeatures'

export function PricingPlan() {
  return (
  <div>
    <div className="absolute w-[1120px] h-fit top-0 left-0 flex flex-col gap-[30px] justify-center items-center">
      <div className="w-fit h-fit bg-[var(--color-card-background)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
        <div className="w-fit h-fit rounded-[0px] flex flex-row gap-2.5 justify-center items-center py-2 px-2.5">
          <p className="w-fit h-fit">Annually</p>
        </div>
        <div className="w-fit h-fit rounded-[0px] flex flex-row gap-2.5 justify-center items-center py-2 px-2.5">
          <p className="w-fit h-fit">Monthly</p>
        </div>
        <div className="w-[79px] h-[35px] bg-[var(--color-blue)] rounded-lg">
        </div>
      </div>
      <div className="w-full h-fit grid grid-cols-3 gap-[30px]">
        <div className="w-[332px] h-fit rounded-[30px] flex flex-col gap-[35px] justify-center items-center p-[30px]">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-start">
            <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <div className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
                <div className="w-[15px] h-[15px]">
                </div>
              </div>
              <p className="w-fit h-fit">Basic</p>
            </div>
            <div className="w-fit h-fit">$480/month</div>
            <p className="w-full h-fit">
              Essential tools and features for starting your journey with ease.
            </p>
          </div>
          <CTAButton
  text="Go with this plan"
  color="rgb(81, 47, 235)"
  enabled
  href="https://www.framer.com?via=kanishkdubey"
  size={15}
 />
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <PricingPlanfeatures text="Baisc workflow automation" />
            <PricingPlanfeatures text="Basic chatbot development" />
            <PricingPlanfeatures text="60 content request" />
            <PricingPlanfeatures text="E-mail support" />
            <PricingPlanfeatures text="1 consultation a month" />
          </div>
        </div>
        <div className="w-[353px] h-fit rounded-[30px] flex flex-col gap-[35px] justify-center items-center p-[30px]">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-start">
            <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <div className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
                <div className="w-[15px] h-[15px]">
                </div>
              </div>
              <p className="w-fit h-fit">Professional</p>
            </div>
            <div className="w-fit h-fit">$960/month</div>
            <p className="w-full h-fit">
              Advanced capabilities designed to meet growing business needs.
            </p>
          </div>
          <CTAButton
  text="Go with this plan"
  color="rgb(81, 47, 235)"
  enabled
  href="https://www.framer.com?via=kanishkdubey"
  size={15}
 />
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <PricingPlanfeatures text="Advance workflow automation" />
            <PricingPlanfeatures text="Advance chatbot development" />
            <PricingPlanfeatures text="150 content request" />
            <PricingPlanfeatures text="E-mail support" />
            <PricingPlanfeatures text="2 consultation a month" />
          </div>
        </div>
        <div className="w-[354px] h-fit rounded-[30px] flex flex-col gap-[35px] justify-center items-center p-[30px]">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-start">
            <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <div className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
                <div className="w-[15px] h-[15px]">
                </div>
              </div>
              <p className="w-fit h-fit">Enterprises</p>
            </div>
            <p className="w-fit h-fit">Custom</p>
            <p className="w-full h-fit">
              Comprehensive solutions tailored for large-scale business success.
            </p>
          </div>
          <CTAButton
  text="Schedule a call"
  color="rgb(81, 47, 235)"
  enabled
  text2="cal.com"
  size={15}
 />
          <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-center">
            <PricingPlanfeatures text="Custom workflow automation" />
            <PricingPlanfeatures text="Custom chatbot development" />
            <PricingPlanfeatures text="Unlimited content request" />
            <PricingPlanfeatures text="24hr priority support" />
            <PricingPlanfeatures text="Unlimited consultation a month" />
          </div>
        </div>
      </div>
    </div>
    <div className="absolute w-[1120px] h-fit top-0 left-[1220px] flex flex-col gap-[30px] justify-center items-center">
    </div>
    <div className="absolute w-[1120px] h-fit top-0 left-[2440px] flex flex-col gap-[30px] justify-center items-center">
    </div>
    <div className="absolute w-[1120px] h-fit top-0 left-[3660px] flex flex-col gap-[30px] justify-center items-center">
    </div>
    <div className="absolute w-[400px] h-fit top-0 left-[4880px] flex flex-col gap-[30px] justify-center items-center">
    </div>
    <div className="absolute w-[400px] h-fit top-0 left-[5380px] flex flex-col gap-[30px] justify-center items-center">
    </div>
  </div>
  )
}

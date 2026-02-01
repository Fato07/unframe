import Image from 'next/image'
import { CTAButton } from '@/components/ctabutton'
import { PricingPlanfeatures } from '@/components/pricing-planfeatures'

export function PricingPlan(props: any) {
  return (
  <div>
    <div className="absolute w-[1120px] h-fit top-0 left-0 flex flex-col gap-[30px] justify-center items-center">
      <div className="absolute w-fit h-fit bg-[var(--color-card-background)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
        <div className="absolute w-fit h-fit top-0 left-0 rounded-[0px] flex flex-row gap-2.5 justify-center items-center py-2 px-2.5">
          <p className="absolute w-fit h-fit">Annually</p>
        </div>
        <div className="absolute w-fit h-fit top-0 left-0 rounded-[0px] flex flex-row gap-2.5 justify-center items-center py-2 px-2.5">
          <p className="absolute w-fit h-fit">Monthly</p>
        </div>
        <div className="absolute w-[79px] h-[35px] left-[5px] bg-[var(--color-blue)] rounded-lg">
        </div>
      </div>
      <div className="absolute w-full h-fit grid grid-cols-3 gap-[30px]">
        <div className="absolute w-[332px] h-fit top-[53px] left-[75px] rounded-[30px] flex flex-col gap-[35px] justify-center items-center p-[30px]">
          <div className="absolute w-full h-fit flex flex-col gap-[15px] justify-center items-start">
            <div className="absolute w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <div className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
                <div className="absolute w-[15px] h-[15px]">
                </div>
              </div>
              <p className="absolute w-fit h-fit">Basic</p>
            </div>
            <div className="absolute w-fit h-fit">$480/month</div>
            <p className="absolute w-full h-fit">
              Essential tools and features for starting your journey with ease.
            </p>
          </div>
          <CTAButton
  NAbd17i0q="Go with this plan"
  ae3kdG3b0="rgb(81, 47, 235)"
  IHCtoN6iC
  t90xdY6CE="https://www.framer.com?via=kanishkdubey"
  yt52UU3wF={15}
 />
          <div className="absolute w-full h-fit top-[172px] left-0 flex flex-col gap-2.5 justify-center items-center">
            <PricingPlanfeatures l_U6iR6Sk="Baisc workflow automation" />
            <PricingPlanfeatures l_U6iR6Sk="Basic chatbot development" />
            <PricingPlanfeatures l_U6iR6Sk="60 content request" />
            <PricingPlanfeatures l_U6iR6Sk="E-mail support" />
            <PricingPlanfeatures l_U6iR6Sk="1 consultation a month" />
          </div>
        </div>
        <div className="absolute w-[353px] h-fit top-0 left-0 rounded-[30px] flex flex-col gap-[35px] justify-center items-center p-[30px]">
          <div className="absolute w-full h-fit flex flex-col gap-[15px] justify-center items-start">
            <div className="absolute w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <div className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
                <div className="absolute w-[15px] h-[15px]">
                </div>
              </div>
              <p className="absolute w-fit h-fit">Professional</p>
            </div>
            <div className="absolute w-fit h-fit">$960/month</div>
            <p className="absolute w-full h-fit">
              Advanced capabilities designed to meet growing business needs.
            </p>
          </div>
          <CTAButton
  NAbd17i0q="Go with this plan"
  ae3kdG3b0="rgb(81, 47, 235)"
  IHCtoN6iC
  t90xdY6CE="https://www.framer.com?via=kanishkdubey"
  yt52UU3wF={15}
 />
          <div className="absolute w-full h-fit top-[172px] left-0 flex flex-col gap-2.5 justify-center items-center">
            <PricingPlanfeatures l_U6iR6Sk="Advance workflow automation" />
            <PricingPlanfeatures l_U6iR6Sk="Advance chatbot development" />
            <PricingPlanfeatures l_U6iR6Sk="150 content request" />
            <PricingPlanfeatures l_U6iR6Sk="E-mail support" />
            <PricingPlanfeatures l_U6iR6Sk="2 consultation a month" />
          </div>
        </div>
        <div className="absolute w-[354px] h-fit top-0 right-0 rounded-[30px] flex flex-col gap-[35px] justify-center items-center p-[30px]">
          <div className="absolute w-full h-fit flex flex-col gap-[15px] justify-center items-start">
            <div className="absolute w-full h-fit flex flex-row gap-2.5 justify-start items-center">
              <div className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]">
                <div className="absolute w-[15px] h-[15px]">
                </div>
              </div>
              <p className="absolute w-fit h-fit">Enterprises</p>
            </div>
            <p className="absolute w-fit h-fit">Custom</p>
            <p className="absolute w-full h-fit">
              Comprehensive solutions tailored for large-scale business success.
            </p>
          </div>
          <CTAButton
  NAbd17i0q="Schedule a call"
  ae3kdG3b0="rgb(81, 47, 235)"
  IHCtoN6iC
  t90xdY6CE="cal.com"
  yt52UU3wF={15}
 />
          <div className="absolute w-full h-fit top-[172px] left-0 flex flex-col gap-2.5 justify-center items-center">
            <PricingPlanfeatures l_U6iR6Sk="Custom workflow automation" />
            <PricingPlanfeatures l_U6iR6Sk="Custom chatbot development" />
            <PricingPlanfeatures l_U6iR6Sk="Unlimited content request" />
            <PricingPlanfeatures l_U6iR6Sk="24hr priority support" />
            <PricingPlanfeatures l_U6iR6Sk="Unlimited consultation a month" />
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

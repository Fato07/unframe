import Image from 'next/image'
import { Row } from '@/components/row'

export function Accordion() {
  return (
  <div>
    <div className="absolute w-[1000px] h-fit top-0 left-0 rounded-[20px] flex flex-col gap-3 justify-start items-start">
      <div className="absolute w-[923px] h-[328px] opacity-60">
      </div>
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </div>
  </div>
  )
}

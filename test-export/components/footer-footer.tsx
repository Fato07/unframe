import Image from 'next/image'

export function FooterFooter() {
  return (
  <div>
    <div className="absolute w-[1200px] h-fit top-0 left-0 rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-16 px-10">
      <div className="absolute w-full h-fit max-w-[1200px] top-[50px] left-0 flex flex-row gap-2.5 justify-center items-start">
        <div className="absolute w-full h-fit top-0 left-0 flex flex-row gap-2.5 justify-center items-start">
          <div className="absolute w-[3fr] h-fit flex flex-col gap-[30px] justify-start items-start">
            <div className="absolute w-full h-fit top-0 left-0 flex flex-col gap-2.5 justify-center items-start">
              <a
                className="absolute w-fit h-fit flex flex-row gap-2.5 justify-start items-center"
                href="/"
              >
                <Image
                  className="absolute w-10 h-[38px] flex flex-row justify-center items-center"
                  src="https://framerusercontent.com/images/ef9qyeTSc2x0goX2BOGuWMIOk.svg"
                  alt=""
                  fill
                 />
                <p className="absolute w-fit h-fit">CodesDevs</p>
              </a>
              <div className="absolute w-full h-fit flex flex-row gap-2.5 justify-start items-center">
                <p className="absolute w-full h-fit max-w-[350px]">
                  Your trusted partner in AI solutions, creating smarter systems for smarter businesses.
                </p>
              </div>
            </div>
            <div className="absolute w-full h-fit top-[106px] left-0 flex flex-row gap-2.5 justify-start items-start">
              <a
                className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]"
                href="https://www.linkedin.com/company/codes-devs-ai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute w-5 h-5">
                </div>
              </a>
              <a
                className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]"
                href="https://x.com/Codesdevsai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute w-5 h-5">
                </div>
              </a>
              <a
                className="absolute w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]"
                href="https://www.instagram.com/codes.devs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute w-5 h-5">
                </div>
              </a>
            </div>
          </div>
          <div className="absolute w-full h-fit top-0 left-0 flex flex-row gap-2.5 justify-start items-start">
            <div className="absolute w-full h-fit flex flex-col gap-2.5 justify-center items-start">
              <p className="absolute w-fit h-fit top-1.5 left-[231px]">Sections</p>
              <p className="absolute w-fit h-fit" href="/#process">Process</p>
              <p className="absolute w-fit h-fit" href="/#services">Services</p>
              <p className="absolute w-fit h-fit" href="/#benefits">Benefits</p>
              <p className="absolute w-fit h-fit" href="/#contact">Contact</p>
            </div>
            <div className="absolute w-full h-fit flex flex-col gap-2.5 justify-center items-start">
              <p className="absolute w-fit h-fit top-1.5 left-[231px]">Pages</p>
              <p className="absolute w-fit h-fit" href="/">Home</p>
              <p className="absolute w-fit h-fit top-0 left-0" href="/blog">Blog</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-[923px] top-0 bottom-0 opacity-90">
      </div>
    </div>
    <div className="absolute w-[390px] h-fit top-0 left-[1300px] rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-16 px-10">
    </div>
  </div>
  )
}

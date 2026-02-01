import Image from 'next/image'

export function FooterFooter() {
  return (
  <div>
    <div className="absolute w-full max-w-7xl h-fit top-0 left-0 rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-16 px-10">
      <div className="w-full h-fit max-w-[1200px] flex flex-row gap-2.5 justify-center items-start">
        <div className="w-full h-fit flex flex-row gap-2.5 justify-center items-start">
          <div className="w-[3fr] h-fit flex flex-col gap-[30px] justify-start items-start">
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-start">
              <a
                className="w-fit h-fit flex flex-row gap-2.5 justify-start items-center"
                href="/"
              >
                <Image
                  className="w-10 h-[38px] flex flex-row justify-center items-center"
                  src="https://framerusercontent.com/images/ef9qyeTSc2x0goX2BOGuWMIOk.svg"
                  alt=""
                  fill
                 />
                <p className="w-fit h-fit">CodesDevs</p>
              </a>
              <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-center">
                <p className="w-full h-fit max-w-[350px]">
                  Your trusted partner in AI solutions, creating smarter systems for smarter businesses.
                </p>
              </div>
            </div>
            <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-start">
              <a
                className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]"
                href="https://www.linkedin.com/company/codes-devs-ai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-5 h-5">
                </div>
              </a>
              <a
                className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]"
                href="https://x.com/Codesdevsai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-5 h-5">
                </div>
              </a>
              <a
                className="w-fit h-fit bg-[var(--color-cards-ui-3)] rounded-lg flex flex-row gap-2.5 justify-center items-center p-[5px]"
                href="https://www.instagram.com/codes.devs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-5 h-5">
                </div>
              </a>
            </div>
          </div>
          <div className="w-full h-fit flex flex-row gap-2.5 justify-start items-start">
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-start">
              <p className="w-fit h-fit">Sections</p>
              <a className="w-fit h-fit" href="/#process">Process</a>
              <a className="w-fit h-fit" href="/#services">Services</a>
              <a className="w-fit h-fit" href="/#benefits">Benefits</a>
              <a className="w-fit h-fit" href="/#contact">Contact</a>
            </div>
            <div className="w-full h-fit flex flex-col gap-2.5 justify-center items-start">
              <p className="w-fit h-fit">Pages</p>
              <a className="w-fit h-fit" href="/">Home</a>
              <a className="w-fit h-fit" href="/blog">Blog</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[923px] opacity-90">
      </div>
    </div>
    <div className="absolute w-[390px] h-fit top-0 left-[1300px] rounded-[0px] flex flex-col gap-[60px] justify-center items-center py-16 px-10">
    </div>
  </div>
  )
}

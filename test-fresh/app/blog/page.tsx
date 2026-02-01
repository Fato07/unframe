import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { FooterFooter } from '@/components/footer-footer'
import { FooterCopyright } from '@/components/footer-copyright'

export default function BlogPage() {
  return (
  <div className="absolute w-full max-w-7xl h-fit top-0 left-0 bg-[var(--color-background)] flex flex-col justify-start items-center py-[33px] px-5">
    <NavigationNavbar />
    <div className="w-[103%] h-fit rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[123px] pr-10 pb-[120px] pl-10">
      <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="w-full h-fit max-w-[900px]">Blogs</h1>
          </div>
          <div className="w-full h-fit flex flex-col gap-5 justify-start items-center">
            <a
              className="w-full h-fit flex flex-row gap-[30px] justify-start items-center flex-wrap"
              href="/blog/:slug"
            >
              <div className="w-[178px] h-[100px] max-w-full rounded-xl">
              </div>
              <div className="w-full h-fit flex flex-col justify-start items-start">
                <h6 className="w-full h-fit">Title</h6>
                <p className="w-full h-fit">Content</p>
              </div>
              <div className="w-fit h-fit flex flex-row gap-2.5 justify-center items-center">
                <div className="w-fit h-fit bg-[#00000008] rounded-lg flex flex-row gap-2.5 justify-start items-start py-0 px-2">
                  <p className="w-fit h-fit">Title</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="w-[1085px] h-[184px] opacity-40">
      </div>
      <div className="w-[1085px] h-[184px] opacity-40">
      </div>
    </div>
    <FooterFooter maxWidth="1200px" />
    <FooterCopyright />
  </div>
  )
}

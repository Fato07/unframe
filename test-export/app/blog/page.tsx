import Image from 'next/image'
import { NavigationNavbar } from '@/components/navigation-navbar'
import { FooterFooter } from '@/components/footer-footer'
import { FooterCopyright } from '@/components/footer-copyright'

export default function BlogPage() {
  return (
  <div className="absolute w-[1200px] h-fit top-0 left-0 bg-[var(--color-background)] flex flex-col justify-start items-center py-[33px] px-5">
    <NavigationNavbar />
    <div className="absolute w-[103%] h-fit top-[33px] left-[-55px] rounded-[0px] flex flex-col gap-[35px] justify-center items-center pt-[123px] pr-10 pb-[120px] pl-10">
      <div className="absolute w-full h-fit top-[165px] left-0 flex flex-col gap-[15px] justify-center items-center">
        <div className="absolute w-full h-fit flex flex-col gap-8 justify-center items-center">
          <div className="absolute w-full h-fit flex flex-col gap-[15px] justify-center items-center">
            <h1 className="absolute w-full h-fit max-w-[900px] top-0 left-0">Blogs</h1>
          </div>
          <div className="absolute w-full h-fit top-0 left-0 flex flex-col gap-5 justify-start items-center">
            <a
              className="absolute w-full h-fit top-0 left-0 flex flex-row gap-[30px] justify-start items-center flex-wrap"
              href="/blog/:slug"
            >
              <div className="absolute w-[178px] h-[100px] max-w-full top-0 left-0 rounded-xl">
              </div>
              <div className="absolute w-full h-fit top-0 left-0 flex flex-col justify-start items-start">
                <h6 className="absolute w-full h-fit top-0 left-0">Title</h6>
                <p className="absolute w-full h-fit top-0 left-0">Content</p>
              </div>
              <div className="absolute w-fit h-fit top-0 left-0 flex flex-row gap-2.5 justify-center items-center">
                <div className="absolute w-fit h-fit top-0 left-0 bg-[#00000008] rounded-lg flex flex-row gap-2.5 justify-start items-start py-0 px-2">
                  <p className="absolute w-fit h-fit top-0 left-0">Title</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute w-[1085px] h-[184px] right-[-46px] bottom-[30px] opacity-40">
      </div>
      <div className="absolute w-[1085px] h-[184px] top-[30px] left-[-46px] opacity-40">
      </div>
    </div>
    <FooterFooter maxWidth="1200px" />
    <FooterCopyright />
  </div>
  )
}

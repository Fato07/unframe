// Placeholder component - would be generated from component data
export function NavigationNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur px-10 py-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-white font-semibold text-xl">CodesDevs</span>
        <div className="flex gap-6">
          <a href="/" className="text-white/70 hover:text-white transition">Home</a>
          <a href="/blog" className="text-white/70 hover:text-white transition">Blog</a>
          <a href="#features" className="text-white/70 hover:text-white transition">Features</a>
        </div>
      </div>
    </nav>
  )
}

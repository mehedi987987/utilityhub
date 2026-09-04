import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-gradient mt-8 py-10">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="text-lg font-extrabold mb-3">
            <span className="gradient-text">Utility</span><span className="text-white">Hub</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Free online tools for everyday tasks. No registration required.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-white font-semibold mb-3">Popular Tools</h3>
          <Link href="/tools/passport-photo" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Photo Maker</Link>
          <Link href="/tools/remove-bg" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Remove Background</Link>
          <Link href="/tools/image-resizer" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Image Resizer</Link>
          <Link href="/tools/image-enhancer" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Image Enhancer</Link>
        </div>
        <div>
          <h3 className="text-sm text-white font-semibold mb-3">Categories</h3>
          <Link href="/#categories" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Education</Link>
          <Link href="/#categories" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Islamic</Link>
          <Link href="/#categories" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Calculators</Link>
          <Link href="/#categories" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Image Tools</Link>
        </div>
        <div>
          <h3 className="text-sm text-white font-semibold mb-3">Company</h3>
          <Link href="/about" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">About</Link>
          <Link href="/privacy" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Privacy</Link>
          <Link href="/contact" className="block text-xs py-1.5 text-gray-500 hover:text-blue-400 transition">Contact</Link>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 mt-8 pt-6 border-t border-white/5">
        <p className="text-xs text-gray-600 text-center">© 2024 UtilityHub. All rights reserved.</p>
      </div>
    </footer>
  )
}

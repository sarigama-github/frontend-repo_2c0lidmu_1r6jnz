import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-bold">B</div>
          <span className="font-bold text-gray-900">ShowTime</span>
        </Link>
        <nav className="text-sm text-gray-600 flex items-center gap-4">
          <Link to="/" className="hover:text-gray-900">Movies</Link>
          <Link to="/test" className="hover:text-gray-900">System</Link>
        </nav>
      </div>
    </header>
  )
}

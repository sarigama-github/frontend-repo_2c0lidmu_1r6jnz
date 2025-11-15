import { Link } from 'react-router-dom'

export default function MovieCard({ movie, onSelect }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="aspect-[2/3] bg-gray-100 overflow-hidden">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{movie.title}</h3>
        <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
          <span>{(movie.genres || []).slice(0,2).join(', ')}</span>
          {movie.rating && <span className="ml-auto bg-green-600 text-white px-2 py-0.5 rounded text-[10px]">★ {movie.rating}</span>}
        </div>
        <button onClick={() => onSelect && onSelect(movie)} className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded">
          Book
        </button>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import MovieCard from './components/MovieCard'
import SeatSelector from './components/SeatSelector'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function formatDateISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [city, setCity] = useState('Mumbai')
  const [date, setDate] = useState(formatDateISO(new Date()))
  const [showtimes, setShowtimes] = useState([])
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [seatData, setSeatData] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load movies
  useEffect(() => {
    fetch(`${API}/movies`).then(r => r.json()).then(setMovies).catch(() => setMovies([]))
  }, [])

  // Load showtimes when movie/city/date changes
  useEffect(() => {
    if (!selectedMovie) return
    const params = new URLSearchParams({ movie_id: selectedMovie._id, city, date })
    fetch(`${API}/showtimes?${params.toString()}`).then(r => r.json()).then(setShowtimes).catch(() => setShowtimes([]))
  }, [selectedMovie, city, date])

  // Load seats when showtime selected
  useEffect(() => {
    if (!selectedShowtime) return
    fetch(`${API}/seats/${selectedShowtime._id}`).then(r => r.json()).then(setSeatData)
  }, [selectedShowtime])

  const dates = useMemo(() => {
    const arr = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(); d.setDate(d.getDate() + i)
      arr.push({ label: d.toDateString().slice(0, 10), value: formatDateISO(d) })
    }
    return arr
  }, [])

  function resetFlow() {
    setSelectedShowtime(null)
    setSeatData(null)
    setSelectedSeats([])
    setBooking(null)
  }

  async function handleBook() {
    if (!selectedShowtime || selectedSeats.length === 0) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtime_id: selectedShowtime._id,
          customer_name: 'Guest User',
          customer_email: 'guest@example.com',
          seats: selectedSeats
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Booking failed')
      setBooking(data)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero / Filters */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Book Movies</h1>
            <div className="flex gap-2 items-center">
              <select value={city} onChange={e => { setCity(e.target.value); resetFlow() }} className="px-3 py-2 rounded border bg-white">
                {['Mumbai','Delhi','Bengaluru','Chennai'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={date} onChange={e => { setDate(e.target.value); resetFlow() }} className="px-3 py-2 rounded border bg-white">
                {dates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Movies Grid or Details */}
        {!selectedMovie ? (
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movies.map(m => (
                <MovieCard key={m._id} movie={m} onSelect={(movie)=>{setSelectedMovie(movie); resetFlow()}} />
              ))}
            </div>
            {movies.length === 0 && (
              <div className="text-center text-gray-600 py-16">
                <p className="mb-3">No movies yet. Click to seed demo data.</p>
                <button onClick={async ()=>{ await fetch(`${API}/seed`, { method: 'POST'}) ; const res = await fetch(`${API}/movies`); setMovies(await res.json()) }} className="px-4 py-2 bg-red-600 text-white rounded">Seed Demo Data</button>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <button className="text-sm text-gray-600" onClick={()=> setSelectedMovie(null)}>&larr; Back to movies</button>
            <div className="flex gap-4">
              <img src={selectedMovie.poster_url} alt={selectedMovie.title} className="w-36 h-52 object-cover rounded" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedMovie.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedMovie.synopsis}</p>
                <div className="text-xs text-gray-500 mt-2">{selectedMovie.languages?.join(', ')} · {selectedMovie.genres?.join(', ')} · {selectedMovie.runtime_mins} mins</div>
              </div>
            </div>

            {/* Showtimes */}
            <div>
              <h3 className="font-semibold mb-2">Showtimes in {city} on {date}</h3>
              <div className="flex flex-col gap-3">
                {showtimes.map(st => (
                  <div key={st._id} className={`p-3 rounded border ${selectedShowtime?._id===st._id ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{st.cinema_name}</p>
                        <p className="text-xs text-gray-500">Starts at {new Date(st.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-red-600 text-white rounded" onClick={()=> setSelectedShowtime(st)}>Select</button>
                    </div>
                  </div>
                ))}
                {showtimes.length === 0 && (
                  <p className="text-sm text-gray-600">No showtimes for this selection.</p>
                )}
              </div>
            </div>

            {/* Seats */}
            {selectedShowtime && seatData && (
              <div className="space-y-3">
                <h3 className="font-semibold">Choose seats</h3>
                <SeatSelector grid={seatData.grid} selected={selectedSeats} onToggle={(code)=> setSelectedSeats(prev => prev.includes(code) ? prev.filter(s=>s!==code) : [...prev, code])} />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Selected: {selectedSeats.join(', ') || 'None'}</div>
                  <button onClick={handleBook} disabled={loading || selectedSeats.length===0} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60">
                    {loading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
                {booking && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 text-sm">Booking confirmed! ID: <span className="font-mono">{booking.booking_id}</span> · Total: ₹{booking.total}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

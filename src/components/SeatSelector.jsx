export default function SeatSelector({ grid, selected, onToggle }) {
  return (
    <div className="space-y-2">
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1 justify-center">
          {row.map((seat) => {
            const isSelected = selected.includes(seat.code)
            return (
              <button
                key={seat.code}
                disabled={!seat.available}
                onClick={() => onToggle(seat.code)}
                className={[
                  'w-8 h-8 text-xs rounded border flex items-center justify-center',
                  seat.available ? 'bg-white hover:bg-gray-50 border-gray-300' : 'bg-gray-200 border-gray-200 text-gray-400 line-through',
                  isSelected ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : ''
                ].join(' ')}
              >
                {seat.code}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

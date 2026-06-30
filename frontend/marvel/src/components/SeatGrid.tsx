import React from 'react';
import { useApp } from '../context/AppContext';
import { Tooltip } from '@mui/material';

interface SeatGridProps {
  showId: string;
  hallName: 'Silver' | 'Bronze' | 'Platinum';
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  ticketPrice: number;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  showId,
  hallName,
  selectedSeats,
  onSeatSelect,
  ticketPrice
}) => {
  const { bookings, halls } = useApp();

  // Find hall specs
  const hall = halls.find(h => h.name === hallName) || {
    rows: 6,
    columns: 10,
    seatCapacity: 60
  };

  // Find already booked seats for this show
  const bookedSeats = bookings
    .filter(b => b.showId === showId && b.status === 'Confirmed')
    .flatMap(b => b.seats);

  const rowsList = Array.from({ length: hall.rows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...
  const colsList = Array.from({ length: hall.columns }, (_, i) => i + 1); // 1, 2, 3...

  const handleSeatClick = (seatCode: string) => {
    if (bookedSeats.includes(seatCode)) return; // Can't select booked seats

    if (selectedSeats.includes(seatCode)) {
      onSeatSelect(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (selectedSeats.length >= 10) {
        alert('Maximum booking capacity is 10 seats per ticket.');
        return;
      }
      onSeatSelect([...selectedSeats, seatCode]);
    }
  };

  const getSeatColor = (seatCode: string) => {
    if (bookedSeats.includes(seatCode)) {
      return 'bg-red-600 text-white cursor-not-allowed opacity-85'; // Booked
    }
    if (selectedSeats.includes(seatCode)) {
      return 'bg-amber-400 text-black border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'; // Selected
    }
    // Available
    return 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white border-zinc-700';
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 bg-zinc-900/60 rounded-2xl border border-white/5">
      {/* Screen Visualization */}
      <div className="w-full max-w-md flex flex-col items-center mb-10">
        <div className="w-full h-2.5 bg-gradient-to-b from-[#C1121F] to-transparent rounded-full shadow-[0_-5px_15px_rgba(193,18,31,0.6)] animate-pulse" />
        <span className="text-xs text-gray-500 font-bold uppercase tracking-[0.25em] mt-3">SCREEN THIS WAY</span>
      </div>

      {/* Seats Layout Grid */}
      <div className="flex flex-col gap-3 overflow-x-auto w-full max-w-2xl px-4 py-2 pb-6">
        {rowsList.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2.5 min-w-[480px]">
            {/* Row Identifier left */}
            <span className="w-5 text-sm font-bold text-gray-600 text-center">{row}</span>

            {/* Seats */}
            {colsList.map((col) => {
              const seatCode = `${row}${col}`;
              const isBooked = bookedSeats.includes(seatCode);
              
              return (
                <Tooltip
                  key={col}
                  title={`${hallName} Hall - Seat ${seatCode} (Price: $${ticketPrice})`}
                  arrow
                  placement="top"
                >
                  <button
                    onClick={() => handleSeatClick(seatCode)}
                    disabled={isBooked}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all duration-200 ${getSeatColor(seatCode)}`}
                  >
                    <span className="scale-75 sm:scale-100">{seatCode}</span>
                  </button>
                </Tooltip>
              );
            })}

            {/* Row Identifier right */}
            <span className="w-5 text-sm font-bold text-gray-600 text-center">{row}</span>
          </div>
        ))}
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 border-t border-white/5 pt-6 w-full text-xs sm:text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 block" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-red-600 block" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-amber-400 block" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 opacity-40 block relative overflow-hidden">
            <span className="absolute inset-0 bg-red-800/10" />
          </span>
          <span>Disabled</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;

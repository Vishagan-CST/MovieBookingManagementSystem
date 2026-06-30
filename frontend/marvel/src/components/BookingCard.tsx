import React from 'react';
import type { Booking } from '../types';
import { Button, Card } from '@mui/material';
import { LocalActivity, Cancel, GetApp } from '@mui/icons-material';

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
  onDownload: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, onDownload }) => {
  const isConfirmed = booking.status === 'Confirmed';
  
  // Can cancel if the show date is today or in the future
  const showDate = new Date(booking.showDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  const canCancel = isConfirmed && (showDate >= today);

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, overflow: 'visible', position: 'relative' }}>
      
      {/* Confirmed / Cancelled Badge */}
      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
        isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}>
        {booking.status}
      </div>

      {/* Poster */}
      <div className="w-full sm:w-44 flex-shrink-0 relative overflow-hidden aspect-[2/3] sm:aspect-auto">
        <img
          src={booking.moviePoster}
          alt={booking.movieTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      </div>

      {/* Ticket Details */}
      <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 mb-1.5">
            <LocalActivity sx={{ fontSize: 16 }} />
            <span className="text-xs font-bold tracking-widest uppercase">{booking.hallName} Hall</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            {booking.movieTitle}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-black/20 p-3.5 rounded-xl border border-white/5">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-white mt-0.5">{booking.showDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time</p>
              <p className="text-sm font-semibold text-white mt-0.5">{booking.showTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Seats</p>
              <p className="text-sm font-semibold text-amber-400 mt-0.5 truncate">{booking.seats.join(', ')}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ref Number</p>
              <p className="text-xs font-mono font-semibold text-white mt-0.5">{booking.referenceNumber}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Paid</span>
            <span className="text-lg font-bold text-[#FFD700]">${booking.totalPrice}</span>
          </div>

          <div className="flex gap-2">
            {canCancel && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Cancel />}
                onClick={() => onCancel(booking.id)}
                sx={{
                  borderRadius: 2,
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.05)',
                    borderColor: 'rgb(239, 68, 68)'
                  }
                }}
              >
                Cancel Booking
              </Button>
            )}

            {isConfirmed && (
              <Button
                variant="contained"
                size="small"
                startIcon={<GetApp />}
                onClick={() => onDownload(booking)}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#C1121F',
                  '&:hover': {
                    bgcolor: '#A00F19'
                  }
                }}
              >
                Ticket PDF
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Tear Perforation decoration on desktop */}
      <div className="hidden sm:block absolute top-0 bottom-0 left-[175px] w-[2px] border-l-2 border-dashed border-zinc-700/80 my-2" />
    </Card>
  );
};

export default BookingCard;

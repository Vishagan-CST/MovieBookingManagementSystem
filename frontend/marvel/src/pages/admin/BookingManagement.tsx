import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import { Button, TextField } from '@mui/material';
import { Cancel, CheckCircleOutlined } from '@mui/icons-material';

export const BookingManagement: React.FC = () => {
  const { bookings, cancelBooking, approveRefund } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const processedBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch =
        b.userName.toLowerCase().includes(search.toLowerCase()) ||
        b.movieTitle.toLowerCase().includes(search.toLowerCase()) ||
        b.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.userEmail.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter ? b.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Booking Management' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Customer Tickets Log" breadcrumbs={breadcrumbs} />

      {/* Filter and search controls */}
      <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex gap-4 w-full md:w-auto">
          <TextField
            size="small"
            placeholder="Search by ref, customer, movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ input: { color: 'white' }, width: { xs: '100%', sm: 260 } }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#222] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FFD700]"
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Found {processedBookings.length} booking records</span>
      </div>

      {/* Bookings log table */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/25 text-gray-500 font-bold border-b border-white/5">
                <th className="p-4 uppercase tracking-wider">Ref & Date</th>
                <th className="p-4 uppercase tracking-wider">Customer Details</th>
                <th className="p-4 uppercase tracking-wider">Movie / Showtime</th>
                <th className="p-4 uppercase tracking-wider">Seats</th>
                <th className="p-4 uppercase tracking-wider">Amount</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
                <th className="p-4 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedBookings.map((b) => {
                const isConfirmed = b.status === 'Confirmed';
                return (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-white text-sm">{b.referenceNumber}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-medium">{new Date(b.bookingDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{b.userName}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{b.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 font-bold leading-tight">{b.movieTitle}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{b.hallName} Hall &bull; {b.showTime}</p>
                    </td>
                    <td className="p-4 text-[#FFD700] font-black">{b.seats.join(', ')}</td>
                    <td className="p-4">
                      <p className="text-white font-bold">${b.totalPrice}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase">Paid: {b.paymentMethod}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {isConfirmed ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => cancelBooking(b.id)}
                            startIcon={<Cancel />}
                            sx={{
                              py: 0.5,
                              px: 1.5,
                              fontSize: '10px',
                              color: '#FF6B6B',
                              borderColor: 'rgba(255, 107, 107, 0.2)',
                              '&:hover': { borderColor: '#FF6B6B', bgcolor: 'rgba(255, 107, 107, 0.05)' }
                            }}
                          >
                            Cancel Ticket
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => approveRefund(b.id)}
                            startIcon={<CheckCircleOutlined />}
                            sx={{
                              py: 0.5,
                              px: 1.5,
                              fontSize: '10px',
                              color: '#34D399',
                              borderColor: 'rgba(52, 211, 153, 0.2)',
                              '&:hover': { borderColor: '#34D399', bgcolor: 'rgba(52, 211, 153, 0.05)' }
                            }}
                          >
                            Approve Refund
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BookingManagement;

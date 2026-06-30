import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import { Card, Typography } from '@mui/material';
import {
  Movie as MovieIcon,
  People as PeopleIcon,
  BookOnline as BookingIcon,
  AttachMoney as MoneyIcon,
  TrendingUp
} from '@mui/icons-material';

export const AdminDashboard: React.FC = () => {
  const { movies, bookings, users } = useApp();

  // 1. Analytical calculations
  const stats = useMemo(() => {
    const totalMovies = movies.length;
    const activeMovies = movies.filter(m => m.status === 'Now Showing').length;
    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return { totalMovies, activeMovies, totalCustomers, totalBookings, totalRevenue };
  }, [movies, bookings, users]);

  // 2. Movie popularity stats
  const moviePopularity = useMemo(() => {
    const counts: { [key: string]: number } = {};
    bookings.filter(b => b.status === 'Confirmed').forEach(b => {
      counts[b.movieTitle] = (counts[b.movieTitle] || 0) + b.seats.length;
    });
    
    return Object.entries(counts)
      .map(([title, tickets]) => ({ title, tickets }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 4);
  }, [bookings]);

  // 3. Weekly Booking activity mock
  const weeklyActivity = [
    { day: 'Mon', bookings: 12 },
    { day: 'Tue', bookings: 19 },
    { day: 'Wed', bookings: 15 },
    { day: 'Thu', bookings: 25 },
    { day: 'Fri', bookings: 38 },
    { day: 'Sat', bookings: 54 },
    { day: 'Sun', bookings: 42 }
  ];

  // 4. Monthly Revenue activity mock
  const monthlyRevenue = [
    { month: 'Jan', rev: 1800 },
    { month: 'Feb', rev: 2400 },
    { month: 'Mar', rev: 3100 },
    { month: 'Apr', rev: 2800 },
    { month: 'May', rev: 4200 },
    { month: 'Jun', rev: 5900 }
  ];

  const recentBookings = useMemo(() => {
    return bookings.slice(0, 5);
  }, [bookings]);

  const breadcrumbs = [{ label: 'Admin Dashboard' }];

  return (
    <div className="space-y-8">
      <Header title="Administrative Console" breadcrumbs={breadcrumbs} />

      {/* 1. ANALYTICAL STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120 }}>
          <div className="flex justify-between items-center text-gray-500">
            <Typography variant="caption" className="font-bold uppercase tracking-wider">Total Movies</Typography>
            <MovieIcon className="text-red-500" />
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-black text-white">{stats.totalMovies}</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">{stats.activeMovies} Active Now</p>
          </div>
        </Card>

        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120 }}>
          <div className="flex justify-between items-center text-gray-500">
            <Typography variant="caption" className="font-bold uppercase tracking-wider">Customers</Typography>
            <PeopleIcon className="text-sky-400" />
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-black text-white">{stats.totalCustomers}</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">Registered profiles</p>
          </div>
        </Card>

        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120 }}>
          <div className="flex justify-between items-center text-gray-500">
            <Typography variant="caption" className="font-bold uppercase tracking-wider">Bookings</Typography>
            <BookingIcon className="text-[#FFD700]" />
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-black text-white">{stats.totalBookings}</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">All-time reservations</p>
          </div>
        </Card>

        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120 }}>
          <div className="flex justify-between items-center text-gray-500">
            <Typography variant="caption" className="font-bold uppercase tracking-wider">Gross Revenue</Typography>
            <MoneyIcon className="text-emerald-400" />
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-black text-white">${stats.totalRevenue}</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">Accumulated sales</p>
          </div>
        </Card>

        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120, background: 'linear-gradient(to bottom right, rgba(120, 0, 0, 0.15), #1A1A1A)' }}>
          <div className="flex justify-between items-center text-gray-500">
            <Typography variant="caption" className="font-bold uppercase tracking-wider">Growth</Typography>
            <TrendingUp className="text-red-500" />
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-black text-red-500">+14.2%</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">Monthly increase</p>
          </div>
        </Card>
      </div>

      {/* 2. CHARTS GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bookings Per Day Chart (Pure CSS Bar Chart) */}
        <div className="md:col-span-6">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Daily Ticket Bookings</h3>
              <div className="flex items-end justify-between h-40 pt-4 px-2">
                {weeklyActivity.map((d, i) => {
                  const percent = Math.min(100, Math.round((d.bookings / 60) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-1/12 group cursor-pointer">
                      <div className="relative w-full flex justify-center">
                        <span className="absolute -top-7 bg-black text-[#FFD700] text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.bookings}
                        </span>
                        <div
                          style={{ height: `${percent}%` }}
                          className="w-4 bg-gradient-to-t from-[#780000] to-[#C1121F] rounded-t group-hover:from-amber-500 group-hover:to-amber-400 transition-all duration-350"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Per Month (CSS Bar chart) */}
        <div className="md:col-span-6">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Monthly Gross Revenue</h3>
              <div className="flex items-end justify-between h-40 pt-4 px-2">
                {monthlyRevenue.map((m, i) => {
                  const percent = Math.min(100, Math.round((m.rev / 7000) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-2/12 group cursor-pointer">
                      <div className="relative w-full flex justify-center">
                        <span className="absolute -top-7 bg-black text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ${m.rev}
                        </span>
                        <div
                          style={{ height: `${percent}%` }}
                          className="w-8 bg-gradient-to-t from-emerald-950 to-emerald-400 rounded-t group-hover:from-[#C1121F] group-hover:to-red-500 transition-all duration-350"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Movie Popularity Rates (Horizontal Progress Bars) */}
        <div className="md:col-span-12">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Movie Popularity (Ticket Sales)</h3>
            {moviePopularity.length === 0 ? (
              <p className="text-gray-500 text-xs py-2">No bookings recorded yet</p>
            ) : (
              <div className="space-y-4">
                {moviePopularity.map((mp, i) => {
                  const maxTickets = Math.max(...moviePopularity.map(m => m.tickets));
                  const percentage = Math.round((mp.tickets / maxTickets) * 100);
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-white">{mp.title}</span>
                        <span className="text-[#FFD700]">{mp.tickets} seats booked</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="h-full bg-gradient-to-r from-[#C1121F] to-amber-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. RECENT BOOKINGS LOG TABLE */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recent Booking Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/25 text-gray-500 font-bold border-b border-white/5">
                <th className="p-4 uppercase tracking-wider">Ref Number</th>
                <th className="p-4 uppercase tracking-wider">Customer</th>
                <th className="p-4 uppercase tracking-wider">Movie</th>
                <th className="p-4 uppercase tracking-wider">Seats</th>
                <th className="p-4 uppercase tracking-wider">Total Price</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
                <th className="p-4 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{b.referenceNumber}</td>
                  <td className="p-4 font-semibold text-white">{b.userName}</td>
                  <td className="p-4 text-gray-300">{b.movieTitle}</td>
                  <td className="p-4 text-[#FFD700] font-semibold">{b.seats.join(', ')}</td>
                  <td className="p-4 text-white font-bold">${b.totalPrice}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-medium">{new Date(b.bookingDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

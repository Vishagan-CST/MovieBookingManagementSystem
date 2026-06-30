import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import BookingCard from '../../components/BookingCard';
import { Card, Button } from '@mui/material';
import { LocalActivity, Favorite, Notifications, EventSeat, ArrowForward } from '@mui/icons-material';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, bookings, wishlist, notifications, cancelBooking } = useApp();
  const navigate = useNavigate();

  // Find user bookings
  const userBookings = useMemo(() => {
    return bookings.filter(b => b.userId === currentUser?.id);
  }, [bookings, currentUser]);

  const upcomingBookings = useMemo(() => {
    return userBookings.filter(b => b.status === 'Confirmed');
  }, [userBookings]);

  const recentBookings = useMemo(() => {
    return userBookings.slice(0, 2);
  }, [userBookings]);

  const handleDownloadTicket = (booking: any) => {
    alert(`Downloading Ticket PDF for booking ref: ${booking.referenceNumber}`);
  };

  const breadcrumbs = [{ label: 'Dashboard' }];

  return (
    <div className="space-y-8">
      <Header title="My Dashboard" breadcrumbs={breadcrumbs} />

      {/* 1. WELCOME CARD */}
      <div className="bg-gradient-to-r from-[#C1121F] to-[#780000] p-6 md:p-8 rounded-3xl border border-red-500/10 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-poppins">
            Welcome Back, {currentUser?.name}!
          </h2>
          <p className="text-red-200 text-sm mt-1 max-w-md">
            Ready for your next movie? Select a show, choose your favorite seats in Regal Cinema, and checkout instantly.
          </p>
        </div>

        <Button
          variant="contained"
          onClick={() => navigate('/booking')}
          startIcon={<LocalActivity />}
          sx={{
            bgcolor: '#FFFFFF',
            color: '#C1121F',
            px: 4,
            py: 1.2,
            alignSelf: { xs: 'start', sm: 'center' },
            '&:hover': {
              bgcolor: '#F3F4F6'
            }
          }}
        >
          Book Now
        </Button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <div className="bg-[#C1121F]/10 p-3.5 rounded-2xl text-[#C1121F]">
            <EventSeat fontSize="large" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{upcomingBookings.length}</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">Upcoming Bookings</p>
          </div>
        </Card>

        <Card sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <div className="bg-amber-400/10 p-3.5 rounded-2xl text-[#FFD700]">
            <Favorite fontSize="large" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{wishlist.length}</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">Favorite Movies</p>
          </div>
        </Card>

        <Card sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <div className="bg-sky-500/10 p-3.5 rounded-2xl text-sky-400">
            <Notifications fontSize="large" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">
              {notifications.filter(n => !n.read && (n.userId === 'all' || n.userId === currentUser?.id)).length}
            </h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">Unread Alerts</p>
          </div>
        </Card>
      </div>

      {/* 3. RECENT BOOKINGS */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-3 border-[#C1121F] pl-2.5">
            Recent Bookings
          </h3>
          {userBookings.length > 2 && (
            <Link to="/customer/bookings" className="text-xs text-[#FFD700] hover:underline font-bold flex items-center gap-1">
              View All Bookings <ArrowForward sx={{ fontSize: 14 }} />
            </Link>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <div className="bg-[#1A1A1A] p-12 text-center rounded-2xl border border-white/5">
            <LocalActivity className="text-gray-600 mb-3" sx={{ fontSize: 48 }} />
            <p className="text-sm text-gray-400">You haven't booked any movies yet.</p>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/movies')}
              sx={{ color: '#FFD700', borderColor: 'rgba(255, 215, 0, 0.2)', mt: 3 }}
            >
              Browse Movies
            </Button>
          </div>
        ) : (
          <div>
            {recentBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={cancelBooking}
                onDownload={handleDownloadTicket}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerDashboard;

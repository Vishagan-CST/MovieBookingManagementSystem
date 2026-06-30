import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import BookingCard from '../../components/BookingCard';
import { Tabs, Tab } from '@mui/material';
import { LocalActivity } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const MyBookings: React.FC = () => {
  const { currentUser, bookings, cancelBooking } = useApp();
  const [filterTab, setFilterTab] = useState(0); // 0: All, 1: Confirmed, 2: Cancelled

  // Filter user bookings
  const userBookings = useMemo(() => {
    return bookings.filter(b => b.userId === currentUser?.id);
  }, [bookings, currentUser]);

  const filteredBookings = useMemo(() => {
    if (filterTab === 1) return userBookings.filter(b => b.status === 'Confirmed');
    if (filterTab === 2) return userBookings.filter(b => b.status === 'Cancelled');
    return userBookings;
  }, [userBookings, filterTab]);

  const handleDownloadTicket = async (booking: any) => {
    toast.loading(`Generating PDF for ${booking.referenceNumber}...`, { id: 'pdf-gen' });
    
    const getBase64Image = (url: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 100;
          canvas.height = img.naturalHeight || 100;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          console.error('Failed to load image for PDF:', url);
          resolve('');
        };
        img.src = url;
      });
    };

    const isLocal = booking.moviePoster?.includes('localhost') || booking.moviePoster?.includes('127.0.0.1') || booking.moviePoster?.startsWith('/');
    const rawPosterUrl = isLocal ? booking.moviePoster : `https://images.weserv.nl/?url=${encodeURIComponent(booking.moviePoster || '')}`;

    const posterB64 = booking.moviePoster ? await getBase64Image(rawPosterUrl) : '';

    const element = document.createElement('div');
    element.style.width = '400px';
    element.innerHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a1a; color: #fff; width: 400px;">
        <!-- Red Header Banner -->
        <div style="background: #C1121F; padding: 16px 20px; text-align: center;">
          <div style="font-size: 20px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: #fff;">MARVEL CINEMA</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.7); letter-spacing: 2px; margin-top: 2px; text-transform: uppercase;">Admission Ticket</div>
        </div>

        <!-- Movie Info with Poster -->
        <div style="padding: 18px 20px 14px 20px; border-bottom: 2px dashed #333;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td style="width: 75px; vertical-align: top;">
                ${posterB64 ? `<img src="${posterB64}" style="width: 70px; height: 100px; border-radius: 6px; border: 2px solid #333; display: block; object-fit: cover;" />` : `<div style="width: 70px; height: 100px; background: #333; border-radius: 6px; border: 2px solid #444;"></div>`}
              </td>
              <td style="vertical-align: top; padding-left: 14px;">
                <div style="font-size: 10px; color: #FFD700; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${booking.hallName} Hall</div>
                <div style="font-size: 18px; font-weight: 900; color: #fff; margin-top: 4px; line-height: 1.2;">${booking.movieTitle}</div>
                <div style="margin-top: 8px; font-family: monospace; font-size: 11px; color: #FFD700; background: #111; padding: 3px 8px; border-radius: 4px; display: inline-block; border: 1px solid #333;">REF: ${booking.referenceNumber}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Booking Details -->
        <div style="padding: 14px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #222; border-radius: 8px; border: 1px solid #333;">
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #333; border-right: 1px solid #333; width: 50%;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Show Date</div>
                <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${booking.showDate}</div>
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #333;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Show Time</div>
                <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${booking.showTime}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #333; border-right: 1px solid #333;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Cinema Hall</div>
                <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${booking.hallName} Hall</div>
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #333;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Seats</div>
                <div style="font-size: 13px; font-weight: bold; color: #FFD700; margin-top: 3px;">${booking.seats?.join(', ')}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #333; border-right: 1px solid #333;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Ticket Count</div>
                <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${booking.seats?.length}</div>
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #333;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Payment Method</div>
                <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px; text-transform: capitalize;">${booking.paymentMethod}</div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px 12px; text-align: center; background: #191919;">
                <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Total Amount Paid</div>
                <div style="font-size: 22px; font-weight: 900; color: #FFD700; margin-top: 3px;">$${booking.totalPrice}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="background: #111; padding: 12px 20px; text-align: center; font-size: 9px; color: #666; border-top: 1px solid #333;">
          Please present this ticket at the cinema entrance. Enjoy your show!
        </div>
      </div>
    `;
    
    const options = {
      margin: [5, 5, 5, 5],
      filename: `MarvelCinema_Ticket_${booking.referenceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, width: 400, scrollY: 0, scrollX: 0 },
      jsPDF: { unit: 'mm', format: [115, 200], orientation: 'portrait' }
    };
    
    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().from(element).set(options).save()
        .then(() => {
          toast.dismiss('pdf-gen');
          toast.success('Ticket PDF downloaded successfully!');
        })
        .catch((err: any) => {
          toast.dismiss('pdf-gen');
          console.error('PDF generation error:', err);
          toast.error('Failed to download PDF.');
        });
    } else {
      toast.dismiss('pdf-gen');
      toast.error('PDF engine not loaded yet. Please try again.');
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/customer' },
    { label: 'My Bookings' }
  ];

  return (
    <div className="space-y-8">
      <Header title="My Bookings" breadcrumbs={breadcrumbs} />

      {/* Tabs Filter */}
      <Tabs
        value={filterTab}
        onChange={(_, val) => setFilterTab(val)}
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          mb: 4,
          '& .MuiTabs-indicator': { backgroundColor: '#C1121F' },
          '& .MuiTab-root': { color: '#888' },
          '& .MuiTab-root.Mui-selected': { color: '#FFD700', fontWeight: 'bold' }
        }}
      >
        <Tab label={`All Bookings (${userBookings.length})`} />
        <Tab label={`Active (${userBookings.filter(b => b.status === 'Confirmed').length})`} />
        <Tab label={`Cancelled (${userBookings.filter(b => b.status === 'Cancelled').length})`} />
      </Tabs>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#1A1A1A] p-12 text-center rounded-2xl border border-white/5">
          <LocalActivity className="text-gray-600 mb-3 mx-auto" sx={{ fontSize: 48 }} />
          <p className="text-sm text-gray-400">No bookings found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
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
  );
};

export default MyBookings;

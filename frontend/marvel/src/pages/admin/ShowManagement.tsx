import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import Modal, { ConfirmationDialog } from '../../components/Modal';
import { Button, TextField } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export const ShowManagement: React.FC = () => {
  const { shows, movies, halls, addShow, deleteShow } = useApp();
  const [openModal, setOpenModal] = useState(false);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showIdToDelete, setShowIdToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      movieId: '',
      hallName: 'Silver' as any,
      date: '',
      startTime: '',
      endTime: ''
    }
  });

  const handleOpenAdd = () => {
    reset({
      movieId: movies[0]?.id || '',
      hallName: 'Silver',
      date: new Date().toISOString().split('T')[0],
      startTime: '12:00 PM',
      endTime: '02:30 PM'
    });
    setOpenModal(true);
  };

  const onSubmit = (data: any) => {
    addShow({
      movieId: data.movieId,
      hallName: data.hallName,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'active'
    });
    setOpenModal(false);
  };

  const handleDeleteTrigger = (id: string) => {
    setShowIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (showIdToDelete) {
      deleteShow(showIdToDelete);
      setShowIdToDelete(null);
    }
  };

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Show Management' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Auditorium Showtimes Scheduler" breadcrumbs={breadcrumbs} />

      {/* Toolbar actions */}
      <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Scheduled: {shows.length} shows</span>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
        >
          Schedule Show
        </Button>
      </div>

      {/* Scheduled Shows Table */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/25 text-gray-500 font-bold border-b border-white/5">
                <th className="p-4 uppercase tracking-wider">Movie Scheduled</th>
                <th className="p-4 uppercase tracking-wider">Hall</th>
                <th className="p-4 uppercase tracking-wider">Date & Duration</th>
                <th className="p-4 uppercase tracking-wider">Showtime</th>
                <th className="p-4 uppercase tracking-wider">Seat Rate</th>
                <th className="p-4 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={show.moviePoster} alt={show.movieTitle} className="w-10 h-14 rounded object-cover border border-white/5" />
                      <h4 className="font-bold text-white text-sm">{show.movieTitle}</h4>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{show.hallName}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 font-semibold">{show.date}</p>
                    <p className="text-[10px] text-gray-500 mt-1">capacity: {show.seatCapacity} seats</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-bold text-sm">{show.startTime}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Ends: {show.endTime}</p>
                  </td>
                  <td className="p-4 text-[#FFD700] font-black text-sm">${show.ticketPrice}</td>
                  <td className="p-4">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteTrigger(show.id)}
                      startIcon={<Delete />}
                      sx={{
                        py: 0.5,
                        px: 1.5,
                        fontSize: '10px',
                        color: '#FF6B6B',
                        borderColor: 'rgba(255, 107, 107, 0.2)',
                        '&:hover': { borderColor: '#FF6B6B', bgcolor: 'rgba(255, 107, 107, 0.05)' }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE SHOWTIMES MODAL */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Schedule Showtime Slot"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Select Movie */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase">Select Movie</label>
            <select
              {...register('movieId', { required: 'Movie is required' })}
              className="w-full bg-[#222] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700]"
            >
              {movies.filter(m => m.status !== 'Upcoming').map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* Select Hall */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase">Cinema Hall Auditorium</label>
            <select
              {...register('hallName', { required: 'Hall is required' })}
              className="w-full bg-[#222] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700]"
            >
              {halls.map(h => (
                <option key={h.id} value={h.name}>{h.name} Hall (multiplier: ×{h.priceMultiplier})</option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase">Date</label>
            <TextField
              fullWidth
              type="date"
              size="small"
              {...register('date', { required: 'Date is required' })}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Start Time</label>
              <TextField
                fullWidth
                placeholder="e.g. 05:30 PM"
                size="small"
                {...register('startTime', { required: 'Start time is required' })}
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
              />
            </div>

            {/* End Time */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">End Time</label>
              <TextField
                fullWidth
                placeholder="e.g. 08:30 PM"
                size="small"
                {...register('endTime', { required: 'End time is required' })}
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
              sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
            >
              Schedule Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Show Deletion"
        message="Are you sure you want to delete this scheduled showtime? This will invalidate any bookings already confirmed for this specific show."
        confirmText="Confirm Delete"
        severity="error"
      />

    </div>
  );
};

export default ShowManagement;

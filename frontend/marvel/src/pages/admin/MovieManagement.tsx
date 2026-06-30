import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import Modal, { ConfirmationDialog } from '../../components/Modal';
import type { Movie } from '../../types';
import { Button, TextField } from '@mui/material';
import { Add, Edit, Delete, PhotoCamera } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const MovieManagement: React.FC = () => {
  const { movies, addMovie, editMovie, deleteMovie } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [movieIdToDelete, setMovieIdToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      director: '',
      cast: '',
      genre: '',
      language: '',
      duration: 120,
      releaseDate: '',
      endDate: '',
      rating: 8.0,
      status: 'Now Showing' as any,
      posterUrl: '',
      backdropUrl: ''
    }
  });

  const posterUrlWatch = watch('posterUrl');
  const backdropUrlWatch = watch('backdropUrl');

  // Removed uploading statuses to fix lint errors, keep local logic if needed

  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Uploading poster image...');
    try {
      const response = await fetch('http://localhost:5068/api/movies/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload poster image.');
      }

      const data = await response.json();
      setValue('posterUrl', data.url);
      toast.success('Poster uploaded successfully!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to upload poster', { id: toastId });
    } finally {
      // Done
    }
  };

  const handleBackdropFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Uploading backdrop image...');
    try {
      const response = await fetch('http://localhost:5068/api/movies/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload backdrop image.');
      }

      const data = await response.json();
      setValue('backdropUrl', data.url);
      toast.success('Backdrop uploaded successfully!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to upload backdrop', { id: toastId });
    } finally {
      // Done
    }
  };

  const handleOpenAdd = () => {
    setEditingMovie(null);
    reset({
      title: '',
      description: '',
      director: '',
      cast: '',
      genre: '',
      language: 'English',
      duration: 120,
      releaseDate: '',
      endDate: '',
      rating: 8.0,
      status: 'Now Showing',
      posterUrl: '',
      backdropUrl: ''
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie);
    reset({
      title: movie.title,
      description: movie.description,
      director: movie.director,
      cast: movie.cast.join(', '),
      genre: movie.genre.join(', '),
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : '',
      endDate: movie.endDate ? movie.endDate.substring(0, 10) : '',
      rating: movie.rating,
      status: movie.status,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl
    });
    setOpenModal(true);
  };

  const onSubmit = (data: any) => {
    const castArray = data.cast.split(',').map((c: string) => c.trim()).filter(Boolean);
    const genreArray = data.genre.split(',').map((g: string) => g.trim()).filter(Boolean);

    const moviePayload = {
      title: data.title,
      description: data.description,
      director: data.director,
      cast: castArray,
      genre: genreArray,
      language: data.language,
      duration: Number(data.duration),
      releaseDate: data.releaseDate,
      endDate: data.endDate,
      rating: Number(data.rating),
      status: data.status,
      posterUrl: data.posterUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=300&q=80',
      backdropUrl: data.backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      cinemaHalls: ['Platinum', 'Silver', 'Bronze'],
      showTimes: ['12:00 PM', '03:30 PM', '07:00 PM', '10:00 PM']
    };

    if (editingMovie) {
      editMovie({
        ...moviePayload,
        id: editingMovie.id,
      });
    } else {
      addMovie(moviePayload);
    }
    setOpenModal(false);
  };

  const handleDeleteTrigger = (id: string) => {
    setMovieIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (movieIdToDelete) {
      deleteMovie(movieIdToDelete);
      setMovieIdToDelete(null);
    }
  };

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Movie Management' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Movie Catalog Management" breadcrumbs={breadcrumbs} />

      {/* Toolbar actions */}
      <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total: {movies.length} Movies</span>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
        >
          Add Movie
        </Button>
      </div>

      {/* Movies Table */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/25 text-gray-500 font-bold border-b border-white/5">
                <th className="p-4 uppercase tracking-wider">Movie Details</th>
                <th className="p-4 uppercase tracking-wider">Genre & Language</th>
                <th className="p-4 uppercase tracking-wider">Duration</th>
                <th className="p-4 uppercase tracking-wider">Rating</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
                <th className="p-4 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={movie.posterUrl} alt={movie.title} className="w-12 h-16 rounded object-cover border border-white/5" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{movie.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">Dir: {movie.director}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 font-semibold">{movie.genre.join(', ')}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{movie.language}</p>
                  </td>
                  <td className="p-4 text-white font-bold">{movie.duration} mins</td>
                  <td className="p-4 text-[#FFD700] font-black">★ {movie.rating.toFixed(1)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      movie.status === 'Now Showing' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      movie.status === 'Upcoming' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {movie.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenEdit(movie)}
                        startIcon={<Edit />}
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          fontSize: '10px',
                          color: '#FFD700',
                          borderColor: 'rgba(255, 215, 0, 0.2)',
                          '&:hover': { borderColor: '#FFD700', bgcolor: 'rgba(255, 215, 0, 0.05)' }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDeleteTrigger(movie.id)}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MOVIE MODAL */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie to Catalogue'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Title */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Movie Title</label>
              <TextField
                fullWidth
                size="small"
                {...register('title', { required: 'Movie Title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </div>

            {/* Language */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Language & Sound</label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. English (Dolby Atmos)"
                {...register('language', { required: 'Language detail is required' })}
                error={!!errors.language}
                helperText={errors.language?.message}
              />
            </div>

            {/* Director */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Director</label>
              <TextField
                fullWidth
                size="small"
                {...register('director', { required: 'Director is required' })}
                error={!!errors.director}
                helperText={errors.director?.message}
              />
            </div>

            {/* Duration */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Duration (mins)</label>
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register('duration', { required: 'Duration is required', min: 1 })}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </div>

            {/* Rating */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">IMDb Rating</label>
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register('rating', { required: 'Rating is required' })}
                error={!!errors.rating}
                helperText={errors.rating?.message}
                {...({ inputProps: { step: 0.1 } } as any)}
              />
            </div>

            {/* Cast */}
            <div className="md:col-span-12 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Cast Members (comma separated)</label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Keanu Reeves, Laurence Fishburne"
                {...register('cast', { required: 'Cast list is required' })}
                error={!!errors.cast}
                helperText={errors.cast?.message}
              />
            </div>

            {/* Genre */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Genres (comma separated)</label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Action, Sci-Fi, Adventure"
                {...register('genre', { required: 'Genre list is required' })}
                error={!!errors.genre}
                helperText={errors.genre?.message}
              />
            </div>

            {/* Status */}
            <div className="md:col-span-6 space-y-1 flex flex-col">
              <label className="text-xs text-gray-400 font-semibold uppercase mb-1">Status</label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="bg-[#222] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FFD700] text-sm"
              >
                <option value="Now Showing">Now Showing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Popular">Popular</option>
                <option value="Ended">Ended</option>
              </select>
            </div>

            {/* Release Date */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Release Date</label>
              <TextField
                fullWidth
                type="date"
                size="small"
                {...register('releaseDate', { required: 'Release date is required' })}
                error={!!errors.releaseDate}
                helperText={errors.releaseDate?.message}
              />
            </div>

            {/* End Date */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">End Date</label>
              <TextField
                fullWidth
                type="date"
                size="small"
                {...register('endDate', { required: 'End date is required' })}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            </div>

            {/* Poster Upload */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase block">Movie Poster</label>
              <div className="flex gap-4 items-center">
                <div 
                  onClick={() => document.getElementById('poster-upload-input')?.click()}
                  className="relative group cursor-pointer w-20 h-28 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-black/40 hover:border-[#C1121F] overflow-hidden transition-all shrink-0"
                >
                  {posterUrlWatch ? (
                    <>
                      <img src={posterUrlWatch} alt="Poster Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <PhotoCamera sx={{ color: 'white' }} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-2 text-gray-500 group-hover:text-white transition-colors">
                      <PhotoCamera fontSize="medium" className="mb-1" />
                      <span className="text-[10px] font-bold uppercase">Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    id="poster-upload-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePosterFileChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Or enter image URL..."
                    {...register('posterUrl')}
                  />
                  <p className="text-[10px] text-gray-500">Recommended ratio: 2:3. Stored locally on server.</p>
                </div>
              </div>
            </div>

            {/* Backdrop Upload */}
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase block">Backdrop Banner</label>
              <div className="flex gap-4 items-center">
                <div 
                  onClick={() => document.getElementById('backdrop-upload-input')?.click()}
                  className="relative group cursor-pointer w-28 h-20 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-black/40 hover:border-[#C1121F] overflow-hidden transition-all shrink-0"
                >
                  {backdropUrlWatch ? (
                    <>
                      <img src={backdropUrlWatch} alt="Backdrop Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <PhotoCamera sx={{ color: 'white' }} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-2 text-gray-500 group-hover:text-white transition-colors">
                      <PhotoCamera fontSize="medium" className="mb-1" />
                      <span className="text-[10px] font-bold uppercase">Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    id="backdrop-upload-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleBackdropFileChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Or enter image URL..."
                    {...register('backdropUrl')}
                  />
                  <p className="text-[10px] text-gray-500">Recommended ratio: 16:9. Stored locally on server.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-12 space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Movie Synopsis</label>
              <TextField
                fullWidth
                multiline
                rows={3}
                {...register('description', { required: 'Synopsis is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
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
              {editingMovie ? 'Save Changes' : 'Publish Movie'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Movie Deletion"
        message="Are you sure you want to delete this movie from the system? This action will cancel any upcoming shows mapped to this movie."
        confirmText="Delete"
        severity="error"
      />

    </div>
  );
};

export default MovieManagement;

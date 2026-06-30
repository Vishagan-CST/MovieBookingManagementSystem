import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import type { CinemaHall } from '../../types';
import { useForm } from 'react-hook-form';
import { Card, Button, TextField, Divider } from '@mui/material';
import { Settings, CheckCircle, Cancel } from '@mui/icons-material';

export const CinemaManagement: React.FC = () => {
  const { halls, editHallCapacity, updateHallStatus } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [activeHall, setActiveHall] = useState<CinemaHall | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      seatCapacity: 60,
      rows: 6,
      columns: 10,
      basePrice: 150
    }
  });

  const handleOpenEdit = (hall: CinemaHall) => {
    setActiveHall(hall);
    reset({
      seatCapacity: hall.seatCapacity,
      rows: hall.rows,
      columns: hall.columns,
      basePrice: hall.basePrice
    });
    setOpenModal(true);
  };

  const onSubmit = (data: any) => {
    if (activeHall) {
      editHallCapacity(
        activeHall.id,
        Number(data.seatCapacity),
        Number(data.rows),
        Number(data.columns),
        Number(data.basePrice)
      );
    }
    setOpenModal(false);
  };

  const toggleStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    updateHallStatus(id, currentStatus === 'active' ? 'inactive' : 'active');
  };

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Cinema Management' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Regal Cinema Auditorium Settings" breadcrumbs={breadcrumbs} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {halls.map((hall) => {
          const isActive = hall.status === 'active';
          return (
            <div key={hall.id}>
              <Card sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `4px solid ${
                hall.name === 'Platinum' ? '#FFD700' : hall.name === 'Silver' ? '#C0C0C0' : '#CD7F32'
              }` }}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white font-poppins">{hall.name} Hall</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-gray-500 border border-zinc-700'
                    }`}>
                      {hall.status}
                    </span>
                  </div>

                  <div className="space-y-3 mt-6 text-sm text-gray-400 bg-black/25 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between"><span className="text-gray-500">Seat Capacity:</span> <span className="text-white font-bold">{hall.seatCapacity} seats</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Grid Dimensions:</span> <span className="text-white font-bold">{hall.rows} Rows × {hall.columns} Cols</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Base Price:</span> <span className="text-white font-bold">${hall.basePrice}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Price Multiplier:</span> <span className="text-[#FFD700] font-bold">× {hall.priceMultiplier.toFixed(2)}</span></div>
                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                    <div className="flex justify-between text-white font-bold"><span>Ticket Rate:</span> <span className="text-[#FFD700]">${Math.round(hall.basePrice * hall.priceMultiplier)}</span></div>
                  </div>
                </div>

                <div className="flex gap-2 mt-8 pt-4 border-t border-white/5">
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={isActive ? <Cancel /> : <CheckCircle />}
                    onClick={() => toggleStatus(hall.id, hall.status)}
                    sx={{
                      color: isActive ? '#FF6B6B' : '#34D399',
                      borderColor: isActive ? 'rgba(255, 107, 107, 0.2)' : 'rgba(52, 211, 153, 0.2)',
                      '&:hover': {
                        borderColor: isActive ? '#FF6B6B' : '#34D399',
                        bgcolor: isActive ? 'rgba(255, 107, 107, 0.05)' : 'rgba(52, 211, 153, 0.05)'
                      }
                    }}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<Settings />}
                    onClick={() => handleOpenEdit(hall)}
                    sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
                  >
                    Configure
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* EDIT HALL CONFIGURATION MODAL */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={activeHall ? `Configure Seating & Pricing: ${activeHall.name} Hall` : 'Configure Hall'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Total Seat Capacity</label>
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register('seatCapacity', { required: 'Seat capacity is required', min: 1 })}
                error={!!errors.seatCapacity}
                helperText={errors.seatCapacity?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Base Price ($)</label>
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register('basePrice', { required: 'Base price is required', min: 1 })}
                error={!!errors.basePrice}
                helperText={errors.basePrice?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Grid Rows count</label>
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register('rows', { required: 'Rows count is required', min: 1, max: 26 })}
                error={!!errors.rows}
                helperText={errors.rows?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase">Grid Columns count</label>
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register('columns', { required: 'Columns count is required', min: 1 })}
                error={!!errors.columns}
                helperText={errors.columns?.message}
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
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default CinemaManagement;

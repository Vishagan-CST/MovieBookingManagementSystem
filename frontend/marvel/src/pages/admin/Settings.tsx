import React, { useState } from 'react';
import Header from '../../components/Header';
import { Card, TextField, Button } from '@mui/material';
import { Save, Lock } from '@mui/icons-material';
import toast from 'react-hot-toast';

import { useApp } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [ticketRules, setTicketRules] = useState({
    taxRate: 8,
    bookingTimeout: 10,
    cancellationNoticeHours: 2
  });

  React.useEffect(() => {
    if (settings) {
      setTicketRules({
        taxRate: settings.taxRate,
        bookingTimeout: settings.bookingTimeout,
        cancellationNoticeHours: settings.cancellationNoticeHours
      });
    }
  }, [settings]);

  const handleSaveRules = async () => {
    await updateSettings(ticketRules);
  };

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'System Settings' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Ticketing Parameters Configuration" breadcrumbs={breadcrumbs} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* System Settings Form */}
        <div className="md:col-span-7 space-y-6">
          <Card sx={{ p: 4 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2.5 mb-4">Ticketing Parameters</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Booking Reservation Timer (mins)</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={ticketRules.bookingTimeout}
                    onChange={(e) => setTicketRules({ ...ticketRules, bookingTimeout: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Sales Tax Rate (%)</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={ticketRules.taxRate}
                    onChange={(e) => setTicketRules({ ...ticketRules, taxRate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase">Cancellation Window Limit (hours prior to show)</label>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={ticketRules.cancellationNoticeHours}
                  onChange={(e) => setTicketRules({ ...ticketRules, cancellationNoticeHours: Number(e.target.value) })}
                />
              </div>
            </div>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveRules}
              sx={{ bgcolor: '#C1121F', mt: 4, '&:hover': { bgcolor: '#A00F19' } }}
            >
              Save Parameters
            </Button>
          </Card>
        </div>

        {/* Security Parameters */}
        <div className="md:col-span-5">
          <Card sx={{ p: 4 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2.5 mb-4">Admin Security</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Verify system integrity logs or reset master administrative passwords. Ensure two-factor credentials are active before changing parameters.
            </p>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Lock />}
              onClick={() => toast.success('MFA security check triggered')}
              sx={{ color: '#FFD700', borderColor: 'rgba(255, 215, 0, 0.2)', mt: 2 }}
            >
              Configure MFA Security
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Settings;

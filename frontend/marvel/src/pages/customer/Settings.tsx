import React, { useState } from 'react';
import Header from '../../components/Header';
import { Card, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import { Save, Settings as SettingsIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [pref, setPref] = useState({
    emailConfirm: true,
    smsConfirm: false,
    promoOffers: true,
    darkMode: true
  });

  const handleSave = () => {
    toast.success('Preferences saved successfully!');
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/customer' },
    { label: 'Settings' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Account Settings" breadcrumbs={breadcrumbs} />

      <Card sx={{ p: 4 }} className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <SettingsIcon sx={{ color: '#FFD700' }} /> Communication Preferences
          </h3>
          <p className="text-xs text-gray-500 mb-4">Choose how you want to receive tickets and alerts.</p>
          <div className="flex flex-col gap-2">
            <FormControlLabel
              control={<Switch checked={pref.emailConfirm} onChange={(e) => setPref({ ...pref, emailConfirm: e.target.checked })} color="error" />}
              label={<span className="text-sm font-medium text-gray-300">Email Confirmation Tickets</span>}
            />
            <FormControlLabel
              control={<Switch checked={pref.smsConfirm} onChange={(e) => setPref({ ...pref, smsConfirm: e.target.checked })} color="error" />}
              label={<span className="text-sm font-medium text-gray-300">SMS Booking Alerts (+Phone)</span>}
            />
          </div>
        </div>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

        <div>
          <h3 className="text-lg font-bold text-white mb-2">Promotions & Loyalty</h3>
          <p className="text-xs text-gray-500 mb-4">Stay updated with newly scheduled blockbusters and coupon discounts.</p>
          <FormControlLabel
            control={<Switch checked={pref.promoOffers} onChange={(e) => setPref({ ...pref, promoOffers: e.target.checked })} color="error" />}
            label={<span className="text-sm font-medium text-gray-300">Receive Marvel Cinema promo codes & weeknight offers</span>}
          />
        </div>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

        <div>
          <h3 className="text-lg font-bold text-white mb-2">Display Mode</h3>
          <FormControlLabel
            control={<Switch checked={pref.darkMode} disabled color="error" />}
            label={<span className="text-sm font-medium text-gray-300">Always Cinematic Dark Theme (Default)</span>}
          />
        </div>

        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
        >
          Save Preferences
        </Button>
      </Card>
    </div>
  );
};

export default Settings;

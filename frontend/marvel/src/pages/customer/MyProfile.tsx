import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import { Button, TextField, Card } from '@mui/material';
import { Save, Lock, PhotoCamera } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const MyProfile: React.FC = () => {
  const { currentUser, updateProfile, changePassword } = useApp();
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Profile Form
  const { register: profileRegister, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    }
  });

  // Password Form
  const { register: pwRegister, handleSubmit: handlePwSubmit, watch, reset: resetPw, formState: { errors: pwErrors } } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const newPasswordVal = watch('newPassword');

  const onProfileSubmit = async (data: any) => {
    setUpdatingProfile(true);
    try {
      await updateProfile(data.name, data.email, data.phone);
    } catch (err: any) {
      toast.error(err.message || 'Profile update failed');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    setUpdatingPassword(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      resetPw();
    } catch (err: any) {
      toast.error(err.message || 'Password update failed');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleAvatarChange = () => {
    document.getElementById('avatar-input')?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Uploading avatar...');
    try {
      const response = await fetch('http://localhost:5068/api/users/upload-avatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image.');
      }

      const data = await response.json();
      await updateProfile(currentUser?.name || '', currentUser?.email || '', currentUser?.phone || '', data.url);
      toast.success('Avatar uploaded successfully!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to upload avatar', { id: toastId });
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/customer' },
    { label: 'My Profile' }
  ];

  return (
    <div className="space-y-8">
      <Header title="My Profile" breadcrumbs={breadcrumbs} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Picture Uploader */}
        <div className="md:col-span-4">
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="relative group cursor-pointer mb-4" onClick={handleAvatarChange}>
              <img
                src={currentUser?.avatarUrl}
                alt={currentUser?.name}
                className="w-32 h-32 rounded-full border-4 border-[#C1121F] object-cover group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                <PhotoCamera sx={{ color: 'white' }} />
              </div>
            </div>
            <h4 className="font-bold text-white text-lg">{currentUser?.name}</h4>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{currentUser?.role}</p>
            <input
              type="file"
              id="avatar-input"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
            <Button
              size="small"
              onClick={handleAvatarChange}
              sx={{ color: '#FFD700', mt: 3 }}
            >
              Change Picture
            </Button>
          </Card>
        </div>

        {/* Profile Information Forms */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Edit Profile details */}
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="bg-[#1A1A1A] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <h3 className="text-lg font-bold border-b border-white/5 pb-2.5 mb-4">Profile Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Full Name</label>
                <TextField
                  fullWidth
                  size="small"
                  {...profileRegister('name', { required: 'Name is required' })}
                  error={!!profileErrors.name}
                  helperText={profileErrors.name?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Phone Number</label>
                <TextField
                  fullWidth
                  size="small"
                  {...profileRegister('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+]?[0-9\s-]{7,15}$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                  error={!!profileErrors.phone}
                  helperText={profileErrors.phone?.message}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
              <TextField
                fullWidth
                size="small"
                {...profileRegister('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={!!profileErrors.email}
                helperText={profileErrors.email?.message}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              disabled={updatingProfile}
              startIcon={<Save />}
              sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
            >
              {updatingProfile ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </form>

          {/* Change Password */}
          <form onSubmit={handlePwSubmit(onPasswordSubmit)} className="bg-[#1A1A1A] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <h3 className="text-lg font-bold border-b border-white/5 pb-2.5 mb-4">Change Password</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Current Password</label>
                <TextField
                  fullWidth
                  type="password"
                  size="small"
                  placeholder="••••••••"
                  {...pwRegister('currentPassword', { required: 'Current password is required' })}
                  error={!!pwErrors.currentPassword}
                  helperText={pwErrors.currentPassword?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">New Password</label>
                <TextField
                  fullWidth
                  type="password"
                  size="small"
                  placeholder="New password"
                  {...pwRegister('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={!!pwErrors.newPassword}
                  helperText={pwErrors.newPassword?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Confirm Password</label>
                <TextField
                  fullWidth
                  type="password"
                  size="small"
                  placeholder="Confirm password"
                  {...pwRegister('confirmNewPassword', {
                    required: 'Please confirm your new password',
                    validate: (val) => val === newPasswordVal || 'Passwords do not match'
                  })}
                  error={!!pwErrors.confirmNewPassword}
                  helperText={pwErrors.confirmNewPassword?.message}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              disabled={updatingPassword}
              startIcon={<Lock />}
              sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
            >
              {updatingPassword ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, TextField, Alert } from '@mui/material';
import { LocalActivity } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await resetPassword(data.email, data.password);
      navigate('/login');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#C1121F]/10 p-3 rounded-full mb-3">
            <LocalActivity sx={{ color: '#C1121F', fontSize: 36 }} />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-gray-400 text-sm mt-1 text-center font-medium">
            Set your new credentials to access your account.
          </p>
        </div>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#FF6B6B' }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email verification */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
            <TextField
              fullWidth
              placeholder="e.g. tony@stark.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">New Password</label>
            <TextField
              fullWidth
              type="password"
              placeholder="Enter new password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Confirm Password</label>
            <TextField
              fullWidth
              type="password"
              placeholder="Confirm new password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordVal || 'Passwords do not match'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: '#C1121F',
              '&:hover': { bgcolor: '#A00F19' }
            }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

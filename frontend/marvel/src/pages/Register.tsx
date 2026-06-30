import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, TextField, Divider, Alert } from '@mui/material';
import { LocalActivity, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const Register: React.FC = () => {
  const { register: registerUser } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register: formRegister, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await registerUser(data.name, data.email, data.password, data.phone);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#C1121F]/10 p-3 rounded-full mb-3">
            <LocalActivity sx={{ color: '#C1121F', fontSize: 36 }} />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-poppins">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mt-1">Get started with Marvel Cinema today</p>
        </div>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#FF6B6B' }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Full Name</label>
            <TextField
              fullWidth
              size="medium"
              placeholder="e.g. Tony Stark"
              {...formRegister('name', { required: 'Full name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
            <TextField
              fullWidth
              size="medium"
              placeholder="e.g. tony@stark.com"
              {...formRegister('email', {
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

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Phone Number</label>
            <TextField
              fullWidth
              size="medium"
              placeholder="e.g. +1 555-0199"
              {...formRegister('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[0-9\s-]{7,15}$/,
                  message: 'Invalid phone number format'
                }
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Password</label>
            <TextField
              fullWidth
              type="password"
              size="medium"
              placeholder="Choose a strong password"
              {...formRegister('password', {
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
              size="medium"
              placeholder="Repeat your password"
              {...formRegister('confirmPassword', {
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
            endIcon={<ArrowForward />}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: '#C1121F',
              '&:hover': {
                bgcolor: '#A00F19'
              }
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)', my: 3 }} />

        <div className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FFD700] hover:underline font-semibold">
            Sign In Instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

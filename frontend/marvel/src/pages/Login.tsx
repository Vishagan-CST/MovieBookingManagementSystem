import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, TextField, Divider, Alert } from '@mui/material';
import { LocalActivity, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirection target
  const from = (location.state as any)?.from?.pathname || '/';

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        // If they were booking, send them back to booking flow
        navigate(from);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
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
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to your Marvel Cinema account</p>
        </div>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#FF6B6B' }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  message: 'Invalid email address format'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#FFD700] hover:underline">
                Forgot password?
              </Link>
            </div>
            <TextField
              fullWidth
              type="password"
              size="medium"
              placeholder="Enter your password"
              {...formRegister('password', {
                required: 'Password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)', my: 3 }} />

        {/* Demo Credentials Hint */}
        <div className="bg-black/35 p-4 rounded-xl border border-white/5 mb-4 text-xs">
          <p className="text-[#FFD700] font-bold uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2 text-gray-400">
            <div>
              <p className="font-semibold text-white">Admin Access:</p>
              <p className="font-mono">admin@marvelcinema.com</p>
              <p>Password: <span className="font-semibold text-white">any</span></p>
            </div>
            <div>
              <p className="font-semibold text-white">Customer Access:</p>
              <p className="font-mono">tony@starkindustries.com</p>
              <p>Password: <span className="font-semibold text-white">any</span></p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FFD700] hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

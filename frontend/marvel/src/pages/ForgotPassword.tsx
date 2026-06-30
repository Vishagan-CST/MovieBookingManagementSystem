import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, TextField, Alert } from '@mui/material';
import { LocalActivity, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Email not found in our records.');
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
            Forgot Password
          </h2>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#FF6B6B' }}>
            {errorMsg}
          </Alert>
        )}

        {success ? (
          <div className="space-y-4">
            <Alert severity="success" sx={{ borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34D399' }}>
              Check your email! We have sent a mock password reset link to your address.
            </Alert>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/reset-password"
              sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
            >
              Go to Reset Password Screen
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
              <TextField
                fullWidth
                placeholder="tony@stark.com"
                {...register('email', {
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                bgcolor: '#C1121F',
                '&:hover': { bgcolor: '#A00F19' }
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        )}

        <div className="mt-6 flex justify-center">
          <Link to="/login" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <ArrowBack sx={{ fontSize: 14 }} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Card } from '@mui/material';
import { Room, Phone, Email, Send } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5068/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      toast.success('Your message has been sent successfully. We will get back to you soon!');
      reset();
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      toast.error(err.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[#C1121F] font-bold text-xs uppercase tracking-widest bg-red-600/10 px-3.5 py-1.5 rounded-full">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-poppins mt-4 tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-gray-400 text-sm mt-3">
            Have questions about group bookings, loyalty programs, or partnerships? Write to us.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="bg-[#C1121F]/10 p-3 rounded-full mb-3 text-[#C1121F]">
              <Room fontSize="large" />
            </div>
            <h4 className="font-bold text-white text-base">Cinema Headquarters</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs">
              100 Cinematic Boulevard, Regal Plaza, Suite 400, Los Angeles, CA 90028
            </p>
          </Card>

          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="bg-amber-400/10 p-3 rounded-full mb-3 text-[#FFD700]">
              <Phone fontSize="large" />
            </div>
            <h4 className="font-bold text-white text-base">Phone Hotline</h4>
            <p className="text-xs text-gray-550 mt-2 font-mono">
              +1 (555) 987-6543
            </p>
            <p className="text-[10px] text-gray-600 uppercase font-bold mt-1">Mon-Sun, 9AM to 10PM</p>
          </Card>

          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="bg-emerald-500/10 p-3 rounded-full mb-3 text-emerald-400">
              <Email fontSize="large" />
            </div>
            <h4 className="font-bold text-white text-base">Email Support</h4>
            <p className="text-xs text-gray-550 mt-2 font-mono">
              support@marvelcinema.com
            </p>
            <p className="text-[10px] text-gray-600 uppercase font-bold mt-1">Response within 24 hours</p>
          </Card>
        </div>

        {/* Contact Form & Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-[#1A1A1A] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold font-poppins mb-6">Send a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Your Name</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="John Doe"
                    {...register('name', { required: 'Name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="john@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Phone Number</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. +1 555-0199"
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: {
                        value: /^[+]?[0-9\s-]{7,15}$/,
                        message: 'Invalid phone format'
                      }
                    })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Subject</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. Refund request"
                    {...register('subject', { required: 'Subject is required' })}
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Your Message</label>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your message details here..."
                  {...register('message', { required: 'Message body is required' })}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={<Send />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: '#C1121F',
                  '&:hover': { bgcolor: '#A00F19' }
                }}
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Map */}
          <div>
            <div className="h-full min-h-[350px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              {/* Google Map iframe placeholder (Walk of Fame, Hollywood) */}
              <iframe
                title="Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.760243469074!2d-118.3292419!3d34.1016292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf3bbf847b31%3A0xe9cf70a04cb5fc6!2sHollywood%20Walk%20of%20Fame!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 min-h-[350px] opacity-75"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md p-3.5 rounded-xl border border-white/5 text-xs max-w-xs">
                <p className="font-bold text-white mb-0.5">Regal Cinema Plaza Location</p>
                <p className="text-gray-400">Convenient parking validated for up to 3 hours with movie tickets purchase.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;

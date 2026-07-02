import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SeatGrid from '../components/SeatGrid';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  Download,
  CreditCard,
  QrCode,
  AccountBalanceWallet,
  Paid,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { movies, shows, currentUser, bookingFlow, setBookingFlow, createBooking, settings, bookings } = useApp();

  const bookingTimeoutSeconds = useMemo(() => {
    return (settings?.bookingTimeout ?? 10) * 60;
  }, [settings]);

  // URL parameters if available
  const urlMovieId = searchParams.get('movieId');
  const urlShowId = searchParams.get('showId');

  // Steps: 0 (Select Show), 1 (Select Seats), 2 (Payment), 3 (Success)
  const [activeStep, setActiveStep] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Success Booking Object
  const [finalBooking, setFinalBooking] = useState<any>(null);

  // Form Fields for Show Selection
  const [selectedMovieId, setSelectedMovieId] = useState(urlMovieId || '');
  const [selectedShowId, setSelectedShowId] = useState(urlShowId || '');

  // Check if current user has past bookings
  const hasPastBookings = currentUser 
    ? bookings.some(b => b.userId === currentUser.id && b.status === 'Confirmed') 
    : false;

  // Payment State
  const [paymentTab, setPaymentTab] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    upiId: '',
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Load show details if showId is present in URL
  useEffect(() => {
    if (urlShowId) {
      const show = shows.find(s => s.id === urlShowId);
      if (show) {
        setSelectedMovieId(show.movieId);
        setSelectedShowId(show.id);
        setBookingFlow({
          movieId: show.movieId,
          showId: show.id,
          hallName: show.hallName,
          date: show.date,
          time: show.startTime,
          selectedSeats: [],
          totalPrice: 0
        });
        setActiveStep(1); // Skip straight to seat selection
        setTimeLeft(bookingTimeoutSeconds);
        setIsTimerRunning(true);
      }
    }
  }, [urlShowId, shows, setBookingFlow, bookingTimeoutSeconds]);

  // Synchronize timeLeft when settings load and timer is not running
  useEffect(() => {
    if (!isTimerRunning && activeStep === 0) {
      setTimeLeft(bookingTimeoutSeconds);
    }
  }, [bookingTimeoutSeconds, isTimerRunning, activeStep]);

  // Reservation Countdown Timer Effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast.error(`Your ${settings?.bookingTimeout ?? 10}-minute seat reservation has expired. Please try booking again.`, { duration: 6000 });
      setBookingFlow({});
      setActiveStep(0);
      setTimeLeft(bookingTimeoutSeconds);
    }
    return () => clearInterval(interval);
  }, [timeLeft, isTimerRunning, setBookingFlow, bookingTimeoutSeconds, settings]);

  // Format time (MM:SS)
  const formatTimer = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find show object
  const activeShow = useMemo(() => {
    return shows.find(s => s.id === selectedShowId);
  }, [shows, selectedShowId]);

  // Filter shows by selected movie
  const availableShows = useMemo(() => {
    if (!selectedMovieId) return [];
    return shows.filter(s => s.movieId === selectedMovieId && s.status === 'active');
  }, [shows, selectedMovieId]);

  // Handle movie selection
  const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const movId = e.target.value;
    setSelectedMovieId(movId);
    setSelectedShowId(''); // Reset show selection
  };

  // Handle show selection
  const handleShowSelect = (showId: string) => {
    const show = shows.find(s => s.id === showId);
    if (show) {
      setSelectedShowId(showId);
      setBookingFlow({
        movieId: show.movieId,
        showId: show.id,
        hallName: show.hallName,
        date: show.date,
        time: show.startTime,
        selectedSeats: [],
        totalPrice: 0
      });
      setIsTimerRunning(true);
      setTimeLeft(bookingTimeoutSeconds);
      setActiveStep(1);
    }
  };

  // Handle seat updates
  const handleSeatSelect = (seats: string[]) => {
    if (!activeShow) return;
    setBookingFlow(prev => ({
      ...prev,
      selectedSeats: seats,
      totalPrice: seats.length * activeShow.ticketPrice
    }));
  };

  // Check login step transitions
  const handleGoToPayment = () => {
    if (!currentUser) {
      toast.error('Please log in to continue booking tickets.');
      navigate('/login', { state: { from: { pathname: `/booking?showId=${selectedShowId}` } } });
      return;
    }
    if (!bookingFlow.selectedSeats || bookingFlow.selectedSeats.length === 0) {
      toast.error('Please select at least one seat to continue.');
      return;
    }
    setActiveStep(2);
  };

  // Complete Payment Action
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (paymentTab === 0) {
      if (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCvc || !paymentDetails.cardName) {
        toast.error('Please fill in all credit card details.');
        return;
      }
    } else if (paymentTab === 1) {
      if (!paymentDetails.upiId) {
        toast.error('Please enter your UPI Virtual Payment Address (VPA).');
        return;
      }
    }

    const method = paymentTab === 0 ? 'card' : paymentTab === 1 ? 'upi' : paymentTab === 2 ? 'wallet' : 'cash';
    
    try {
      const finalPriceToPay = (bookingFlow.totalPrice || 0) - discountAmount;
      const result = await createBooking(method as 'card' | 'upi' | 'cash' | 'wallet', finalPriceToPay);
      
      setFinalBooking(result);
      setIsTimerRunning(false);
      setActiveStep(3);
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed.');
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsApplyingPromo(true);
    try {
      const response = await fetch('http://localhost:5068/api/offers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          userId: currentUser?.id,
          showDate: activeShow?.date
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.Message || responseData.message || responseData.title || 'Invalid promo code');
      }

      const discountPercentage = responseData.discountPercentage || 0;
      const discountValue = (bookingFlow.totalPrice || 0) * (discountPercentage / 100);
      setDiscountAmount(discountValue);
      toast.success(responseData.message || 'Offer applied successfully!');
    } catch (err: any) {
      setDiscountAmount(0);
      toast.error(err.message || 'Invalid promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  return (
    <div className="bg-[#111111] min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Reservation timer bar */}
        {isTimerRunning && activeStep > 0 && activeStep < 3 && (
          <div className="fixed bottom-4 right-4 z-50 bg-[#C1121F] text-white px-5 py-3 rounded-full shadow-2xl border border-amber-400/40 flex items-center gap-2.5 animate-bounce">
            <AccessTime />
            <span className="text-sm font-bold tracking-wider">RESERVATION EXPIRES IN: <span className="font-mono text-base text-[#FFD700] ml-1">{formatTimer()}</span></span>
          </div>
        )}

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8, '& .MuiStepLabel-label': { color: '#aaa', mt: 1 }, '& .MuiStepIcon-root': { color: '#333' }, '& .MuiStepIcon-root.Mui-active': { color: '#C1121F' }, '& .MuiStepIcon-root.Mui-completed': { color: '#FFD700' } }}>
          <Step><StepLabel>Select Show</StepLabel></Step>
          <Step><StepLabel>Select Seats</StepLabel></Step>
          <Step><StepLabel>Payment Page</StepLabel></Step>
          <Step><StepLabel>Booking Success</StepLabel></Step>
        </Stepper>

        <AnimatePresence mode="wait">
          {/* STEP 0: SHOWTIME SELECT */}
          {activeStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl">
                  <h3 className="text-xl font-bold font-poppins mb-6">Choose Movie & Theater</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Select Movie</label>
                      <select
                        value={selectedMovieId}
                        onChange={handleMovieChange}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#FFD700]"
                      >
                        <option value="">-- Choose a movie --</option>
                        {movies.filter(m => m.status !== 'Upcoming').map(m => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {selectedMovieId && (
                  <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold font-poppins mb-4">Available Showtimes</h3>
                    {availableShows.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4">No active shows scheduled. Try another movie.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availableShows.map((sh) => (
                          <div
                            key={sh.id}
                            onClick={() => handleShowSelect(sh.id)}
                            className="bg-black/35 hover:bg-[#C1121F]/10 border border-white/5 hover:border-[#C1121F]/30 p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{sh.hallName} Hall</span>
                              <span className="text-xs text-[#FFD700] font-bold">${sh.ticketPrice} / Seat</span>
                            </div>
                            <h4 className="font-bold text-white text-base">{sh.startTime}</h4>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Date: {sh.date}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Side Info */}
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 h-fit shadow-xl">
                <h3 className="text-lg font-bold border-b border-white/5 pb-3 mb-4 text-[#FFD700] uppercase tracking-wider">Regal Cinema</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Standard policy: Maximum 10 seats per transaction. Booking timer secures reservation for exactly {settings?.bookingTimeout ?? 10} minutes prior to checkout.
                </p>
                <div className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Gold Premium:</span> <span className="text-white font-bold">Platinum Hall</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Economy Sound:</span> <span className="text-white font-bold">Bronze Hall</span></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: SEAT SELECTION */}
          {activeStep === 1 && activeShow && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <SeatGrid
                  showId={activeShow.id}
                  hallName={activeShow.hallName}
                  selectedSeats={bookingFlow.selectedSeats || []}
                  onSeatSelect={handleSeatSelect}
                  ticketPrice={activeShow.ticketPrice}
                />
              </div>

              {/* Booking Summary Column */}
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-2xl">
                  <h3 className="text-lg font-bold border-b border-white/5 pb-3 mb-4 text-[#FFD700]">Booking Summary</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-4">
                      <img src={activeShow.moviePoster} alt={activeShow.movieTitle} className="w-16 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-white leading-tight">{activeShow.movieTitle}</h4>
                        <span className="text-[10px] bg-red-600/20 text-[#FF5C5C] font-semibold px-2 py-0.5 rounded uppercase tracking-wider mt-1.5 inline-block">
                          {activeShow.hallName} Hall
                        </span>
                      </div>
                    </div>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><p className="text-gray-500">Date:</p><p className="font-semibold text-white mt-0.5">{activeShow.date}</p></div>
                      <div><p className="text-gray-500">Time:</p><p className="font-semibold text-white mt-0.5">{activeShow.startTime}</p></div>
                    </div>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

                    <div>
                      <p className="text-xs text-gray-500">Selected Seats ({bookingFlow.selectedSeats?.length || 0}):</p>
                      <p className="font-bold text-amber-400 mt-1">
                        {bookingFlow.selectedSeats?.length ? bookingFlow.selectedSeats.join(', ') : 'None'}
                      </p>
                    </div>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-400 font-medium">Subtotal Price</span>
                      <span className="text-2xl font-black text-[#FFD700]">${bookingFlow.totalPrice || 0}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(0);
                        setIsTimerRunning(false);
                      }}
                      startIcon={<ArrowBack />}
                      sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      Back
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleGoToPayment}
                      endIcon={<ArrowForward />}
                      sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PAYMENT */}
          {activeStep === 2 && activeShow && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Payment Methods Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1A1A1A] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
                  <h3 className="text-xl font-bold font-poppins mb-6">Payment Options</h3>
                  
                  <Tabs
                    value={paymentTab}
                    onChange={(_, val) => setPaymentTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      mb: 4,
                      '& .MuiTabs-indicator': { backgroundColor: '#C1121F' },
                      '& .MuiTab-root': { color: '#999' },
                      '& .MuiTab-root.Mui-selected': { color: '#FFD700', fontWeight: 'bold' }
                    }}
                  >
                    <Tab icon={<CreditCard sx={{ mr: 1 }} />} label="Credit/Debit Card" />
                    <Tab icon={<QrCode sx={{ mr: 1 }} />} label="FriMi / eZ Cash" />
                    <Tab icon={<AccountBalanceWallet sx={{ mr: 1 }} />} label="Bank Transfer" />
                    <Tab icon={<Paid sx={{ mr: 1 }} />} label="Cash at Cinema" />
                  </Tabs>

                  <form onSubmit={handlePaymentSubmit}>
                    {paymentTab === 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cardholder Name</label>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="John Stark"
                              value={paymentDetails.cardName}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Card Number</label>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="4111 2222 3333 4444"
                              value={paymentDetails.cardNumber}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Expiry Date</label>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="MM/YY"
                              value={paymentDetails.cardExpiry}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">CVC / CVV</label>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="123"
                              type="password"
                              value={paymentDetails.cardCvc}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvc: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentTab === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mobile Number / FriMi ID</label>
                          <TextField
                            fullWidth
                            placeholder="077XXXXXXX"
                            value={paymentDetails.upiId}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                          />
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Enter your mobile number registered with FriMi, eZ Cash, or mCash. We will send a payment request to your app.
                        </p>
                      </div>
                    )}

                    {paymentTab === 2 && (
                      <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                        <p className="text-sm font-semibold text-white">Select Bank</p>
                        <RadioGroup defaultValue="boc" className="grid grid-cols-2 gap-2 mt-3">
                          <FormControlLabel value="boc" control={<Radio color="error" />} label="BOC" />
                          <FormControlLabel value="combank" control={<Radio color="error" />} label="Commercial Bank" />
                          <FormControlLabel value="hnb" control={<Radio color="error" />} label="HNB" />
                        </RadioGroup>
                      </div>
                    )}

                    {paymentTab === 3 && (
                      <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Pay with cash at our Box Office counter within 20 minutes of booking. Tickets will be cancelled automatically if counter payment is not completed.
                        </p>
                      </div>
                    )}

                    <div className="mt-8 flex gap-3">
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(1)}
                        startIcon={<ArrowBack />}
                        sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        Back to Seats
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
                      >
                        Complete Payment (${((bookingFlow.totalPrice || 0) - discountAmount).toFixed(2)})
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Side Info */}
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 h-fit shadow-xl space-y-4">
                <h3 className="text-lg font-bold border-b border-white/5 pb-3 text-[#FFD700]">Review Booking</h3>
                <div className="text-xs space-y-2 text-gray-400">
                  <div className="flex justify-between"><span className="text-gray-500">Movie:</span> <span className="text-white font-bold">{activeShow.movieTitle}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Theater Hall:</span> <span className="text-white font-bold">{activeShow.hallName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Seats:</span> <span className="text-amber-400 font-bold">{bookingFlow.selectedSeats?.join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Ticket Price:</span> <span className="text-white font-bold">${activeShow.ticketPrice}</span></div>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between"><span className="text-emerald-500">Discount Applied:</span> <span className="text-emerald-500 font-bold">-${discountAmount.toFixed(2)}</span></div>
                  )}
                  
                  {!hasPastBookings && (
                    <div className="flex gap-2 mt-2">
                       <TextField 
                         size="small" 
                         placeholder="Promo Code" 
                         value={promoCode} 
                         onChange={(e) => setPromoCode(e.target.value)} 
                         sx={{ '& .MuiOutlinedInput-root': { color: 'white', borderColor: 'rgba(255,255,255,0.2)' } }}
                       />
                       <Button 
                         variant="outlined" 
                         onClick={handleApplyPromo}
                         disabled={isApplyingPromo || !promoCode}
                         sx={{ color: '#FFD700', borderColor: '#FFD700' }}
                       >
                         Apply
                       </Button>
                    </div>
                  )}

                  <div className="flex justify-between text-sm mt-3 pt-2 border-t border-white/10">
                     <span className="text-gray-300 font-semibold">Total Price:</span> 
                     <span className="text-[#FFD700] font-black">${((bookingFlow.totalPrice || 0) - discountAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS */}
          {activeStep === 3 && finalBooking && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-[#1E1E1E] rounded-3xl border border-white/10 shadow-2xl p-8 text-center relative overflow-hidden">
                {/* Visual success banner */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFD700]" />
                
                <div className="bg-emerald-500/10 w-fit p-4 rounded-full mx-auto mb-4 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle sx={{ fontSize: 50 }} />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold font-poppins">Booking Confirmed!</h2>
                <p className="text-gray-400 text-sm mt-1">Thank you for booking with Marvel Cinema. Have a great movie!</p>

                {/* Premium Ticket Card with Movie Poster Background */}
                <div className="mt-8 rounded-3xl border border-white/10 text-left relative overflow-visible shadow-2xl">
                  {/* Blurred movie poster background */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden z-0">
                    <img src={finalBooking.moviePoster} alt="" className="w-full h-full object-cover scale-110 blur-sm opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
                  </div>

                  <div className="relative z-10 p-6">
                    {/* Top section: Poster + Title */}
                    <div className="flex gap-5 mb-4">
                      <img 
                        src={finalBooking.moviePoster} 
                        alt={finalBooking.movieTitle}
                        className="w-24 h-36 object-cover rounded-xl border-2 border-white/15 shadow-[0_8px_30px_rgba(193,18,31,0.3)] flex-shrink-0"
                      />
                      <div className="flex flex-col justify-center">
                        <span className="w-fit text-[10px] bg-gradient-to-r from-[#C1121F]/30 to-[#FF4444]/20 text-[#FF8888] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#C1121F]/30 backdrop-blur-sm">
                          {finalBooking.hallName} Hall
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2 leading-tight tracking-tight">{finalBooking.movieTitle}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ref:</span>
                          <span className="text-xs font-mono font-bold text-[#FFD700] bg-black/50 px-2.5 py-0.5 rounded-md border border-[#FFD700]/20">{finalBooking.referenceNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket tear line with notch cutouts */}
                    <div className="relative my-5">
                      <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#1E1E1E] border-r border-white/10 z-20" />
                      <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#1E1E1E] border-l border-white/10 z-20" />
                      <div className="border-t-2 border-dashed border-white/15" />
                    </div>

                    {/* Booking details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Show Date', value: finalBooking.showDate, color: 'text-white' },
                        { label: 'Show Time', value: finalBooking.showTime, color: 'text-white' },
                        { label: 'Seats', value: finalBooking.seats.join(', '), color: 'text-[#FFD700]' },
                        { label: 'Tickets', value: finalBooking.seats.length, color: 'text-white' },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                          <p className={`text-sm font-bold mt-1 ${item.color}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* QR + Total section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-6 pt-5 border-t border-white/5">
                      <div className="flex gap-4 items-center">
                        <div className="bg-white p-1.5 rounded-xl shadow-lg">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                              `Marvel Cinema Ticket\nReference: ${finalBooking.referenceNumber}\nMovie: ${finalBooking.movieTitle}\nDate: ${finalBooking.showDate}\nTime: ${finalBooking.showTime}\nHall: ${finalBooking.hallName} Hall\nSeats: ${finalBooking.seats?.join(', ')}\nTotal Price: $${finalBooking.totalPrice}`
                            )}`}
                            alt="Unique Booking QR Code"
                            className="w-14 h-14"
                          />
                        </div>
                        <div className="text-[10px] text-gray-500 max-w-[150px] leading-relaxed">
                          Scan this unique QR code at the cinema entrance to verify your booking.
                        </div>
                      </div>
                      <div className="text-right bg-gradient-to-r from-transparent to-white/5 rounded-xl px-5 py-3">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Paid</p>
                        <p className="text-3xl font-black text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">${finalBooking.totalPrice}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide font-medium">via {finalBooking.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={async () => {
                      if (!finalBooking) return;
                      
                      toast.loading('Generating ticket PDF...', { id: 'pdf-gen' });

                      const getBase64Image = (url: string): Promise<string> => {
                        return new Promise((resolve) => {
                          const img = new Image();
                          img.crossOrigin = 'Anonymous';
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth || 100;
                            canvas.height = img.naturalHeight || 100;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0);
                            resolve(canvas.toDataURL('image/png'));
                          };
                          img.onerror = () => {
                            console.error('Failed to load image for PDF:', url);
                            resolve('');
                          };
                          img.src = url;
                        });
                      };

                      const isLocal = finalBooking.moviePoster.includes('localhost') || finalBooking.moviePoster.includes('127.0.0.1') || finalBooking.moviePoster.startsWith('/');
                      const rawPosterUrl = isLocal ? finalBooking.moviePoster : `https://images.weserv.nl/?url=${encodeURIComponent(finalBooking.moviePoster)}`;

                      const posterB64 = await getBase64Image(rawPosterUrl);

                      const element = document.createElement('div');
                      element.style.width = '400px';
                      element.innerHTML = `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a1a; color: #fff; width: 400px;">
                          <!-- Red Header Banner -->
                          <div style="background: #C1121F; padding: 16px 20px; text-align: center;">
                            <div style="font-size: 20px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: #fff;">MARVEL CINEMA</div>
                            <div style="font-size: 9px; color: rgba(255,255,255,0.7); letter-spacing: 2px; margin-top: 2px; text-transform: uppercase;">Admission Ticket</div>
                          </div>

                          <!-- Movie Info with Poster -->
                          <div style="padding: 18px 20px 14px 20px; border-bottom: 2px dashed #333;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                              <tr>
                                <td style="width: 75px; vertical-align: top;">
                                  ${posterB64 ? `<img src="${posterB64}" style="width: 70px; height: 100px; border-radius: 6px; border: 2px solid #333; display: block; object-fit: cover;" />` : `<div style="width: 70px; height: 100px; background: #333; border-radius: 6px; border: 2px solid #444;"></div>`}
                                </td>
                                <td style="vertical-align: top; padding-left: 14px;">
                                  <div style="font-size: 10px; color: #FFD700; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${finalBooking.hallName} Hall</div>
                                  <div style="font-size: 18px; font-weight: 900; color: #fff; margin-top: 4px; line-height: 1.2;">${finalBooking.movieTitle}</div>
                                  <div style="margin-top: 8px; font-family: monospace; font-size: 11px; color: #FFD700; background: #111; padding: 3px 8px; border-radius: 4px; display: inline-block; border: 1px solid #333;">REF: ${finalBooking.referenceNumber}</div>
                                </td>
                              </tr>
                            </table>
                          </div>

                          <!-- Booking Details -->
                          <div style="padding: 14px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #222; border-radius: 8px; border: 1px solid #333;">
                              <tr>
                                <td style="padding: 10px 12px; border-bottom: 1px solid #333; border-right: 1px solid #333; width: 50%;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Show Date</div>
                                  <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${finalBooking.showDate}</div>
                                </td>
                                <td style="padding: 10px 12px; border-bottom: 1px solid #333;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Show Time</div>
                                  <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${finalBooking.showTime}</div>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 12px; border-bottom: 1px solid #333; border-right: 1px solid #333;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Cinema Hall</div>
                                  <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${finalBooking.hallName} Hall</div>
                                </td>
                                <td style="padding: 10px 12px; border-bottom: 1px solid #333;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Seats</div>
                                  <div style="font-size: 13px; font-weight: bold; color: #FFD700; margin-top: 3px;">${finalBooking.seats?.join(', ')}</div>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 12px; border-bottom: 1px solid #333; border-right: 1px solid #333;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Ticket Count</div>
                                  <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px;">${finalBooking.seats?.length}</div>
                                </td>
                                <td style="padding: 10px 12px; border-bottom: 1px solid #333;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Payment Method</div>
                                  <div style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 3px; text-transform: capitalize;">${finalBooking.paymentMethod}</div>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" style="padding: 10px 12px; text-align: center; background: #191919;">
                                  <div style="font-size: 8px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Total Amount Paid</div>
                                  <div style="font-size: 22px; font-weight: 900; color: #FFD700; margin-top: 3px;">$${finalBooking.totalPrice}</div>
                                </td>
                              </tr>
                            </table>
                          </div>



                          <!-- Footer -->
                          <div style="background: #111; padding: 12px 20px; text-align: center; font-size: 9px; color: #666; border-top: 1px solid #333;">
                            Please present this ticket at the cinema entrance. Enjoy your show!
                          </div>
                        </div>
                      `;
                      
                      const options = {
                        margin: [5, 5, 5, 5],
                        filename: `MarvelCinema_Ticket_${finalBooking.referenceNumber}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, width: 400, scrollY: 0, scrollX: 0 },
                        jsPDF: { unit: 'mm', format: [115, 200], orientation: 'portrait' }
                      };
                      
                      const html2pdf = (window as any).html2pdf;
                      if (html2pdf) {
                        html2pdf().from(element).set(options).save()
                          .then(() => {
                            toast.dismiss('pdf-gen');
                            toast.success('Ticket PDF downloaded successfully!');
                          })
                          .catch((err: any) => {
                            toast.dismiss('pdf-gen');
                            console.error('PDF generation error:', err);
                            toast.error('Failed to download PDF.');
                          });
                      } else {
                        toast.dismiss('pdf-gen');
                        toast.error('PDF engine not loaded yet. Please try again.');
                      }
                    }}
                    sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    Download Ticket
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setFinalBooking(null);
                      setBookingFlow({});
                      navigate('/');
                    }}
                    sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
                  >
                    Go Back Home
                  </Button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Booking;

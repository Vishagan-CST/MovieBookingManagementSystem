import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Movie, CinemaHall, Show, Booking, Testimonial, Offer, Notification, SystemSetting } from '../types';
import {
  TESTIMONIALS,
  OFFERS
} from '../constants/mockData';
import toast from 'react-hot-toast';

interface BookingFlowState {
  movieId?: string;
  hallName?: 'Silver' | 'Bronze' | 'Platinum';
  date?: string;
  time?: string;
  selectedSeats?: string[];
  totalPrice?: number;
  showId?: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  movies: Movie[];
  halls: CinemaHall[];
  shows: Show[];
  bookings: Booking[];
  testimonials: Testimonial[];
  offers: Offer[];
  wishlist: string[];
  notifications: Notification[];
  bookingFlow: BookingFlowState;
  settings: SystemSetting | null;
  
  // Auth Operations
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone: string) => Promise<User>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  updateProfile: (name: string, email: string, phone: string, avatarUrl?: string) => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
  disableUser: (id: string, disable: boolean) => void;

  // Movie Operations
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  editMovie: (movie: Movie) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;

  // Hall Operations
  updateHallStatus: (id: string, status: 'active' | 'inactive') => void;
  editHallCapacity: (id: string, seatCapacity: number, rows: number, cols: number, basePrice: number) => void;

  // Show Operations
  addShow: (show: Omit<Show, 'id' | 'movieTitle' | 'moviePoster' | 'ticketPrice' | 'seatCapacity'>) => void;
  deleteShow: (id: string) => void;

  // Booking Operations
  createBooking: (paymentMethod: 'card' | 'upi' | 'cash' | 'wallet', finalPrice?: number) => Promise<Booking>;
  cancelBooking: (id: string) => void;
  approveRefund: (id: string) => void;
  clearBookingFlow: () => void;
  setBookingFlow: React.Dispatch<React.SetStateAction<BookingFlowState>>;

  // Wishlist
  toggleWishlist: (movieId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string) => void;

  // System Settings & Reports
  updateSettings: (newSettings: Omit<SystemSetting, 'id'>) => Promise<void>;
  getReports: () => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or constants
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('marvel_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('marvel_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('marvel_movies');
    return saved ? JSON.parse(saved) : [];
  });

  const [halls, setHalls] = useState<CinemaHall[]>(() => {
    const saved = localStorage.getItem('marvel_halls');
    return saved ? JSON.parse(saved) : [];
  });

  const [shows, setShows] = useState<Show[]>(() => {
    const saved = localStorage.getItem('marvel_shows');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('marvel_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('marvel_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('marvel_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'not_1',
        userId: 'usr_cust1',
        title: 'Welcome to Marvel Cinema!',
        message: 'Explore our latest movie collections and block your favorite seats now.',
        date: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [bookingFlow, setBookingFlow] = useState<BookingFlowState>({});
  const [settings, setSettings] = useState<SystemSetting | null>(null);

  // Synchronize with LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem('marvel_current_user', currentUser ? JSON.stringify(currentUser) : '');
    if (currentUser) {
      localStorage.setItem('marvel_jwt_token', currentUser.token || 'mock_jwt_token_admin');
    } else {
      localStorage.removeItem('marvel_jwt_token');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('marvel_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('marvel_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('marvel_halls', JSON.stringify(halls));
  }, [halls]);

  useEffect(() => {
    localStorage.setItem('marvel_shows', JSON.stringify(shows));
  }, [shows]);

  useEffect(() => {
    localStorage.setItem('marvel_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('marvel_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('marvel_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5068/api/movies');
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
        }
      } catch (err) {
        console.error('Failed to fetch movies from backend:', err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch('http://localhost:5068/api/cinemahalls');
        if (response.ok) {
          const data = await response.json();
          setHalls(data);
        }
      } catch (err) {
        console.error('Failed to fetch halls from backend:', err);
      }
    };
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('http://localhost:5068/api/shows');
        if (response.ok) {
          const data = await response.json();
          setShows(data);
        }
      } catch (err) {
        console.error('Failed to fetch shows from backend:', err);
      }
    };
    fetchShows();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5068/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings from backend:', err);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5068/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Failed to fetch users from backend:', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5068/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch settings from backend:', err);
      }
    };
    fetchSettings();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch('http://localhost:5068/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const authData = await response.json();
      const loggedUser: User = {
        ...authData.user,
        token: authData.token
      };

      if (loggedUser.status === 'disabled') {
        throw new Error('Your account has been disabled. Contact administration.');
      }

      setCurrentUser(loggedUser);
      return loggedUser;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<User> => {
    try {
      const response = await fetch('http://localhost:5068/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone, role: 'customer' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to register account');
      }

      const authData = await response.json();
      const newUser: User = {
        ...authData.user,
        token: authData.token
      };

      // Add to users local array to keep in-memory lists updated
      setUsers(prev => [...prev.filter(u => u.email !== email), newUser]);
      setCurrentUser(newUser);
      return newUser;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setBookingFlow({});
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (!exists) {
          reject(new Error('Email not found.'));
          return;
        }
        toast.success('Password reset link sent to your email.');
        resolve();
      }, 500);
    });
  };

  const resetPassword = async (email: string, _newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (!exists) {
          reject(new Error('Account not found.'));
          return;
        }
        toast.success('Password has been reset successfully. Please login.');
        resolve();
      }, 500);
    });
  };

  const updateProfile = async (name: string, email: string, phone: string, avatarUrl?: string): Promise<void> => {
    if (!currentUser) return;
    try {
      const response = await fetch('http://localhost:5068/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ name, email, phone, avatarUrl })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      const updated = {
        ...updatedUser,
        token: currentUser.token
      };

      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const changePassword = async (oldPw: string, newPw: string): Promise<void> => {
    if (!currentUser) return;
    try {
      const response = await fetch('http://localhost:5068/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to change password');
      throw err;
    }
  };

  const disableUser = async (id: string, disable: boolean) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      const updatedUser = { ...user, status: (disable ? 'disabled' : 'active') as 'disabled' | 'active' };
      const response = await fetch(`http://localhost:5068/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(updatedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (currentUser?.id === id && disable) {
        logout();
      }
      toast.success(`User successfully ${disable ? 'disabled' : 'enabled'}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update user status');
    }
  };

  // Movie Operations
  const addMovie = async (movieData: Omit<Movie, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5068/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(movieData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add movie');
      }

      const createdMovie = await response.json();
      setMovies(prev => [createdMovie, ...prev]);
      toast.success('Movie added successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to add movie');
    }
  };

  const editMovie = async (updatedMovie: Movie) => {
    try {
      const response = await fetch(`http://localhost:5068/api/movies/${updatedMovie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(updatedMovie)
      });

      if (!response.ok) {
        throw new Error('Failed to update movie');
      }

      setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
      toast.success('Movie updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update movie');
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5068/api/movies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      setMovies(prev => prev.filter(m => m.id !== id));
      toast.success('Movie deleted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete movie');
    }
  };

  // Hall Operations
  const updateHallStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      const hall = halls.find(h => h.id === id);
      if (!hall) return;
      const updatedHall = { ...hall, status };
      const response = await fetch(`http://localhost:5068/api/cinemahalls/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(updatedHall)
      });
      if (!response.ok) {
        throw new Error('Failed to update hall status');
      }
      setHalls(prev => prev.map(h => h.id === id ? updatedHall : h));
      toast.success(`Hall status updated to ${status}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update hall status');
    }
  };

  const editHallCapacity = async (id: string, seatCapacity: number, rows: number, cols: number, basePrice: number) => {
    try {
      const hall = halls.find(h => h.id === id);
      if (!hall) return;
      const updatedHall = { ...hall, seatCapacity, rows, columns: cols, basePrice };
      const response = await fetch(`http://localhost:5068/api/cinemahalls/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(updatedHall)
      });
      if (!response.ok) {
        throw new Error('Failed to update hall configuration');
      }
      setHalls(prev => prev.map(h => h.id === id ? updatedHall : h));
      toast.success('Hall settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update hall configuration');
    }
  };

  // Show Operations
  const addShow = async (showData: Omit<Show, 'id' | 'movieTitle' | 'moviePoster' | 'ticketPrice' | 'seatCapacity'>) => {
    const movie = movies.find(m => m.id === showData.movieId);
    const hall = halls.find(h => h.name === showData.hallName);
    if (!movie || !hall) {
      toast.error('Invalid Movie or Cinema Hall selected');
      return;
    }
    const ticketPrice = Math.round(hall.basePrice * hall.priceMultiplier);
    const newShowPayload = {
      ...showData,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      ticketPrice,
      seatCapacity: hall.seatCapacity,
      status: 'active' as const
    };

    try {
      const response = await fetch('http://localhost:5068/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(newShowPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to schedule show');
      }

      const createdShow = await response.json();
      setShows(prev => [...prev, createdShow]);
      toast.success('Show scheduled successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to schedule show');
    }
  };

  const deleteShow = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5068/api/shows/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete show');
      }

      setShows(prev => prev.filter(s => s.id !== id));
      toast.success('Show deleted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete show');
    }
  };

  // Booking Operations
  const createBooking = async (paymentMethod: 'card' | 'upi' | 'cash' | 'wallet', finalPrice?: number): Promise<Booking> => {
    if (!currentUser) {
      throw new Error('User authentication required to book tickets');
    }

    const { showId, selectedSeats, totalPrice } = bookingFlow;
    if (!showId || !selectedSeats || selectedSeats.length === 0 || !totalPrice) {
      throw new Error('Missing booking data. Please select seats.');
    }

    const show = shows.find(s => s.id === showId);
    if (!show) {
      throw new Error('Selected movie showtime is no longer active.');
    }

    // Check if seats already booked in database (avoid duplicates)
    const alreadyBooked = bookings
      .filter(b => b.showId === showId && b.status === 'Confirmed')
      .flatMap(b => b.seats);

    const overlaps = selectedSeats.filter(s => alreadyBooked.includes(s));
    if (overlaps.length > 0) {
      throw new Error(`Seats ${overlaps.join(', ')} were booked by another user. Please choose others.`);
    }

    const newBookingPayload = {
      referenceNumber: `MVC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      movieId: show.movieId,
      movieTitle: show.movieTitle,
      moviePoster: show.moviePoster,
      showId: show.id,
      showDate: show.date,
      showTime: show.startTime,
      hallName: show.hallName,
      seats: selectedSeats,
      totalPrice: finalPrice !== undefined ? finalPrice : totalPrice,
      paymentMethod,
      status: 'Confirmed',
      bookingDate: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:5068/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(newBookingPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const createdBooking = await response.json();
      setBookings(prev => [createdBooking, ...prev]);

      // Add user notification
      addNotification(
        'Booking Confirmed!',
        `You have successfully booked ${selectedSeats.length} seats (${selectedSeats.join(', ')}) for ${show.movieTitle}.`
      );

      return createdBooking;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;
      const updatedBooking = { ...booking, status: 'Cancelled' as const };
      const response = await fetch(`http://localhost:5068/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(updatedBooking)
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      if (currentUser) {
        addNotification(
          'Booking Cancelled',
          `Your booking ${booking.referenceNumber} for ${booking.movieTitle} has been cancelled.`
        );
      }
      toast.success('Booking cancelled successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  const approveRefund = async (id: string) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;
      const updatedBooking = { ...booking, status: 'Cancelled' as const };
      const response = await fetch(`http://localhost:5068/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(updatedBooking)
      });

      if (!response.ok) {
        throw new Error('Failed to approve refund');
      }

      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      toast.success('Refund processed successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to approve refund');
    }
  };

  const clearBookingFlow = () => {
    setBookingFlow({});
  };

  // Wishlist
  const toggleWishlist = (movieId: string) => {
    setWishlist(prev => {
      const isFav = prev.includes(movieId);
      if (isFav) {
        toast.success('Removed from Favorites');
        return prev.filter(id => id !== movieId);
      } else {
        toast.success('Added to Favorites');
        return [...prev, movieId];
      }
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (title: string, message: string) => {
    const newNot: Notification = {
      id: `not_${Math.random().toString(36).substring(2, 9)}`,
      userId: currentUser?.id || 'all',
      title,
      message,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  // System Settings & Reports
  const updateSettings = async (newSettings: Omit<SystemSetting, 'id'>) => {
    try {
      const payload = { ...settings, ...newSettings };
      const response = await fetch('http://localhost:5068/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Failed to update system settings');
      }
      setSettings(payload as SystemSetting);
      toast.success('System ticketing parameters updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update system settings');
    }
  };

  const getReports = async () => {
    const response = await fetch('http://localhost:5068/api/reports', {
      headers: {
        'Authorization': `Bearer ${currentUser?.token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch sales reports');
    }
    return await response.json();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        movies,
        halls,
        shows,
        bookings,
        testimonials: TESTIMONIALS,
        offers: OFFERS,
        wishlist,
        notifications,
        bookingFlow,
        settings,
        
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        disableUser,
        
        addMovie,
        editMovie,
        deleteMovie,
        
        updateHallStatus,
        editHallCapacity,
        
        addShow,
        deleteShow,
        
        createBooking,
        cancelBooking,
        approveRefund,
        clearBookingFlow,
        setBookingFlow,
        
        toggleWishlist,
        
        markNotificationRead,
        addNotification,

        updateSettings,
        getReports
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

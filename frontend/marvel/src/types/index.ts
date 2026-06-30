export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  token?: string;
  avatarUrl?: string;
  status: 'active' | 'disabled';
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  director: string;
  cast: string[];
  trailerUrl?: string;
  releaseDate: string;
  endDate: string;
  status: 'Now Showing' | 'Upcoming' | 'Popular' | 'Ended';
  rating: number; // e.g. 8.5
  posterUrl: string;
  backdropUrl?: string;
  cinemaHalls: string[]; // e.g. ["Silver", "Bronze", "Platinum"]
  showTimes: string[]; // e.g. ["10:00 AM", "01:30 PM", "04:45 PM", "08:00 PM"]
}

export interface CinemaHall {
  id: string;
  name: 'Silver' | 'Bronze' | 'Platinum';
  seatCapacity: number;
  rows: number;
  columns: number;
  priceMultiplier: number; // e.g. 1.0, 1.2, 1.5
  basePrice: number; // e.g. 200, 250, 400
  status: 'active' | 'inactive';
}

export interface Show {
  id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  hallName: 'Silver' | 'Bronze' | 'Platinum';
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  ticketPrice: number;
  seatCapacity: number;
  status: 'active' | 'cancelled';
}

export interface Booking {
  id: string;
  referenceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  hallName: 'Silver' | 'Bronze' | 'Platinum';
  showId: string;
  showDate: string;
  showTime: string;
  seats: string[]; // e.g. ["A1", "A2"]
  totalPrice: number;
  paymentMethod: 'card' | 'upi' | 'cash' | 'wallet';
  status: 'Confirmed' | 'Cancelled' | 'Pending';
  bookingDate: string;
}

export interface Testimonial {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercentage: number;
  expiryDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SystemSetting {
  id: string;
  bookingTimeout: number;
  taxRate: number;
  cancellationNoticeHours: number;
}

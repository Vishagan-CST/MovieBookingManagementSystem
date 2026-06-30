import type { Testimonial, Offer } from '../types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't_1',
    userName: 'Peter Parker',
    rating: 5,
    comment: 'Marvel Cinema is the absolute best theatre in town! The Platinum Hall is worth every penny. The sound quality and seating comfort are unmatched.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 't_2',
    userName: 'Wanda Maximoff',
    rating: 4.8,
    comment: 'Super easy online booking system. I love how interactive the seat selection layout is. The red & black theme fits the overall superhero cinematic vibe!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 't_3',
    userName: 'Bruce Banner',
    rating: 4.5,
    comment: 'Quiet, premium ambience. I usually go to the Bronze Hall and even there the screens are enormous. Highly recommend their loyalty options and popcorn!',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  }
];

export const OFFERS: Offer[] = [
  {
    id: 'o_1',
    code: 'MARVEL20',
    title: 'Avengers Welcome Offer',
    description: 'Get 20% flat discount on booking your first ticket in the Platinum Cinema Hall.',
    discountPercentage: 20,
    expiryDate: '2026-07-31',
  },
  {
    id: 'o_2',
    code: 'MIDWEEK15',
    title: 'Midweek Movie Mania',
    description: 'Get 15% discount on bookings done for Monday to Thursday showtimes.',
    discountPercentage: 15,
    expiryDate: '2026-08-30',
  },
  {
    id: 'o_3',
    code: 'GOLDEN30',
    title: 'Golden Weekend Deal',
    description: 'Save 30% on food and beverage combos by using this code during weekend ticket bookings.',
    discountPercentage: 30,
    expiryDate: '2026-06-30',
  }
];

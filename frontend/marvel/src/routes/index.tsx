import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout wrappers
import MainLayout from '../layouts/MainLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guard components
import { ProtectedRoute } from './ProtectedRoutes';

// Public Pages
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import MovieDetails from '../pages/MovieDetails';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Booking Wizard
import Booking from '../pages/Booking';

// Customer Dashboard Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import MyProfile from '../pages/customer/MyProfile';
import MyBookings from '../pages/customer/MyBookings';
import Wishlist from '../pages/customer/Wishlist';
import Notifications from '../pages/customer/Notifications';
import Settings from '../pages/customer/Settings';

// Admin Dashboard Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import MovieManagement from '../pages/admin/MovieManagement';
import CinemaManagement from '../pages/admin/CinemaManagement';
import ShowManagement from '../pages/admin/ShowManagement';
import BookingManagement from '../pages/admin/BookingManagement';
import CustomerManagement from '../pages/admin/CustomerManagement';
import Reports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';
import Inquiries from '../pages/admin/Inquiries';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. PUBLIC & AUTHENTICATION SUITE (MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movie/:id" element={<MovieDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Booking flow is protected, user must log in to checkout, but we allow entering to select seats */}
        <Route path="booking" element={<Booking />} />
      </Route>

      {/* 2. CUSTOMER DASHBOARD SYSTEM (CustomerLayout) */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 3. ADMIN MANAGEMENT PANEL (AdminLayout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="cinema" element={<CinemaManagement />} />
        <Route path="shows" element={<ShowManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

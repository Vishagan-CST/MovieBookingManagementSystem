import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Typography, Avatar } from '@mui/material';
import {
  Dashboard,
  Movie,
  TheaterComedy,
  CalendarMonth,
  BookOnline,
  People,
  Assessment,
  Settings,
  Logout,
  Person,
  Favorite,
  Notifications,
  Email
} from '@mui/icons-material';

interface SidebarProps {
  role: 'admin' | 'customer';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { text: 'Dashboard', path: '/admin', icon: <Dashboard /> },
    { text: 'Movies', path: '/admin/movies', icon: <Movie /> },
    { text: 'Cinema Halls', path: '/admin/halls', icon: <TheaterComedy /> },
    { text: 'Show Management', path: '/admin/shows', icon: <CalendarMonth /> },
    { text: 'Bookings', path: '/admin/bookings', icon: <BookOnline /> },
    { text: 'Customers', path: '/admin/customers', icon: <People /> },
    { text: 'Reports', path: '/admin/reports', icon: <Assessment /> },
    { text: 'Inquiries', path: '/admin/inquiries', icon: <Email /> },
    { text: 'Settings', path: '/admin/settings', icon: <Settings /> }
  ];

  const customerLinks = [
    { text: 'Dashboard', path: '/customer', icon: <Dashboard /> },
    { text: 'My Profile', path: '/customer/profile', icon: <Person /> },
    { text: 'My Bookings', path: '/customer/bookings', icon: <BookOnline /> },
    { text: 'Wishlist', path: '/customer/wishlist', icon: <Favorite /> },
    { text: 'Notifications', path: '/customer/notifications', icon: <Notifications /> },
    { text: 'Settings', path: '/customer/settings', icon: <Settings /> }
  ];

  const activeLinks = role === 'admin' ? adminLinks : customerLinks;

  return (
    <div className="w-64 bg-[#141414] border-r border-white/5 flex flex-col h-full min-h-screen text-gray-300">
      
      {/* Profile summary header */}
      <div className="p-6 flex flex-col items-center border-b border-white/5">
        <Avatar
          src={currentUser?.avatarUrl}
          alt={currentUser?.name}
          sx={{ width: 70, height: 70, border: '3px solid #C1121F', mb: 1.5 }}
        >
          {currentUser?.name.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" className="font-bold text-white text-center leading-tight">
          {currentUser?.name}
        </Typography>
        <Typography variant="caption" className="text-gray-500 font-medium tracking-wide uppercase mt-1">
          {currentUser?.role} Mode
        </Typography>
      </div>

      {/* Navigation list */}
      <div className="flex-grow p-4 flex flex-col gap-1.5 overflow-y-auto">
        {activeLinks.map((link) => (
          <NavLink
            key={link.text}
            to={link.path}
            end={link.path === '/admin' || link.path === '/customer'}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#C1121F] text-white shadow-[0_4px_15px_rgba(193,18,31,0.35)]'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#FFD700]'}`}>
                  {link.icon}
                </span>
                <span className="text-sm">{link.text}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[#FF6B6B] hover:bg-red-500/10 transition-colors"
        >
          <Logout className="text-[#FF6B6B]" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { IconButton, Drawer } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

export const AdminLayout: React.FC = () => {
  const { currentUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Guard: Redirect to login if not authenticated, or to home if not admin
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex bg-[#111111] text-white min-h-screen">
      
      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            bgcolor: 'rgba(0,0,0,0.8)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.9)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar role="admin" />
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            style: {
              width: 256,
              backgroundColor: '#141414',
              color: 'white',
              borderRight: '1px solid rgba(255,255,255,0.05)'
            }
          }
        }}
      >
        <Sidebar role="admin" />
      </Drawer>

      {/* ADMIN CONTENT PANEL */}
      <div className="flex-grow min-h-screen overflow-y-auto p-4 md:p-8 pt-16 md:pt-8 w-full max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

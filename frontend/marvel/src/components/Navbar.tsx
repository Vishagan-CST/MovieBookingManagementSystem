import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Badge,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  LocalActivity,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export const Navbar: React.FC = () => {
  const { currentUser, logout, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // User profile menu state
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  
  // Notifications menu state
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleCloseNotifMenu = () => {
    setAnchorElNotif(null);
  };

  const handleNotifClick = (id: string) => {
    markNotificationRead(id);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const handleDashboardRedirect = () => {
    handleCloseUserMenu();
    if (currentUser?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/customer');
    }
  };

  const handleProfileRedirect = () => {
    handleCloseUserMenu();
    navigate(currentUser?.role === 'admin' ? '/admin/settings' : '/customer/profile');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setMobileOpen(open);
  };

  const unreadCount = notifications.filter(n => !n.read && (n.userId === 'all' || n.userId === currentUser?.id)).length;
  const userNotifications = notifications.filter(n => n.userId === 'all' || n.userId === currentUser?.id);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Movies', path: '/movies' },
    { title: 'About Us', path: '/about' },
    { title: 'Contact Us', path: '/contact' }
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#111111', borderBottom: '2px solid #C1121F' }} elevation={4}>
      <Toolbar className="max-w-7xl mx-auto w-full flex justify-between px-4 md:px-6">
        
        {/* LOGO */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <LocalActivity sx={{ color: '#C1121F', mr: 1, fontSize: 32 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            MARVEL<span className="text-[#FFD700] ml-1">CINEMA</span>
          </Typography>
        </Box>

        {/* DESKTOP LINKS */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Button
                key={link.title}
                component={Link}
                to={link.path}
                sx={{
                  color: isActive ? '#FFD700' : '#FFFFFF',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  position: 'relative',
                  '&:after': isActive ? {
                    content: '""',
                    position: 'absolute',
                    width: '60%',
                    height: '2px',
                    bottom: '4px',
                    left: '20%',
                    backgroundColor: '#C1121F'
                  } : {},
                  '&:hover': {
                    color: '#FFD700',
                    bgcolor: 'transparent'
                  }
                }}
              >
                {link.title}
              </Button>
            );
          })}
        </Box>

        {/* AUTHENTICATION & NOTIFICATIONS */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Notifications */}
          {currentUser && (
            <>
              <Tooltip title="Notifications">
                <IconButton onClick={handleOpenNotifMenu} sx={{ color: '#FFFFFF', '&:hover': { color: '#FFD700' } }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* Notifications Dropdown Menu */}
              <Menu
                anchorEl={anchorElNotif}
                open={Boolean(anchorElNotif)}
                onClose={handleCloseNotifMenu}
                slotProps={{
                  paper: {
                    style: {
                      maxHeight: 350,
                      width: '320px',
                      backgroundColor: '#1E1E1E',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }
                  }
                }}
              >
                <div className="px-4 py-2 font-semibold border-b border-gray-700 flex justify-between items-center text-[#FFD700]">
                  <span>Notifications</span>
                  {unreadCount > 0 && <span className="text-xs bg-[#C1121F] text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                </div>
                {userNotifications.length === 0 ? (
                  <MenuItem sx={{ py: 3, justifyContent: 'center', color: '#888' }}>
                    No notifications
                  </MenuItem>
                ) : (
                  userNotifications.map((notif) => (
                    <MenuItem
                      key={notif.id}
                      onClick={() => handleNotifClick(notif.id)}
                      sx={{
                        whiteSpace: 'normal',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        bgcolor: notif.read ? 'transparent' : 'rgba(193, 18, 31, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: notif.read ? 500 : 700, color: '#FFF' }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#BBB', mt: 0.5 }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', mt: 0.5, fontSize: '0.7rem' }}>
                        {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </Menu>
            </>
          )}

          {/* User Menu */}
          {currentUser ? (
            <Box>
              <Tooltip title="Account Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={currentUser.name}
                    src={currentUser.avatarUrl}
                    sx={{ width: 40, height: 40, border: '2px solid #FFD700' }}
                  >
                    {currentUser.name.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                slotProps={{
                  paper: {
                    style: {
                      backgroundColor: '#1E1E1E',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.08)',
                      width: '200px'
                    }
                  }
                }}
              >
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold text-sm truncate text-[#FFD700]">{currentUser.name}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                  <span className="text-[10px] bg-red-600/30 text-[#FF8888] font-bold px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
                <MenuItem onClick={handleDashboardRedirect} sx={{ py: 1.2 }}>
                  <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: '#FFD700' }} /> Dashboard
                </MenuItem>
                <MenuItem onClick={handleProfileRedirect} sx={{ py: 1.2 }}>
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} /> Profile
                </MenuItem>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: '#FF6B6B', py: 1.2 }}>
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                sx={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: '#FFD700',
                    color: '#FFD700',
                    bgcolor: 'rgba(255, 215, 0, 0.05)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  bgcolor: '#C1121F',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#A00F19'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* MOBILE DRAWER TOGGLE */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleDrawer(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

      </Toolbar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            style: {
              width: 250,
              backgroundColor: '#111111',
              color: '#FFFFFF',
              borderLeft: '2px solid #C1121F'
            }
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#C1121F' }}>
            MARVEL
          </Typography>
          <IconButton onClick={toggleDrawer(false)} sx={{ color: '#FFF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.title} disablePadding>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={toggleDrawer(false)}
                sx={{
                  color: location.pathname === link.path ? '#FFD700' : '#FFFFFF',
                  '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.05)', color: '#FFD700' }
                }}
              >
                <ListItemText primary={link.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        {!currentUser && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/login"
              onClick={toggleDrawer(false)}
              sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/register"
              onClick={toggleDrawer(false)}
              sx={{ bgcolor: '#C1121F', color: '#FFF' }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

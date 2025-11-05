import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Event as EventIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Events', icon: <EventIcon />, path: '/events' },
    ...(isAuthenticated ? [
      { label: 'Admin', icon: <AdminIcon />, path: '/admin' },
      { label: 'Profile', icon: <PersonIcon />, path: '/me' }
    ] : [])
  ];

  // Drawer content for mobile
  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Campus Events
        </Typography>
        <IconButton onClick={() => setMobileOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              mx: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Desktop navigation
  const desktopNav = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          startIcon={item.icon}
          sx={{
            color: location.pathname === item.path ? 'primary.main' : 'text.primary',
            backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
            fontWeight: location.pathname === item.path ? 600 : 500,
            px: 2,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.main',
            }
          }}
        >
          {item.label}
        </Button>
      ))}
      <ThemeToggle />
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: scrolled
            ? 'var(--glass-bg)'
            : 'transparent',
          backdropFilter: 'blur(10px)',
          border: scrolled ? '1px solid var(--glass-border)' : 'none',
          boxShadow: scrolled
            ? `0 4px 12px var(--glass-shadow)`
            : 'none',
          transition: 'all 0.3s ease-in-out',
          py: 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🎉 Campus Events
            </Typography>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && desktopNav}

          {/* Mobile menu button */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle size="small" />
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            PaperProps={{
              sx: {
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border)',
              }
            }}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {drawerContent}
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
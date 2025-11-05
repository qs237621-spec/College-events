import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();

  const socialLinks = [
    { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
    { icon: <TwitterIcon />, label: 'Twitter', href: '#' },
    { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
    { icon: <GitHubIcon />, label: 'GitHub', href: '#' }
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--glass-border)',
        mt: 'auto',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  🎉 Campus Events
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Discover what's happening on campus. Connect with your community
                  and never miss an exciting event.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={social.label}
                      component={Link}
                      href={social.href}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'primary.light',
                        }
                      }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Links
                </Typography>
                <Box component="nav">
                  {[
                    { label: 'Home', path: '/' },
                    { label: 'Browse Events', path: '/events' },
                    { label: 'Admin Dashboard', path: '/admin' },
                    { label: 'My Profile', path: '/me' }
                  ].map((link) => (
                    <Box key={link.path} sx={{ mb: 1 }}>
                      <Link
                        component={RouterLink}
                        to={link.path}
                        color="text.secondary"
                        underline="hover"
                        sx={{
                          display: 'block',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Us
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      events@campus.edu
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Student Union Building, Room 101
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Copyright */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Campus Events. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Help
                </Link>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
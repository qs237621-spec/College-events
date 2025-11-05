import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { Home as HomeIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        py: 8
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '4rem', md: '6rem' },
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 2
                }}
              >
                404
              </Typography>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <SearchOffIcon
                sx={{
                  fontSize: { xs: '4rem', md: '5rem' },
                  color: 'text.secondary',
                  mb: 3
                }}
              />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'text.primary'
                }}
              >
                Oops! Page Not Found
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 6,
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                The page you're looking for doesn't exist or has been moved.
                Don't worry, let's get you back to discovering amazing campus events!
              </Typography>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  Go Home
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.history.back()}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </motion.div>

            {/* Fun Illustration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Box sx={{ mt: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  🎉 While you're here, did you know there are amazing events happening on campus right now?
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;
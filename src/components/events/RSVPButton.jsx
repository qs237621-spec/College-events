import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Celebrate as CelebrateIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getRSVPCount, addRSVP, removeRSVP } from '../../utils/storage';

// Simple confetti animation using CSS
const createConfetti = () => {
  const colors = ['#4A90E2', '#FFC107', '#00C9A7', '#9C27B0', '#FF5722'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
        transition: all 1s ease-out;
        pointer-events: none;
        z-index: 9999;
      `;

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = '100%';
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 100}px)`;
      }, 10);

      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 1000);
    }, i * 20);
  }
};

const RSVPButton = ({
  eventId,
  compact = false,
  fullWidth = false,
  size = 'medium',
  sx = {}
}) => {
  const theme = useTheme();
  const { currentUser, isAuthenticated, toggleRSVP } = useAuth();
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check RSVP status on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setIsRSVPed(currentUser.rsvps?.includes(eventId) || false);
    } else {
      setIsRSVPed(false);
    }
  }, [eventId, currentUser, isAuthenticated]);

  const handleRSVPClick = async () => {
    if (!isAuthenticated) {
      // In a real app, this would redirect to login
      alert('Please log in to RSVP for events');
      return;
    }

    setLoading(true);

    try {
      const result = toggleRSVP(eventId);

      if (result.success) {
        setIsRSVPed(result.isRSVPed);

        if (result.isRSVPed) {
          // Show success animation
          setShowSuccess(true);
          createConfetti();
          setTimeout(() => setShowSuccess(false), 2000);
        }
      } else {
        console.error('RSVP failed:', result.error);
      }
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'RSVPing...';
    if (showSuccess && isRSVPed) return '✓ Going!';
    if (isRSVPed) return 'Cancel RSVP';
    return 'RSVP';
  };

  const getButtonIcon = () => {
    if (loading) return <CircularProgress size={20} color="inherit" />;
    if (showSuccess && isRSVPed) return <CelebrateIcon />;
    if (isRSVPed) return <CloseIcon />;
    return null;
  };

  // Button variants for different states
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: '0 6px 20px rgba(0, 201, 167, 0.4)',
    },
    tap: { scale: 0.95 }
  };

  const successVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <AnimatePresence mode="wait">
        {showSuccess && isRSVPed && (
          <motion.div
            key="success"
            variants={successVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                background: 'linear-gradient(45deg, #00C9A7, #4A90E2)',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.875rem',
                boxShadow: '0 4px 12px rgba(0, 201, 167, 0.4)',
                whiteSpace: 'nowrap'
              }}
            >
              🎉 You're going!
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          variant={isRSVPed ? 'outlined' : 'contained'}
          size={size}
          fullWidth={fullWidth}
          disabled={loading || !isAuthenticated}
          onClick={handleRSVPClick}
          startIcon={getButtonIcon()}
          sx={{
            py: compact ? 1 : 1.5,
            px: compact ? 2 : 3,
            fontWeight: 600,
            borderRadius: 2,
            fontSize: compact ? '0.875rem' : '1rem',
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',

            // Accent color for primary state
            ...(isRSVPed ? {
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.secondary,
              backgroundColor: 'transparent',
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
              }
            } : {
              background: `linear-gradient(45deg, ${theme.palette.accent.main}, ${theme.palette.accent.light})`,
              borderColor: 'transparent',
              color: 'white',
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.accent.dark}, ${theme.palette.accent.main})`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
              }
            }),

            // Disabled state
            '&:disabled': {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
              borderColor: 'transparent',
            },

            // Compact adjustments
            ...(compact && {
              py: 0.75,
              px: 2,
              fontSize: '0.875rem'
            })
          }}
          aria-label={isRSVPed ? 'Cancel RSVP' : 'RSVP to event'}
        >
          {getButtonText()}
        </Button>
      </motion.div>

      {/* RSVP count indicator */}
      {!compact && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            fontSize: '0.75rem'
          }}
        >
          {getRSVPCount(eventId)} going
        </Typography>
      )}
    </Box>
  );
};

export default RSVPButton;
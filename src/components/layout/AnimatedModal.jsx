import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  useTheme
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AnimatedModal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = true,
  showCloseButton = true,
  sx = {}
}) => {
  const theme = useTheme();

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 50
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          PaperComponent={motion.div}
          PaperProps={{
            variants: modalVariants,
            initial: 'hidden',
            animate: 'visible',
            exit: 'exit',
            sx: {
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 3,
              overflow: 'hidden',
              ...sx
            }
          }}
          BackdropComponent={motion.div}
          BackdropProps={{
            variants: backdropVariants,
            initial: 'hidden',
            animate: 'visible',
            exit: 'exit'
          }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)'
              }}
            >
              {title && (
                <DialogTitle
                  sx={{
                    p: 0,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {title}
                </DialogTitle>
              )}
              {showCloseButton && (
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.text.primary,
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          )}

          {/* Content */}
          <DialogContent
            sx={{
              p: 3,
              background: 'transparent',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(255,255,255,0.5)'
                }
              }
            }}
          >
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

// Preset modal sizes
export const SmallModal = (props) => (
  <AnimatedModal maxWidth="sm" {...props} />
);

export const LargeModal = (props) => (
  <AnimatedModal maxWidth="lg" {...props} />
);

export const FullScreenModal = (props) => (
  <AnimatedModal maxWidth="xl" fullWidth {...props} />
);

export default AnimatedModal;
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowDownward as ArrowDownIcon } from '@mui/icons-material';

const HeroBanner = ({ onExploreClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(135deg,
          ${theme.palette.primary.main} 0%,
          ${theme.palette.secondary.main} 50%,
          ${theme.palette.accent.main} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />

      {/* Main content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y, opacity }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.2
              }}
            >
              Discover What's Happening
              <br />
              On Campus 🎉
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                mb: 4,
                maxWidth: 800,
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.5
              }}
            >
              Find exciting events, connect with your community,
              and make the most of your college experience
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={onExploreClick}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                  }
                }}
              >
                Explore Events
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/admin"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Create Event
              </Button>
            </Box>
          </motion.div>

          {/* Floating stats */}
          {!isMobile && (
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                top: '20%',
                right: '5%',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                12+ Events This Week
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Don't miss out!
              </Typography>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={onExploreClick}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            Scroll to explore
          </Typography>
          <ArrowDownIcon sx={{ fontSize: 30 }} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default HeroBanner;
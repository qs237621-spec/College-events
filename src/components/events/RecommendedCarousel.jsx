import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatEventDate } from '../../utils/calendar';
import { getCategoryColor, getCategoryIcon, truncateText } from '../../utils/helpers';

const RecommendedCarousel = ({ events, title = 'Recommended Events' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Number of cards to show based on screen size
  const cardsToShow = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, events.length - cardsToShow);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
  };

  // Carousel animation variants
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Swipe handlers for touch
  const [[touchStart, touchEnd], setTouchState] = useState([0, 0]);

  const handleTouchStart = (e) => {
    setTouchState([e.touches[0].clientX, 0]);
  };

  const handleTouchMove = (e) => {
    setTouchState([touchStart, e.touches[0].clientX]);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchState([0, 0]);
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        {/* Navigation Arrows */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            sx={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              '&:hover:not(:disabled)': {
                background: 'var(--glass-bg)',
                transform: 'scale(1.1)',
              },
              '&:disabled': {
                opacity: 0.3,
              }
            }}
            aria-label="Previous events"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            sx={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              '&:hover:not(:disabled)': {
                background: 'var(--glass-bg)',
                transform: 'scale(1.1)',
              },
              '&:disabled': {
                opacity: 0.3,
              }
            }}
            aria-label="Next events"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Carousel Container */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          px: 1
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`
          }}
        >
          <AnimatePresence initial={false} custom={currentIndex > 0 ? 1 : -1}>
            {events.slice(currentIndex, currentIndex + cardsToShow + 1).map((event, index) => (
              <Box
                key={`${event.id}-${currentIndex}`}
                sx={{
                  minWidth: isMobile ? '100%' : `calc(${100 / cardsToShow}% - 16px)`,
                  mx: 1
                }}
              >
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  <Card
                    component={Link}
                    to={`/event/${event.id}`}
                    sx={{
                      height: 280,
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      background: 'var(--glass-bg)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--glass-border)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        '& .card-image': {
                          transform: 'scale(1.05)',
                        }
                      }
                    }}
                  >
                    {/* Event Image */}
                    <Box
                      className="card-image"
                      sx={{
                        height: 140,
                        background: `linear-gradient(135deg, ${getCategoryColor(event.category)}, ${theme.palette.primary.main})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.5s ease'
                      }}
                    >
                      {/* Category Icon */}
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: '3rem',
                          opacity: 0.3,
                          position: 'absolute',
                          zIndex: 1
                        }}
                      >
                        {getCategoryIcon(event.category)}
                      </Typography>

                      {/* Actual Image (if available) */}
                      {event.imageUrl && (
                        <Box
                          component="img"
                          src={event.imageUrl}
                          alt={event.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                      )}

                      {/* Category Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: getCategoryColor(event.category),
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {event.category}
                      </Box>
                    </Box>

                    {/* Card Content */}
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.text.primary,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {event.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.875rem',
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {truncateText(event.description, 80)}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      >
                        {formatEventDate(event.start, { month: 'short', day: 'numeric' })}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Dots Indicator */}
      {events.length > cardsToShow && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {Array.from({ length: Math.min(events.length - cardsToShow + 1, 5) }).map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                  backgroundColor: index === currentIndex ? 'primary.dark' : 'grey.400',
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecommendedCarousel;
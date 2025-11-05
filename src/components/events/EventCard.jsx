import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatEventDate, formatEventTime, getCategoryColor, getCategoryIcon, truncateText } from '../../utils/helpers';
import RSVPButton from './RSVPButton';

const EventCard = ({ event, onRSVP, compact = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on interactive elements
    if (e.target.closest('button')) {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      layout
    >
      <Card
        component={Link}
        to={`/event/${event.id}`}
        onClick={handleCardClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border)',
          transition: 'all 0.3s ease',
          '&:hover': {
            '& .event-image': {
              transform: 'scale(1.05)',
            },
            '& .card-content': {
              transform: 'translateY(-4px)',
            }
          }
        }}
      >
        {/* Event Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div variants={imageVariants}>
            <CardMedia
              component="div"
              sx={{
                height: compact ? 160 : 240,
                background: `linear-gradient(135deg, ${getCategoryColor(event.category)}, ${theme.palette.primary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="event-image"
            >
              {/* Category Icon */}
              <Typography
                variant={compact ? 'h3' : 'h2'}
                sx={{
                  fontSize: compact ? '3rem' : '4rem',
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
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
              )}

              {/* Blur placeholder while image loads */}
              {!imageLoaded && event.imageUrl && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${getCategoryColor(event.category)}, ${theme.palette.primary.main})`,
                    filter: 'blur(20px)',
                    transform: 'scale(1.2)',
                  }}
                />
              )}
            </CardMedia>
          </motion.div>

          {/* Category Badge */}
          <Chip
            label={event.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: getCategoryColor(event.category),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              zIndex: 2,
              backdropFilter: 'blur(10px)',
            }}
          />

          {/* Bookmark Button */}
          <IconButton
            size="small"
            onClick={handleBookmark}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              color: isBookmarked ? 'primary.main' : 'white',
              border: '1px solid var(--glass-border)',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'var(--glass-bg)',
                transform: 'scale(1.1)',
              }
            }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
          </IconButton>

          {/* RSVP Count Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 4,
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              border: '1px solid var(--glass-border)',
              zIndex: 2
            }}
          >
            <PersonIcon fontSize="small" />
            {event.rsvpCount || 0}
          </Box>
        </Box>

        {/* Card Content */}
        <CardContent
          className="card-content"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: compact ? 2 : 3,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Title */}
          <Typography
            variant={compact ? 'h6' : 'h5'}
            component="h3"
            sx={{
              fontWeight: 700,
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

          {/* Description */}
          {!compact && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5
              }}
            >
              {truncateText(event.description, 120)}
            </Typography>
          )}

          {/* Event Details */}
          <Box sx={{ mb: 2, flexGrow: 1 }}>
            {/* Date & Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
              <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {formatEventDate(event.start, { month: 'short', day: 'numeric' })} at {formatEventTime(event.start)}
              </Typography>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
              <LocationIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {event.location}
              </Typography>
            </Box>

            {/* Organizer */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={event.organizer.avatarUrl}
                alt={event.organizer.name}
                sx={{ width: 24, height: 24, mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {event.organizer.name}
              </Typography>
            </Box>
          </Box>

          {/* RSVP Button */}
          <RSVPButton
            eventId={event.id}
            compact={compact}
            fullWidth
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventCard;
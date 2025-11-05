import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Skeleton,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Share as ShareIcon,
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Components
import EventCard from '../components/events/EventCard';
import RSVPButton from '../components/events/RSVPButton';
import AnimatedModal from '../components/layout/AnimatedModal';

// Utils
import {
  formatEventDate,
  formatEventTime,
  generateGoogleCalendarUrl,
  downloadICSFile,
  getRelativeTime,
  getEventDuration,
  isEventPast
} from '../utils/calendar';
import { getCategoryColor, getCategoryIcon } from '../utils/helpers';

// Hooks
import useEvents from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  const { getEventById, getRelatedEvents, loading } = useEvents();
  const { isAuthenticated } = useAuth();

  const event = getEventById(id);
  const relatedEvents = getRelatedEvents(id);
  const isPast = event ? isEventPast(event.start) : false;

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      setShareModalOpen(true);
    }
  };

  // Handle calendar integration
  const handleGoogleCalendar = () => {
    if (event) {
      const url = generateGoogleCalendarUrl(event);
      window.open(url, '_blank');
    }
    setCalendarModalOpen(false);
  };

  const handleDownloadICS = () => {
    if (event) {
      downloadICSFile(event);
    }
    setCalendarModalOpen(false);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could show a toast notification here
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
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

  // Loading state
  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 4 }} />
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 4 }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Container>
      </Box>
    );
  }

  // Event not found
  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            🤷 Event Not Found
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            The event you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Back Button */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              '&:hover': {
                background: 'var(--glass-bg)',
                transform: 'translateX(4px)',
              }
            }}
            aria-label="Go back"
          >
            <ArrowBackIcon />
          </IconButton>
        </motion.div>
      </Container>

      {/* Event Banner */}
      <Box
        sx={{
          position: 'relative',
          height: isMobile ? 300 : 400,
          background: `linear-gradient(135deg, ${getCategoryColor(event.category)}, ${theme.palette.primary.main})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          mb: 6
        }}
      >
        {/* Background Image */}
        {event.imageUrl && (
          <Box
            component="img"
            src={event.imageUrl}
            alt={event.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              objectFit: 'cover',
              opacity: 0.3
            }}
          />
        )}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
            zIndex: 1
          }}
        />

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}
        >
          <Chip
            label={event.category}
            sx={{
              backgroundColor: getCategoryColor(event.category),
              color: 'white',
              fontWeight: 600,
              px: 2,
              py: 1,
              fontSize: '1rem'
            }}
          />
        </motion.div>

        {/* Event Title */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                lineHeight: 1.2
              }}
            >
              {event.title}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Event Content */}
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                {/* Event Details */}
                <Paper
                  sx={{
                    p: 4,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3,
                    mb: 4
                  }}
                >
                  {/* Date, Time, Location */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ScheduleIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatEventDate(event.start, { weekday: 'long' })}
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {formatEventDate(event.start)}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {formatEventTime(event.start)} - {formatEventTime(event.end)}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {getRelativeTime(event.start)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocationIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {event.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Description */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      About This Event
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
                    >
                      {event.description}
                    </Typography>
                  </Box>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {event.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 2 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </motion.div>

              {/* Organizer Information */}
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 4,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Organizer
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={event.organizer.avatarUrl}
                      alt={event.organizer.name}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {event.organizer.name}
                      </Typography>
                      {event.organizer.handle && (
                        <Typography variant="body2" color="text.secondary">
                          @{event.organizer.handle}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 4,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3,
                    position: 'sticky',
                    top: 24
                  }}
                >
                  {/* RSVP Button */}
                  <Box sx={{ mb: 4 }}>
                    <RSVPButton
                      eventId={event.id}
                      fullWidth
                      size="large"
                      sx={{ mb: 2 }}
                    />

                    {/* RSVP Stats */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {event.rsvpCount || 0} people going
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Calendar Actions */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Add to Calendar
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CalendarIcon />}
                        onClick={() => setCalendarModalOpen(true)}
                        fullWidth
                      >
                        Add to Calendar
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Share */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Share Event
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={handleShare}
                      fullWidth
                    >
                      Share
                    </Button>
                  </Box>

                  {/* Event Duration */}
                  {event.start && event.end && (
                    <Box sx={{ mt: 4, p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Duration
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {getEventDuration(event.start, event.end)}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
              You May Also Like
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
              {relatedEvents.map((relatedEvent) => (
                <Box
                  key={relatedEvent.id}
                  sx={{
                    minWidth: isMobile ? '100%' : 350,
                    flexShrink: 0
                  }}
                >
                  <EventCard event={relatedEvent} compact />
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      )}

      {/* Calendar Modal */}
      <AnimatedModal
        open={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        title="Add to Calendar"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Choose your calendar application:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<CalendarIcon />}
              onClick={handleGoogleCalendar}
              fullWidth
            >
              Google Calendar
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadICS}
              fullWidth
            >
              Download .ics file
            </Button>
          </Box>
        </Box>
      </AnimatedModal>

      {/* Share Modal */}
      <AnimatedModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Event"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Share this event with others:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              onClick={copyToClipboard}
              fullWidth
            >
              Copy Link
            </Button>
            <Button
              variant="outlined"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${event.title}" on campus!`)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              Share on Twitter
            </Button>
            <Button
              variant="outlined"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              Share on Facebook
            </Button>
          </Box>
        </Box>
      </AnimatedModal>
    </Box>
  );
};

export default EventDetails;
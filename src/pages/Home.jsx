import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Components
import HeroBanner from '../components/layout/HeroBanner';
import EventFilterBar from '../components/events/EventFilterBar';
import EventCard from '../components/events/EventCard';
import RecommendedCarousel from '../components/events/RecommendedCarousel';

// Hooks
import useEvents from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    events,
    allEvents,
    loading,
    filters,
    sortBy,
    updateFilters,
    updateSort,
    categories,
    getRelatedEvents,
    getEventById
  } = useEvents();

  const { isAuthenticated } = useAuth();
  const [displayCount, setDisplayCount] = useState(9);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const eventsRef = useRef(null);

  // Scroll to events section
  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load more events
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  // Check if we should show load more button
  useEffect(() => {
    setShowLoadMore(events.length > displayCount);
  }, [events, displayCount]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(9);
  }, [filters]);

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

  const featuredEvents = allEvents.slice(0, 3); // First 3 events as featured
  const displayedEvents = events.slice(0, displayCount);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroBanner onExploreClick={scrollToEvents} />

      {/* Events Section */}
      <Box ref={eventsRef} sx={{ py: 6 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Discover Campus Events
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Find hackathons, workshops, festivals, and more happening on campus.
                Connect with your community and never miss exciting opportunities.
              </Typography>
            </Box>
          </motion.div>

          {/* Create Event Button */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Button
                  component={Link}
                  to="/admin"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.accent.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.accent.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  Create New Event
                </Button>
              </Box>
            </motion.div>
          )}

          {/* Recommended Events Carousel */}
          {!loading && featuredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <RecommendedCarousel
                events={featuredEvents}
                title="Featured Events"
              />
            </motion.div>
          )}

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <EventFilterBar
              filters={filters}
              onFiltersChange={updateFilters}
              onSortChange={updateSort}
              sortBy={sortBy}
              categories={categories}
              compact={isMobile}
            />
          </motion.div>

          {/* Events Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading Skeletons
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Grid container spacing={3}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            ) : displayedEvents.length > 0 ? (
              // Events List
              <motion.div
                key="events"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {displayedEvents.map((event, index) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <motion.div variants={itemVariants}>
                        <EventCard event={event} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Load More Button */}
                {showLoadMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleLoadMore}
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        Load More Events
                      </Button>
                    </Box>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Empty State
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 12,
                    px: 3
                  }}
                >
                  <Typography variant="h4" component="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    🎭 No Events Found
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                    We couldn't find any events matching your criteria. Try adjusting your filters
                    or check back later for new events.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      onClick={() => updateFilters({
                        search: '',
                        categories: [],
                        startDate: null,
                        endDate: null,
                        organizerIds: []
                      })}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      Clear Filters
                    </Button>

                    {isAuthenticated && (
                      <Button
                        component={Link}
                        to="/admin"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                          px: 3,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                      >
                        Create Event
                      </Button>
                    )}
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>

      {/* Stats Section */}
      {!loading && allEvents.length > 0 && (
        <Box sx={{ py: 8, backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {allEvents.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Events
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {categories.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Categories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'accent.main' }}>
                      {allEvents.reduce((sum, event) => sum + (event.rsvpCount || 0), 0)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total RSVPs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {allEvents.filter(event => new Date(event.start) > new Date()).length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Upcoming
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Home;
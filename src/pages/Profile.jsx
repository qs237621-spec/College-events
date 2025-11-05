import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// Components
import EventCard from '../components/events/EventCard';

// Hooks
import useEvents from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

// Utils
import { formatEventDate, isEventPast, getRelativeTime } from '../utils/calendar';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTab, setCurrentTab] = useState(0);

  const { currentUser, isAuthenticated, getCreatedEvents, getRSVPedEvents } = useAuth();
  const { getEventById } = useEvents();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Get user events
  const createdEvents = getCreatedEvents();
  const rsvpedEvents = getRSVPedEvents();

  // Filter events by status
  const upcomingRSVPed = rsvpedEvents.filter(event => !isEventPast(event.start));
  const pastRSVPed = rsvpedEvents.filter(event => isEventPast(event.end));

  // Tab panel component
  const TabPanel = ({ children, value, index }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

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

  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Please log in to view your profile
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants}>
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
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    sx={{
                      width: isMobile ? 100 : 120,
                      height: isMobile ? 100 : 120,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: isMobile ? '50%' : '35%',
                      transform: 'translateX(50%)',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                    aria-label="Edit profile"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={9}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    {currentUser.email}
                  </Typography>

                  {/* Stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      flexWrap: 'wrap'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {rsvpedEvents.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Events Attending
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {createdEvents.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Events Created
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'accent.main' }}>
                        {upcomingRSVPed.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upcoming
                      </Typography>
                    </Box>
                  </Box>

                  {/* Preferences */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Preferred Category:
                    </Typography>
                    <Chip
                      label={currentUser.preferences?.defaultCategory || 'All'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 3,
              mb: 4
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 64
                }
              }}
            >
              <Tab
                label="Upcoming Events"
                icon={<ScheduleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Past Events"
                icon={<CheckCircleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Created Events"
                icon={<PersonIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Upcoming Events Tab */}
        <TabPanel value={currentTab} index={0}>
          <motion.div variants={itemVariants}>
            {upcomingRSVPed.length > 0 ? (
              <Grid container spacing={3}>
                {upcomingRSVPed.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <motion.div variants={itemVariants}>
                      <EventCard event={event} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3
                }}
              >
                <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  No Upcoming Events
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  You haven't RSVPed to any upcoming events yet. Check out the homepage to discover what's happening on campus!
                </Typography>
                <Button
                  variant="contained"
                  href="/"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Browse Events
                </Button>
              </Box>
            )}
          </motion.div>
        </TabPanel>

        {/* Past Events Tab */}
        <TabPanel value={currentTab} index={1}>
          <motion.div variants={itemVariants}>
            {pastRSVPed.length > 0 ? (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Events You've Attended
                </Typography>
                <Grid container spacing={3}>
                  {pastRSVPed.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <motion.div variants={itemVariants}>
                        <Paper
                          sx={{
                            p: 2,
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 2,
                            position: 'relative'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CheckCircleIcon
                              sx={{
                                color: 'success.main',
                                mr: 1,
                                fontSize: 20
                              }}
                            />
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                              Attended
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {event.category} • {event.location}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatEventDate(event.start)}
                          </Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  No Past Events
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Your attended events will appear here once you've been to them.
                </Typography>
              </Box>
            )}
          </motion.div>
        </TabPanel>

        {/* Created Events Tab */}
        <TabPanel value={currentTab} index={2}>
          <motion.div variants={itemVariants}>
            {createdEvents.length > 0 ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Your Created Events
                  </Typography>
                  <Button
                    variant="contained"
                    href="/admin"
                    startIcon={<EditIcon />}
                  >
                    Manage Events
                  </Button>
                </Box>
                <Grid container spacing={3}>
                  {createdEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <motion.div variants={itemVariants}>
                        <Box sx={{ position: 'relative' }}>
                          <EventCard event={event} />
                          <Chip
                            label="Creator"
                            size="small"
                            color="primary"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              zIndex: 2,
                              backgroundColor: 'primary.main',
                              color: 'white'
                            }}
                          />
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3
                }}
              >
                <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  No Created Events
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Start organizing campus events by creating your first event!
                </Typography>
                <Button
                  variant="contained"
                  href="/admin"
                  startIcon={<EditIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Create Your First Event
                </Button>
              </Box>
            )}
          </motion.div>
        </TabPanel>
      </motion.div>
    </Container>
  );
};

export default Profile;
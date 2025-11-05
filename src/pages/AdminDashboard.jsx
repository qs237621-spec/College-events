import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

// Components
import EventForm from '../components/admin/EventForm';
import { DataGrid } from '@mui/x-data-grid';

// Hooks
import useEvents from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTab, setCurrentTab] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { allEvents, categories, analytics, createEvent, updateEventById, deleteEventById } = useEvents();
  const { currentUser, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Please log in to access the admin dashboard
          </Typography>
        </Box>
      </Container>
    );
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setShowForm(false);
    setEditingEvent(null);
  };

  // Handle create event
  const handleCreateEvent = async (eventData) => {
    const result = await createEvent(eventData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  // Handle update event
  const handleUpdateEvent = async (eventId, updates) => {
    const result = await updateEventById(eventId, updates);
    if (result.success) {
      setEditingEvent(null);
      setShowForm(false);
    }
    return result;
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      await deleteEventById(eventId);
    }
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  // Tab panel component
  const TabPanel = ({ children, value, index }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Data Grid columns
  const columns = [
    {
      field: 'title',
      headerName: 'Event Title',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            backgroundColor: `${theme.palette.primary.light}20`,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'start',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: 'rsvpCount',
      headerName: 'RSVPs',
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value || 0}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditEvent(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteEvent(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage events, view analytics, and organize campus activities
            </Typography>
          </Box>
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
              <Tab label="Overview" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="Events" icon={<EventIcon />} iconPosition="start" />
              <Tab label="Create Event" icon={<AddIcon />} iconPosition="start" />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Overview Tab */}
        <TabPanel value={currentTab} index={0}>
          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.totalEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Events
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {allEvents.reduce((sum, event) => sum + (event.rsvpCount || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total RSVPs
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'accent.main', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.upcomingEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Events
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {categories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                </Paper>
              </Grid>

              {/* Popular Categories */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Popular Categories
                  </Typography>
                  {analytics.popularCategories.map((category, index) => (
                    <Box
                      key={category.category}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < analytics.popularCategories.length - 1 ? '1px solid var(--glass-border)' : 'none'
                      }}
                    >
                      <Typography variant="body1">{category.category}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.count} events
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setCurrentTab(2);
                        setShowForm(true);
                      }}
                      fullWidth
                    >
                      Create New Event
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<EventIcon />}
                      onClick={() => setCurrentTab(1)}
                      fullWidth
                    >
                      Manage Events
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={currentTab} index={1}>
          <motion.div variants={itemVariants}>
            <Paper
              sx={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border)',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={allEvents}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-root': {
                      border: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'var(--glass-bg)',
                      borderBottom: '1px solid var(--glass-border)',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid var(--glass-border)',
                    },
                    '& .MuiDataRow-root:hover': {
                      backgroundColor: 'var(--glass-bg)',
                    }
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        </TabPanel>

        {/* Create Event Tab */}
        <TabPanel value={currentTab} index={2}>
          <motion.div variants={itemVariants}>
            {showForm ? (
              <EventForm
                event={editingEvent}
                onSubmit={editingEvent ? (data) => handleUpdateEvent(editingEvent.id, data) : handleCreateEvent}
                onCancel={handleCloseForm}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Ready to create an amazing event?
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                >
                  Create New Event
                </Button>
              </Box>
            )}
          </motion.div>
        </TabPanel>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;
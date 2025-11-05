import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUsersStorage, useCurrentUserStorage } from '../hooks/useLocalStorage';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../utils/storage';
import eventsData from '../data/events.json';
import usersData from '../data/users.json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [users] = useUsersStorage();
  const [currentUser, setCurrentUser] = useCurrentUserStorage();
  const [loading, setLoading] = useState(true);

  // Initialize app with mock data if needed
  useEffect(() => {
    const initializeApp = () => {
      const storedEvents = getEvents();
      const storedUsers = users;

      // Initialize with mock data if empty
      if (storedEvents.length === 0) {
        // Add mock events with proper timestamps
        const enrichedEvents = eventsData.map(event => ({
          ...event,
          rsvpCount: 0, // Will be calculated from RSVPs
          createdAt: event.createdAt || new Date().toISOString(),
          updatedAt: event.updatedAt || new Date().toISOString()
        }));
        localStorage.setItem('college-events-data', JSON.stringify(enrichedEvents));
      }

      if (storedUsers.length === 0) {
        localStorage.setItem('college-events-users', JSON.stringify(usersData));
        // Set first user as current user for demo purposes
        setCurrentUser(usersData[0]);
      }

      // If no current user is set but we have users, set the first one
      if (!currentUser && storedUsers.length > 0) {
        setCurrentUser(storedUsers[0]);
      }

      setLoading(false);
    };

    initializeApp();
  }, [users, currentUser, setCurrentUser]);

  // Login function (mock - just sets current user)
  const login = (email, password) => {
    // In a real app, this would validate credentials
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'User not found' };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };

  // Register function (mock)
  const register = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      rsvps: [],
      createdEventIds: [],
      preferences: {
        theme: 'light',
        notifications: true,
        defaultCategory: 'Hackathon'
      },
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('college-events-users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };

    const updatedUser = { ...currentUser, ...updates };
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

    localStorage.setItem('college-events-users', JSON.stringify(updatedUsers));
    setCurrentUser(updatedUser);

    return { success: true, user: updatedUser };
  };

  // Check if user has RSVPed to an event
  const hasRSVPed = (eventId) => {
    return currentUser?.rsvps?.includes(eventId) || false;
  };

  // Get events created by current user
  const getCreatedEvents = () => {
    if (!currentUser) return [];
    const allEvents = getEvents();
    return allEvents.filter(event => currentUser.createdEventIds?.includes(event.id));
  };

  // Get events user has RSVPed to
  const getRSVPedEvents = () => {
    if (!currentUser) return [];
    const allEvents = getEvents();
    return allEvents.filter(event => currentUser.rsvps?.includes(event.id));
  };

  // Create new event
  const createEvent = (eventData) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };

    const newEvent = {
      ...eventData,
      id: `uuid-${Date.now()}`,
      organizer: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        handle: currentUser.email?.split('@')[0] || ''
      },
      rsvpCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = addEvent(newEvent);
    if (success) {
      // Update user's created events
      const updatedUser = {
        ...currentUser,
        createdEventIds: [...(currentUser.createdEventIds || []), newEvent.id]
      };
      updateProfile(updatedUser);

      return { success: true, event: newEvent };
    }

    return { success: false, error: 'Failed to create event' };
  };

  // Update event (only if user is the organizer)
  const updateEventById = (eventId, updates) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };

    const event = getEvents().find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };

    // Check if user is the organizer
    if (event.organizer.id !== currentUser.id) {
      return { success: false, error: 'Not authorized to update this event' };
    }

    const success = updateEvent(eventId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return { success };
  };

  // Delete event (only if user is the organizer)
  const deleteEventById = (eventId) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };

    const event = getEvents().find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };

    // Check if user is the organizer
    if (event.organizer.id !== currentUser.id) {
      return { success: false, error: 'Not authorized to delete this event' };
    }

    const success = deleteEvent(eventId);
    if (success) {
      // Remove event from user's created events
      const updatedUser = {
        ...currentUser,
        createdEventIds: (currentUser.createdEventIds || []).filter(id => id !== eventId)
      };
      updateProfile(updatedUser);

      return { success: true };
    }

    return { success: false, error: 'Failed to delete event' };
  };

  // Toggle RSVP for an event
  const toggleRSVP = (eventId) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };

    const event = getEvents().find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };

    const hasRSVP = currentUser.rsvps?.includes(eventId);
    let updatedRSVPs;

    if (hasRSVP) {
      // Remove RSVP
      updatedRSVPs = currentUser.rsvps.filter(id => id !== eventId);
    } else {
      // Add RSVP
      updatedRSVPs = [...(currentUser.rsvps || []), eventId];
    }

    const success = updateProfile({ rsvps: updatedRSVPs });

    return {
      success,
      isRSVPed: !hasRSVP,
      message: hasRSVP ? 'RSVP cancelled' : 'RSVP confirmed!'
    };
  };

  // Update user preferences
  const updatePreferences = (preferences) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };

    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences
      }
    };

    return updateProfile(updatedUser);
  };

  const value = {
    // User state
    currentUser,
    users,
    loading,
    isAuthenticated: !!currentUser,

    // Auth methods
    login,
    logout,
    register,
    updateProfile,

    // Event methods
    createEvent,
    updateEventById,
    deleteEventById,
    getCreatedEvents,
    getRSVPedEvents,

    // RSVP methods
    hasRSVPed,
    toggleRSVP,

    // Preferences
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
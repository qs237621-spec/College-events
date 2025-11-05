// localStorage utility functions for the College Events app

const STORAGE_KEYS = {
  EVENTS: 'college-events-data',
  USERS: 'college-events-users',
  CURRENT_USER: 'college-events-current-user',
  THEME: 'college-events-theme',
  RSVPs: 'college-events-rsvps'
};

// Generic storage operations
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// Events storage
export const getEvents = () => {
  return getStorageItem(STORAGE_KEYS.EVENTS, []);
};

export const setEvents = (events) => {
  return setStorageItem(STORAGE_KEYS.EVENTS, events);
};

export const addEvent = (event) => {
  const events = getEvents();
  events.push(event);
  return setEvents(events);
};

export const updateEvent = (eventId, updates) => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === eventId);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
    return setEvents(events);
  }
  return false;
};

export const deleteEvent = (eventId) => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== eventId);
  return setEvents(filteredEvents);
};

// Users storage
export const getUsers = () => {
  return getStorageItem(STORAGE_KEYS.USERS, []);
};

export const setUsers = (users) => {
  return setStorageItem(STORAGE_KEYS.USERS, users);
};

export const getCurrentUser = () => {
  return getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user) => {
  return setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return setUsers(users);
  }
  return false;
};

// Theme storage
export const getTheme = () => {
  return getStorageItem(STORAGE_KEYS.THEME, 'light');
};

export const setTheme = (theme) => {
  return setStorageItem(STORAGE_KEYS.THEME, theme);
};

// RSVP storage
export const getRSVPs = () => {
  return getStorageItem(STORAGE_KEYS.RSVPs, {});
};

export const setRSVPs = (rsvps) => {
  return setStorageItem(STORAGE_KEYS.RSVPs, rsvps);
};

export const addRSVP = (eventId, userId) => {
  const rsvps = getRSVPs();
  if (!rsvps[eventId]) {
    rsvps[eventId] = [];
  }
  if (!rsvps[eventId].includes(userId)) {
    rsvps[eventId].push(userId);
    return setRSVPs(rsvps);
  }
  return false;
};

export const removeRSVP = (eventId, userId) => {
  const rsvps = getRSVPs();
  if (rsvps[eventId]) {
    rsvps[eventId] = rsvps[eventId].filter(id => id !== userId);
    if (rsvps[eventId].length === 0) {
      delete rsvps[eventId];
    }
    return setRSVPs(rsvps);
  }
  return false;
};

export const hasRSVPed = (eventId, userId) => {
  const rsvps = getRSVPs();
  return rsvps[eventId]?.includes(userId) || false;
};

export const getRSVPCount = (eventId) => {
  const rsvps = getRSVPs();
  return rsvps[eventId]?.length || 0;
};

// Initialize storage with mock data if empty
export const initializeStorage = (mockEvents, mockUsers) => {
  if (getEvents().length === 0) {
    setEvents(mockEvents);
  }

  if (getUsers().length === 0) {
    setUsers(mockUsers);
    // Set first user as current user for demo purposes
    setCurrentUser(mockUsers[0]);
  }
};

// Clear all storage (useful for testing)
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
  });
};
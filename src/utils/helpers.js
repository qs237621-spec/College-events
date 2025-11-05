import { format, isValid, parseISO } from 'date-fns';

// Event filtering and sorting utilities

// Filter events by search term
export const filterEventsBySearch = (events, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return events;

  const term = searchTerm.toLowerCase().trim();
  return events.filter(event =>
    event.title.toLowerCase().includes(term) ||
    event.description.toLowerCase().includes(term) ||
    event.location.toLowerCase().includes(term) ||
    event.organizer.name.toLowerCase().includes(term) ||
    event.tags?.some(tag => tag.toLowerCase().includes(term))
  );
};

// Filter events by category
export const filterEventsByCategory = (events, categories) => {
  if (!categories || categories.length === 0) return events;
  return events.filter(event => categories.includes(event.category));
};

// Filter events by date range
export const filterEventsByDateRange = (events, startDate, endDate) => {
  if (!startDate && !endDate) return events;

  return events.filter(event => {
    const eventDate = parseISO(event.start);
    if (!isValid(eventDate)) return false;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return eventDate >= start && eventDate <= end;
    } else if (startDate) {
      const start = new Date(startDate);
      return eventDate >= start;
    } else if (endDate) {
      const end = new Date(endDate);
      return eventDate <= end;
    }

    return true;
  });
};

// Filter events by organizer
export const filterEventsByOrganizer = (events, organizerIds) => {
  if (!organizerIds || organizerIds.length === 0) return events;
  return events.filter(event => organizerIds.includes(event.organizer.id));
};

// Sort events
export const sortEvents = (events, sortBy) => {
  const sortedEvents = [...events];

  switch (sortBy) {
    case 'date-asc':
      return sortedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    case 'date-desc':
      return sortedEvents.sort((a, b) => new Date(b.start) - new Date(a.start));
    case 'title-asc':
      return sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
    case 'popularity':
      return sortedEvents.sort((a, b) => b.rsvpCount - a.rsvpCount);
    default:
      return sortedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
  }
};

// Combine all filters
export const filterAndSortEvents = (events, filters = {}, sortBy = 'date-asc') => {
  let filteredEvents = [...events];

  // Apply filters
  if (filters.search) {
    filteredEvents = filterEventsBySearch(filteredEvents, filters.search);
  }

  if (filters.categories && filters.categories.length > 0) {
    filteredEvents = filterEventsByCategory(filteredEvents, filters.categories);
  }

  if (filters.startDate || filters.endDate) {
    filteredEvents = filterEventsByDateRange(filteredEvents, filters.startDate, filters.endDate);
  }

  if (filters.organizerIds && filters.organizerIds.length > 0) {
    filteredEvents = filterEventsByOrganizer(filteredEvents, filters.organizerIds);
  }

  // Apply sorting
  return sortEvents(filteredEvents, sortBy);
};

// Get unique categories from events
export const getUniqueCategories = (events) => {
  const categories = events.map(event => event.category);
  return [...new Set(categories)];
};

// Get unique organizers from events
export const getUniqueOrganizers = (events) => {
  const organizers = events.map(event => event.organizer);
  const uniqueOrganizers = [];
  const seenIds = new Set();

  organizers.forEach(organizer => {
    if (!seenIds.has(organizer.id)) {
      seenIds.add(organizer.id);
      uniqueOrganizers.push(organizer);
    }
  });

  return uniqueOrganizers;
};

// Image utilities

// Generate placeholder image with blur effect
export const generatePlaceholderImage = (width = 400, height = 300, text = 'Event') => {
  return `https://via.placeholder.com/${width}x${height}/4A90E2/FFFFFF?text=${encodeURIComponent(text)}`;
};

// Optimize image URL for different sizes
export const getOptimizedImageUrl = (imageUrl, width = 400, height = 300) => {
  // This is a placeholder for image optimization logic
  // In a real app, you might use a service like Cloudinary, Imgix, etc.
  if (imageUrl.includes('unsplash.com')) {
    return imageUrl.replace(/w=\d+/, `w=${width}`).replace(/h=\d+/, `h=${height}`);
  }
  return imageUrl;
};

// Create lazy loading image with blur-up effect
export const createLazyImage = (src, placeholderSrc) => {
  return {
    src,
    placeholderSrc: placeholderSrc || generatePlaceholderImage(),
    loading: 'lazy'
  };
};

// Form validation helpers

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate event form
export const validateEventForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!formData.description || formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!formData.category) {
    errors.category = 'Please select a category';
  }

  if (!formData.location || formData.location.trim().length < 3) {
    errors.location = 'Location must be at least 3 characters long';
  }

  if (!formData.start) {
    errors.start = 'Start date and time are required';
  }

  if (!formData.end) {
    errors.end = 'End date and time are required';
  }

  if (formData.start && formData.end) {
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (startDate >= endDate) {
      errors.end = 'End time must be after start time';
    }

    if (startDate < new Date()) {
      errors.start = 'Start time cannot be in the past';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Text manipulation utilities

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Capitalize first letter of each word
export const capitalizeWords = (text) => {
  return text.replace(/\b\w/g, char => char.toUpperCase());
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Category utilities

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    'Hackathon': '#4A90E2',
    'Fest': '#FFC107',
    'Workshop': '#00C9A7',
    'Seminar': '#9C27B0',
    'Meetup': '#FF5722'
  };
  return colors[category] || '#757575';
};

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    'Hackathon': '💻',
    'Fest': '🎉',
    'Workshop': '🛠️',
    'Seminar': '📚',
    'Meetup': '☕'
  };
  return icons[category] || '📅';
};

// Analytics utilities

// Get popular categories
export const getPopularCategories = (events, limit = 5) => {
  const categoryCounts = {};

  events.forEach(event => {
    categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
};

// Get upcoming events count
export const getUpcomingEventsCount = (events) => {
  const now = new Date();
  return events.filter(event => new Date(event.start) > now).length;
};

// Get past events count
export const getPastEventsCount = (events) => {
  const now = new Date();
  return events.filter(event => new Date(event.end) < now).length;
};

// Get events happening this week
export const getThisWeekEvents = (events) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  return events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
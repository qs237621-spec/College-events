import { useState, useEffect, useMemo } from 'react';
import { useEventsStorage, useRSVPsStorage } from './useLocalStorage';
import {
  filterAndSortEvents,
  getUniqueCategories,
  getUniqueOrganizers,
  getUpcomingEventsCount,
  getPastEventsCount,
  getThisWeekEvents,
  getPopularCategories
} from '../utils/helpers';

export const useEvents = () => {
  const [events] = useEventsStorage();
  const [rsvps, setRsvps] = useRSVPsStorage();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    startDate: null,
    endDate: null,
    organizerIds: []
  });
  const [sortBy, setSortBy] = useState('date-asc');

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    return filterAndSortEvents(events, filters, sortBy);
  }, [events, filters, sortBy]);

  // Get unique categories and organizers
  const categories = useMemo(() => {
    return getUniqueCategories(events);
  }, [events]);

  const organizers = useMemo(() => {
    return getUniqueOrganizers(events);
  }, [events]);

  // Analytics data
  const analytics = useMemo(() => {
    return {
      totalEvents: events.length,
      upcomingEvents: getUpcomingEventsCount(events),
      pastEvents: getPastEventsCount(events),
      thisWeekEvents: getThisWeekEvents(events).length,
      popularCategories: getPopularCategories(events)
    };
  }, [events]);

  // RSVP functions
  const addRSVP = (eventId, userId) => {
    const newRsvps = { ...rsvps };
    if (!newRsvps[eventId]) {
      newRsvps[eventId] = [];
    }
    if (!newRsvps[eventId].includes(userId)) {
      newRsvps[eventId].push(userId);
      setRsvps(newRsvps);
      return true;
    }
    return false;
  };

  const removeRSVP = (eventId, userId) => {
    const newRsvps = { ...rsvps };
    if (newRsvps[eventId]) {
      newRsvps[eventId] = newRsvps[eventId].filter(id => id !== userId);
      if (newRsvps[eventId].length === 0) {
        delete newRsvps[eventId];
      }
      setRsvps(newRsvps);
      return true;
    }
    return false;
  };

  const hasRSVPed = (eventId, userId) => {
    return rsvps[eventId]?.includes(userId) || false;
  };

  const getRSVPCount = (eventId) => {
    return rsvps[eventId]?.length || 0;
  };

  const getEventWithRSVPCount = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      return {
        ...event,
        rsvpCount: getRSVPCount(eventId)
      };
    }
    return null;
  };

  // Filter update functions
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      startDate: null,
      endDate: null,
      organizerIds: []
    });
  };

  const updateSort = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Get single event by ID
  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  // Get events by category
  const getEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
  };

  // Get related events (same category, excluding current event)
  const getRelatedEvents = (eventId, limit = 6) => {
    const currentEvent = getEventById(eventId);
    if (!currentEvent) return [];

    return events
      .filter(event => event.category === currentEvent.category && event.id !== eventId)
      .slice(0, limit);
  };

  // Search events
  const searchEvents = (query) => {
    updateFilters({ search: query });
  };

  return {
    // Data
    events: filteredAndSortedEvents,
    allEvents: events,
    categories,
    organizers,
    analytics,

    // Loading state
    loading,

    // Filters and sorting
    filters,
    sortBy,
    updateFilters,
    clearFilters,
    updateSort,

    // RSVP functions
    addRSVP,
    removeRSVP,
    hasRSVPed,
    getRSVPCount,
    getEventWithRSVPCount,

    // Event getters
    getEventById,
    getEventsByCategory,
    getRelatedEvents,
    searchEvents
  };
};

export default useEvents;
// Calendar integration utilities for the College Events app

// Generate Google Calendar URL for an event
export const generateGoogleCalendarUrl = (event) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startDate = formatDate(event.start);
  const endDate = formatDate(event.end);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`,
    trp: false, // Is this event busy? false = available
    sprop: `name:${event.organizer.name}`,
    sprop: `website:${event.organizer.handle || ''}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Generate .ics file content for calendar import
export const generateICSContent = (event) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateLocal = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0];
  };

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//College Events App//College Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@college-events.com`,
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `DTSTAMP:${now}`,
    `CREATED:${formatDate(event.createdAt)}`,
    `LAST-MODIFIED:${formatDate(event.updatedAt)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `ORGANIZER:CN=${event.organizer.name}:mailto:events@college-events.com`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};

// Download .ics file
export const downloadICSFile = (event) => {
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// Add to Outlook Calendar (Web)
export const generateOutlookCalendarUrl = (event) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const params = new URLSearchParams({
    subject: event.title,
    body: event.description,
    location: event.location,
    start: formatDate(event.start),
    end: formatDate(event.end),
    allday: false
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

// Add to Yahoo Calendar
export const generateYahooCalendarUrl = (event) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    v: 60,
    title: event.title,
    desc: event.description,
    in_loc: event.location,
    st: formatDate(event.start),
    et: formatDate(event.end),
    dur: '' // Yahoo calculates duration automatically
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
};

// Check if the event is happening today
export const isEventToday = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  return today.toDateString() === event.toDateString();
};

// Check if the event is happening this week
export const isEventThisWeek = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  return event >= startOfWeek && event <= endOfWeek;
};

// Check if the event has passed
export const isEventPast = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  return event < now;
};

// Format event date for display
export const formatEventDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };

  return date.toLocaleDateString('en-US', defaultOptions);
};

// Format event time for display
export const formatEventTime = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...options
  };

  return date.toLocaleTimeString('en-US', defaultOptions);
};

// Get relative time (e.g., "In 2 days", "3 hours ago")
export const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));

  if (diffMs < 0) {
    const pastDiff = Math.abs(diffDays);
    if (pastDiff === 1) return 'Yesterday';
    if (pastDiff < 7) return `${pastDiff} days ago`;
    return formatEventDate(dateString);
  }

  if (diffMinutes < 60) return `In ${diffMinutes} minutes`;
  if (diffHours < 24) return `In ${diffHours} hours`;
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;

  return formatEventDate(dateString);
};

// Calculate event duration
export const getEventDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    return 'Less than 1 hour';
  }
};
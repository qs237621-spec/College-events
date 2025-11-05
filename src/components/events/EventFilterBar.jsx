import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  TextField,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  DateRange as DateIcon,
  Sort as SortIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { debounce } from '../../utils/helpers';

const EventFilterBar = ({
  filters,
  onFiltersChange,
  onSortChange,
  sortBy,
  categories,
  organizers,
  compact = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce((searchTerm) => {
    onFiltersChange({ ...filters, search: searchTerm });
  }, 300);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setLocalFilters({ ...localFilters, search: searchTerm });
    debouncedSearch(searchTerm);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = localFilters.categories?.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...(localFilters.categories || []), category];

    const newFilters = { ...localFilters, categories: newCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    onSortChange(newSortBy);
  };

  const handleDateRangeChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      search: '',
      categories: [],
      startDate: null,
      endDate: null,
      organizerIds: []
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key];
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== '';
  });

  // Search bar animation
  const searchVariants = {
    collapsed: { width: 200 },
    expanded: { width: isMobile ? '100%' : 400 }
  };

  // Filter content for mobile drawer and desktop accordion
  const filterContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Category Filters */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryToggle(category)}
              variant={localFilters.categories?.includes(category) ? 'filled' : 'outlined'}
              color={localFilters.categories?.includes(category) ? 'primary' : 'default'}
              size="small"
              clickable
              sx={{
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Date Range */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Date Range
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            type="date"
            label="Start Date"
            size="small"
            value={localFilters.startDate || ''}
            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            type="date"
            label="End Date"
            size="small"
            value={localFilters.endDate || ''}
            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </Box>

      {/* Sort Options */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Sort By
        </Typography>
        <FormControl size="small" fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortBy}
            label="Sort"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="date-asc">Date (Earliest first)</MenuItem>
            <MenuItem value="date-desc">Date (Latest first)</MenuItem>
            <MenuItem value="title-asc">Title (A-Z)</MenuItem>
            <MenuItem value="title-desc">Title (Z-A)</MenuItem>
            <MenuItem value="popularity">Most Popular</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          fullWidth
          sx={{ mt: 1 }}
        >
          Clear All Filters
        </Button>
      )}
    </Box>
  );

  if (compact) {
    // Compact version for mobile/small spaces
    return (
      <Box sx={{ mb: 3 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search events..."
          value={localFilters.search || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 2 }}
        />

        {/* Quick Category Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {categories.slice(0, 4).map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryToggle(category)}
              variant={localFilters.categories?.includes(category) ? 'filled' : 'outlined'}
              color={localFilters.categories?.includes(category) ? 'primary' : 'default'}
              size="small"
              clickable
            />
          ))}
        </Box>

        {/* Filter Button */}
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setMobileOpen(true)}
          fullWidth
        >
          More Filters
        </Button>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="bottom"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              maxHeight: '80vh',
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Filter Events</Typography>
              <IconButton onClick={() => setMobileOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {filterContent}
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Search Bar */}
      <motion.div
        variants={searchVariants}
        animate={searchExpanded ? 'expanded' : 'collapsed'}
        whileFocus="expanded"
        onFocus={() => setSearchExpanded(true)}
        onBlur={() => setSearchExpanded(false)}
      >
        <TextField
          fullWidth
          placeholder="Search events, organizers, locations..."
          value={localFilters.search || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <motion.div
                animate={{ rotate: searchExpanded ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              </motion.div>
            ),
            sx: {
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 2,
              '&:hover': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
              }
            }
          }}
          sx={{ mb: 3 }}
        />
      </motion.div>

      {/* Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Category Quick Filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Chip
                label={category}
                onClick={() => handleCategoryToggle(category)}
                variant={localFilters.categories?.includes(category) ? 'filled' : 'outlined'}
                color={localFilters.categories?.includes(category) ? 'primary' : 'default'}
                clickable
                sx={{
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              />
            </motion.div>
          ))}
        </Box>

        {/* Sort Button */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortBy}
            label="Sort"
            onChange={(e) => handleSortChange(e.target.value)}
            startAdornment={<SortIcon sx={{ mr: 1, fontSize: 20 }} />}
          >
            <MenuItem value="date-asc">Date ↑</MenuItem>
            <MenuItem value="date-desc">Date ↓</MenuItem>
            <MenuItem value="title-asc">Title A-Z</MenuItem>
            <MenuItem value="popularity">Popular</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </motion.div>
        )}
      </Box>

      {/* Active Filters Summary */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Active filters:
              </Typography>
              {localFilters.categories?.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  onDelete={() => handleCategoryToggle(category)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {localFilters.startDate && (
                <Chip
                  label={`From: ${new Date(localFilters.startDate).toLocaleDateString()}`}
                  size="small"
                  onDelete={() => handleDateRangeChange('startDate', null)}
                  variant="outlined"
                />
              )}
              {localFilters.endDate && (
                <Chip
                  label={`To: ${new Date(localFilters.endDate).toLocaleDateString()}`}
                  size="small"
                  onDelete={() => handleDateRangeChange('endDate', null)}
                  variant="outlined"
                />
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default EventFilterBar;
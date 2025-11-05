import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  useTheme
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { validateEventForm } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const EventForm = ({ event, onSubmit, onCancel, loading = false }) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || '',
    location: event?.location || '',
    start: event?.start ? new Date(event.start).toISOString().slice(0, 16) : '',
    end: event?.end ? new Date(event.end).toISOString().slice(0, 16) : '',
    tags: event?.tags?.join(', ') || '',
    imageUrl: event?.imageUrl || '',
  });

  const [imagePreview, setImagePreview] = useState(event?.imageUrl || '');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field if user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageUrl: 'Image size must be less than 5MB' }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageUrl: 'Please select an image file' }));
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({ ...prev, imageUrl }));
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateEventForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Mark all fields as touched
      const allTouched = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }

    // Prepare event data
    const eventData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      organizer: event?.organizer || {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        handle: currentUser.email?.split('@')[0] || ''
      }
    };

    onSubmit(eventData);
  };

  const getFieldError = (field) => {
    return touched[field] ? errors[field] : '';
  };

  const categories = ['Hackathon', 'Fest', 'Workshop', 'Seminar', 'Meetup'];

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        sx={{
          p: 4,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 4 }}>
          {event ? 'Edit Event' : 'Create New Event'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="Event Title *"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  error={!!getFieldError('title')}
                  helperText={getFieldError('title')}
                  required
                  variant="outlined"
                />
              </motion.div>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="Description *"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  error={!!getFieldError('description')}
                  helperText={getFieldError('description')}
                  multiline
                  rows={4}
                  required
                  variant="outlined"
                />
              </motion.div>
            </Grid>

            {/* Category and Location */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <FormControl fullWidth required error={!!getFieldError('category')}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={handleInputChange('category')}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {getFieldError('category') && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {getFieldError('category')}
                    </Typography>
                  )}
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="Location *"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  error={!!getFieldError('location')}
                  helperText={getFieldError('location')}
                  required
                  variant="outlined"
                />
              </motion.div>
            </Grid>

            {/* Date and Time */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="Start Date & Time *"
                  type="datetime-local"
                  value={formData.start}
                  onChange={handleInputChange('start')}
                  error={!!getFieldError('start')}
                  helperText={getFieldError('start')}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="End Date & Time *"
                  type="datetime-local"
                  value={formData.end}
                  onChange={handleInputChange('end')}
                  error={!!getFieldError('end')}
                  helperText={getFieldError('end')}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </motion.div>
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  value={formData.tags}
                  onChange={handleInputChange('tags')}
                  helperText="Enter tags separated by commas (e.g., AI/ML, Innovation, Networking)"
                  variant="outlined"
                  placeholder="AI/ML, Innovation, Networking"
                />
              </motion.div>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Event Image
                </Typography>

                {/* Image Preview */}
                {imagePreview ? (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Event preview"
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid var(--glass-border)'
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'var(--glass-bg)',
                        backdropFilter: 'blur(10px)',
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.main',
                          color: 'white'
                        }
                      }}
                      aria-label="Remove image"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: getFieldError('imageUrl') ? 'error.main' : 'grey.300',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.light',
                        color: 'primary.main'
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <ImageIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Click to upload event image
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PNG, JPG, GIF up to 5MB
                    </Typography>
                  </Box>
                )}

                {getFieldError('imageUrl') && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                    {getFieldError('imageUrl')}
                  </Typography>
                )}

                {/* Or enter image URL */}
                <TextField
                  fullWidth
                  label="Or enter image URL"
                  value={formData.imageUrl}
                  onChange={handleInputChange('imageUrl')}
                  error={!!getFieldError('imageUrl')}
                  helperText={getFieldError('imageUrl') || 'Leave empty to use category icon'}
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </motion.div>
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    sx={{
                      minWidth: 120,
                      background: loading ? 'grey.300' : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: loading ? 'grey.300' : `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      }
                    }}
                  >
                    {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default EventForm;
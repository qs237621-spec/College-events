import React from 'react';
import { motion } from 'framer-motion';
import {
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Brightness7 as LightIcon,
  Brightness4 as DarkIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ size = 'medium', sx = {} }) => {
  const { mode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isDark = mode === 'dark';

  const toggleAnimation = {
    whileTap: { scale: 0.9 },
    whileHover: { scale: 1.1 }
  };

  const iconAnimation = {
    initial: { rotate: 0 },
    animate: { rotate: isDark ? 180 : 0 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleTheme}
        size={size}
        sx={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border)',
          color: theme.palette.text.primary,
          '&:hover': {
            background: 'var(--glass-bg)',
            boxShadow: '0 4px 12px var(--glass-shadow)',
          },
          ...sx
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div {...toggleAnimation}>
          <motion.div {...iconAnimation}>
            {isDark ? (
              <DarkIcon fontSize={size === 'small' ? 'small' : 'medium'} />
            ) : (
              <LightIcon fontSize={size === 'small' ? 'small' : 'medium'} />
            )}
          </motion.div>
        </motion.div>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
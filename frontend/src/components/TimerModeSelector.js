import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const TimerModeSelector = ({ mode, onModeChange, workDuration, shortBreak, longBreak }) => {
  const formatDuration = (minutes) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    return `${minutes}m`;
  };

  const getModeLabel = () => {
    if (mode === 'work') return `Work (${formatDuration(workDuration)})`;
    if (mode === 'shortBreak') return `Short Break (${formatDuration(shortBreak)})`;
    return `Long Break (${formatDuration(longBreak)})`;
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '300px' },
        mx: 'auto',
        mt: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 0 },
      }}
    >
      <FormControl fullWidth variant="outlined">
        <InputLabel
          id="timer-mode-select-label"
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: '#6b7280',
          }}
        >
          Timer Mode
        </InputLabel>
        <Select
          labelId="timer-mode-select-label"
          id="timer-mode-select"
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          label="Timer Mode"
          IconComponent={ExpandMore}
          sx={{
            borderRadius: '16px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(139, 92, 246, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(139, 92, 246, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(139, 92, 246, 0.8)',
            },
          }}
        >
          <MenuItem value="work" sx={{ fontFamily: "'Nunito', sans-serif" }}>
            Work ({formatDuration(workDuration)})
          </MenuItem>
          <MenuItem value="shortBreak" sx={{ fontFamily: "'Nunito', sans-serif" }}>
            Short Break ({formatDuration(shortBreak)})
          </MenuItem>
          <MenuItem value="longBreak" sx={{ fontFamily: "'Nunito', sans-serif" }}>
            Long Break ({formatDuration(longBreak)})
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default TimerModeSelector;


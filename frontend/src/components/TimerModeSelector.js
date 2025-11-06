import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';

const TimerModeSelector = ({ 
  mode, 
  onModeChange, 
  workDuration, 
  shortBreak, 
  longBreak,
  customMode,
  onCustomModeChange,
  customDurations,
  onCustomDurationsChange,
  isAuthenticated,
}) => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [tempCustomDurations, setTempCustomDurations] = useState(customDurations);

  const formatDuration = (minutes) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    return `${minutes}m`;
  };

  const getModeLabel = () => {
    if (customMode) {
      if (mode === 'work') return `Custom Work (${formatDuration(workDuration)})`;
      if (mode === 'shortBreak') return `Custom Short Break (${formatDuration(shortBreak)})`;
      return `Custom Long Break (${formatDuration(longBreak)})`;
    }
    if (mode === 'work') return `Work (${formatDuration(workDuration)})`;
    if (mode === 'shortBreak') return `Short Break (${formatDuration(shortBreak)})`;
    return `Long Break (${formatDuration(longBreak)})`;
  };

  const handleModeChange = (newMode) => {
    if (newMode === 'custom') {
      setCustomDialogOpen(true);
    } else if (newMode === 'work' || newMode === 'shortBreak' || newMode === 'longBreak') {
      // User selected a regular mode, turn off custom mode
      onCustomModeChange(false);
      onModeChange(newMode);
    }
  };

  const handleCustomSave = () => {
    onCustomDurationsChange(tempCustomDurations);
    onCustomModeChange(true);
    onModeChange('work');
    setCustomDialogOpen(false);
  };

  const handleCustomCancel = () => {
    setTempCustomDurations(customDurations);
    setCustomDialogOpen(false);
  };

  return (
    <>
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
            value={customMode ? 'custom' : (mode || 'work')}
            onChange={(e) => handleModeChange(e.target.value)}
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
            {isAuthenticated && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem value="custom" sx={{ fontFamily: "'Nunito', sans-serif", color: '#3b82f6' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings sx={{ fontSize: '1rem' }} />
                    <Typography>Custom Timer (Temporary)</Typography>
                  </Box>
                </MenuItem>
              </>
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Custom Timer Dialog */}
      <Dialog 
        open={customDialogOpen} 
        onClose={handleCustomCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#6d28d9',
            textAlign: 'center',
          }}
        >
          Custom Timer Settings
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Nunito', sans-serif",
              color: '#6b7280',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Set custom timer durations (not saved)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Work Duration (minutes)"
              type="number"
              value={tempCustomDurations.work}
              onChange={(e) => setTempCustomDurations({
                ...tempCustomDurations,
                work: parseInt(e.target.value) || 25,
              })}
              inputProps={{ min: 1, max: 120 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1rem',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              fullWidth
              label="Short Break (minutes)"
              type="number"
              value={tempCustomDurations.shortBreak}
              onChange={(e) => setTempCustomDurations({
                ...tempCustomDurations,
                shortBreak: parseInt(e.target.value) || 5,
              })}
              inputProps={{ min: 1, max: 60 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1rem',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              fullWidth
              label="Long Break (minutes)"
              type="number"
              value={tempCustomDurations.longBreak}
              onChange={(e) => setTempCustomDurations({
                ...tempCustomDurations,
                longBreak: parseInt(e.target.value) || 15,
              })}
              inputProps={{ min: 1, max: 120 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1rem',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCustomCancel}
            variant="outlined"
            className="rounded-full"
            sx={{
              borderRadius: '9999px',
              textTransform: 'none',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              padding: '8px 24px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCustomSave}
            variant="contained"
            className="rounded-full bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500"
            sx={{
              borderRadius: '9999px',
              textTransform: 'none',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              padding: '8px 24px',
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TimerModeSelector;

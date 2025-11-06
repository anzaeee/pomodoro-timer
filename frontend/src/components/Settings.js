import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Grid,
  Alert,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { Delete, Add, Edit } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Settings = ({ open, onClose, preferences, customPresets = [], onPreferencesUpdate, onPresetsUpdate }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    longBreakInterval: 4,
    soundEnabled: true,
  });
  const [presetForm, setPresetForm] = useState({
    name: '',
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [editingPreset, setEditingPreset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (preferences) {
      setFormData({
        workDuration: preferences.workDuration || 25,
        shortBreak: preferences.shortBreak || 5,
        longBreak: preferences.longBreak || 15,
        autoStartBreaks: preferences.autoStartBreaks ?? true,
        autoStartPomodoros: preferences.autoStartPomodoros ?? false,
        longBreakInterval: preferences.longBreakInterval || 4,
        soundEnabled: preferences.soundEnabled ?? true,
      });
    }
  }, [preferences]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field.includes('Duration') || field.includes('Break') || field.includes('Interval')
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handlePresetChange = (field) => (event) => {
    const value = event.target.value;
    setPresetForm((prev) => ({
      ...prev,
      [field]: field === 'name' ? value : parseInt(value) || 0,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put(`${API_URL}/preferences`, formData);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
      if (onPreferencesUpdate) {
        onPreferencesUpdate(response.data.preferences);
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save preferences',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePreset = async () => {
    if (!presetForm.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a preset name' });
      return;
    }

    if (customPresets.length >= 3) {
      setMessage({ type: 'error', text: 'Maximum of 3 custom presets allowed' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post(`${API_URL}/presets`, presetForm);
      setMessage({ type: 'success', text: 'Preset created successfully!' });
      setPresetForm({ name: '', workDuration: 25, shortBreak: 5, longBreak: 15 });
      if (onPresetsUpdate) {
        onPresetsUpdate();
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create preset',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreset = async () => {
    if (!presetForm.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a preset name' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put(`${API_URL}/presets/${editingPreset.id}`, presetForm);
      setMessage({ type: 'success', text: 'Preset updated successfully!' });
      setEditingPreset(null);
      setPresetForm({ name: '', workDuration: 25, shortBreak: 5, longBreak: 15 });
      if (onPresetsUpdate) {
        onPresetsUpdate();
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update preset',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePreset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this preset?')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.delete(`${API_URL}/presets/${id}`);
      setMessage({ type: 'success', text: 'Preset deleted successfully!' });
      if (onPresetsUpdate) {
        onPresetsUpdate();
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete preset',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPreset = (preset) => {
    setEditingPreset(preset);
    setPresetForm({
      name: preset.name,
      workDuration: preset.workDuration,
      shortBreak: preset.shortBreak,
      longBreak: preset.longBreak,
    });
  };

  const handleCancelEdit = () => {
    setEditingPreset(null);
    setPresetForm({ name: '', workDuration: 25, shortBreak: 5, longBreak: 15 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="rounded-2xl">
      <DialogTitle className="bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500 text-white rounded-t-2xl">
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} className="text-white">
          <Tab label="Preferences" className="text-white" />
          <Tab label="Custom Presets" className="text-white" />
        </Tabs>
      </DialogTitle>
      <DialogContent className="mt-4">
        {message.text && (
          <Alert severity={message.type} className="mb-4 rounded-xl">
            {message.text}
          </Alert>
        )}

        {tab === 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom className="text-pastel-purple-600 font-medium">
              Timer Durations (minutes)
            </Typography>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Work"
                  type="number"
                  value={formData.workDuration}
                  onChange={handleChange('workDuration')}
                  inputProps={{ min: 1, max: 120 }}
                  className="rounded-xl"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Short Break"
                  type="number"
                  value={formData.shortBreak}
                  onChange={handleChange('shortBreak')}
                  inputProps={{ min: 1, max: 60 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Long Break"
                  type="number"
                  value={formData.longBreak}
                  onChange={handleChange('longBreak')}
                  inputProps={{ min: 1, max: 120 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Long Break Interval"
              type="number"
              value={formData.longBreakInterval}
              onChange={handleChange('longBreakInterval')}
              inputProps={{ min: 1 }}
              helperText="Number of pomodoros before a long break"
              className="mb-4"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />

            <Typography variant="subtitle2" gutterBottom className="mt-4 text-pastel-purple-600 font-medium">
              Auto Start
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.autoStartPomodoros}
                  onChange={handleChange('autoStartPomodoros')}
                />
              }
              label="Auto-start pomodoros"
              className="mb-2"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.autoStartBreaks}
                  onChange={handleChange('autoStartBreaks')}
                />
              }
              label="Auto-start breaks"
              className="mb-4"
            />

            <Typography variant="subtitle2" gutterBottom className="text-pastel-purple-600 font-medium">
              Sound
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.soundEnabled}
                  onChange={handleChange('soundEnabled')}
                />
              }
              label="Enable notification sound"
            />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom className="mb-4 text-pastel-purple-600 font-medium">
              Create Custom Preset ({customPresets.length}/3)
            </Typography>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Preset Name"
                  value={presetForm.name}
                  onChange={handlePresetChange('name')}
                  placeholder="e.g., Focus Mode"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={2.67}>
                <TextField
                  fullWidth
                  label="Work"
                  type="number"
                  value={presetForm.workDuration}
                  onChange={handlePresetChange('workDuration')}
                  inputProps={{ min: 1, max: 120 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={2.67}>
                <TextField
                  fullWidth
                  label="Short Break"
                  type="number"
                  value={presetForm.shortBreak}
                  onChange={handlePresetChange('shortBreak')}
                  inputProps={{ min: 1, max: 60 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={2.67}>
                <TextField
                  fullWidth
                  label="Long Break"
                  type="number"
                  value={presetForm.longBreak}
                  onChange={handlePresetChange('longBreak')}
                  inputProps={{ min: 1, max: 120 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box className="mb-4">
              {editingPreset ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={handleUpdatePreset}
                    variant="contained"
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500"
                    sx={{ borderRadius: '12px', textTransform: 'none' }}
                  >
                    Update Preset
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outlined"
                    className="rounded-xl"
                    sx={{ borderRadius: '12px', textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  onClick={handleCreatePreset}
                  variant="contained"
                  disabled={loading || customPresets.length >= 3}
                  startIcon={<Add />}
                  className="rounded-xl bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500"
                  sx={{ borderRadius: '12px', textTransform: 'none' }}
                >
                  Create Preset
                </Button>
              )}
            </Box>

            <Typography variant="subtitle2" gutterBottom className="mt-6 mb-2 text-pastel-purple-600 font-medium">
              Your Presets
            </Typography>
            <List>
              {customPresets.map((preset) => (
                <ListItem
                  key={preset.id}
                  className="mb-2 rounded-xl bg-pastel-purple-50 border border-pastel-purple-200"
                  sx={{ borderRadius: '12px' }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" className="font-medium">
                          {preset.name}
                        </Typography>
                        <Chip
                          label={`${preset.workDuration}/${preset.shortBreak}/${preset.longBreak}m`}
                          size="small"
                          className="rounded-lg"
                          sx={{ borderRadius: '8px' }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEditPreset(preset)}
                      className="text-pastel-blue-600"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeletePreset(preset.id)}
                      className="text-red-500"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {customPresets.length === 0 && (
                <Typography variant="body2" className="text-gray-500 text-center py-4">
                  No custom presets yet. Create one above!
                </Typography>
              )}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} className="rounded-xl" sx={{ borderRadius: '12px', textTransform: 'none' }}>
          Close
        </Button>
        {tab === 0 && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500"
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Settings;

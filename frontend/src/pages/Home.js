import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import {
  AccountCircle,
  Settings as SettingsIcon,
  Logout,
} from '@mui/icons-material';
import PomodoroTimer from '../components/PomodoroTimer';
import Settings from '../components/Settings';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);
  const [customPresets, setCustomPresets] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPreferences();
      fetchCustomPresets();
    }
  }, [isAuthenticated]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`${API_URL}/preferences`);
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchCustomPresets = async () => {
    try {
      const response = await axios.get(`${API_URL}/presets`);
      setCustomPresets(response.data.presets);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setPreferences(null);
    setCustomPresets([]);
    setSelectedPreset(null);
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
  };

  const getCurrentSettings = () => {
    if (selectedPreset) {
      return {
        workDuration: selectedPreset.workDuration,
        shortBreak: selectedPreset.shortBreak,
        longBreak: selectedPreset.longBreak,
        autoStartBreaks: preferences?.autoStartBreaks ?? true,
        autoStartPomodoros: preferences?.autoStartPomodoros ?? false,
        longBreakInterval: preferences?.longBreakInterval || 4,
        soundEnabled: preferences?.soundEnabled ?? true,
      };
    }
    return preferences;
  };

  return (
    <Box 
      className="min-h-screen flex flex-col bg-gradient-to-br from-pastel-purple-50 via-pastel-blue-50 to-pastel-purple-100"
      sx={{
        minHeight: '100vh',
        minHeight: '-webkit-fill-available', // iOS Safari fix
      }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        className="rounded-b-[24px] shadow-md"
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <Toolbar 
          sx={{
            px: { xs: 2, sm: 4, md: 8 },
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              letterSpacing: '0.5px',
              color: '#6d28d9',
            }}
          >
            Pomodoro Timer
          </Typography>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                color="inherit" 
                onClick={() => setSettingsOpen(true)} 
                className="rounded-full hover:bg-pastel-purple-100 transition-all duration-300"
                sx={{
                  borderRadius: '50%',
                  color: '#8b5cf6',
                  padding: { xs: '8px', sm: '12px' },
                  '&:hover': {
                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <SettingsIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              </IconButton>
              <IconButton 
                color="inherit" 
                onClick={handleLogout} 
                className="rounded-full hover:bg-red-100 transition-all duration-300"
                sx={{
                  borderRadius: '50%',
                  color: '#ef4444',
                  padding: { xs: '8px', sm: '12px' },
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Logout sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              </IconButton>
              <Box 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center', 
                  ml: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                  borderRadius: '9999px',
                  bgcolor: 'rgba(139, 92, 246, 0.1)',
                  border: '2px solid rgba(139, 92, 246, 0.2)',
                }} 
                className="rounded-full"
              >
                <AccountCircle sx={{ mr: 1, color: '#8b5cf6', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                <Typography 
                  variant="body2" 
                  className="font-bold text-pastel-purple-600"
                  sx={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  }}
                >
                  {user?.name || user?.email}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                className="rounded-full px-6 py-2.5 transition-all duration-300 hover:scale-105"
                sx={{
                  borderRadius: '9999px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#8b5cf6',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  fontFamily: "'Nunito', sans-serif",
                  padding: '10px 24px',
                  '&:hover': {
                    bgcolor: 'rgba(139, 92, 246, 0.08)',
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                className="rounded-full px-6 py-2.5 bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500 hover:from-pastel-purple-600 hover:to-pastel-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                sx={{
                  borderRadius: '9999px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: "'Nunito', sans-serif",
                  padding: '10px 24px',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 4 },
        }}
      >
        {isAuthenticated && customPresets.length > 0 && (
          <Box className="mb-8 w-full max-w-2xl animate-slide-in">
            <Typography 
              variant="subtitle1" 
              className="mb-4 text-pastel-purple-600 font-bold text-center"
              sx={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#6d28d9',
              }}
            >
              Your Custom Presets
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {customPresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={selectedPreset?.id === preset.id ? 'contained' : 'outlined'}
                  onClick={() => handlePresetSelect(preset)}
                  className="rounded-full px-6 py-3 transition-all duration-300 hover:scale-105"
                  sx={{
                    borderRadius: '9999px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    fontFamily: "'Nunito', sans-serif",
                    bgcolor: selectedPreset?.id === preset.id 
                      ? 'rgba(139, 92, 246, 0.9)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    color: selectedPreset?.id === preset.id ? 'white' : '#8b5cf6',
                    borderColor: selectedPreset?.id === preset.id 
                      ? 'transparent' 
                      : 'rgba(139, 92, 246, 0.3)',
                    boxShadow: selectedPreset?.id === preset.id 
                      ? '0 4px 20px rgba(139, 92, 246, 0.3)' 
                      : '0 2px 10px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 25px rgba(139, 92, 246, 0.4)',
                    },
                  }}
                >
                  {preset.name}
                </Button>
              ))}
              {selectedPreset && (
                <Button
                  variant="text"
                  onClick={() => setSelectedPreset(null)}
                  className="rounded-full px-6 py-3 text-pastel-purple-600 transition-all duration-300 hover:scale-105"
                  sx={{
                    borderRadius: '9999px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    fontFamily: "'Nunito', sans-serif",
                    '&:hover': {
                      bgcolor: 'rgba(139, 92, 246, 0.1)',
                    },
                  }}
                >
                  Use Default
                </Button>
              )}
            </Box>
          </Box>
        )}

        <PomodoroTimer
          preferences={getCurrentSettings()}
          customPresets={customPresets}
          onPresetsUpdate={fetchCustomPresets}
          isAuthenticated={isAuthenticated}
        />
      </Container>

      {/* Settings Dialog */}
      <Settings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        preferences={preferences}
        customPresets={customPresets}
        onPreferencesUpdate={(updatedPreferences) => {
          setPreferences(updatedPreferences);
        }}
        onPresetsUpdate={fetchCustomPresets}
      />
    </Box>
  );
}

export default Home;

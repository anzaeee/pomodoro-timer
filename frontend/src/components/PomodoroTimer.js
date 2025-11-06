import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  ButtonGroup,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { PlayArrow, Pause, Stop, Refresh } from '@mui/icons-material';
import TimerModeSelector from './TimerModeSelector';

const PomodoroTimer = ({ preferences, customPresets = [], onPresetsUpdate, isAuthenticated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [bubbleAnimation, setBubbleAnimation] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customDurations, setCustomDurations] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const intervalRef = useRef(null);
  const autoStartRef = useRef(false);
  const modeRef = useRef('work');

  const workDuration = customMode ? customDurations.work : (preferences?.workDuration || 25);
  const shortBreak = customMode ? customDurations.shortBreak : (preferences?.shortBreak || 5);
  const longBreak = customMode ? customDurations.longBreak : (preferences?.longBreak || 15);
  const longBreakInterval = preferences?.longBreakInterval || 4;
  const autoStartBreaks = preferences?.autoStartBreaks ?? true;
  const autoStartPomodoros = preferences?.autoStartPomodoros ?? false;

  useEffect(() => {
    // Set initial time based on mode
    if (mode === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreak * 60);
    } else {
      setTimeLeft(longBreak * 60);
    }
  }, [mode, workDuration, shortBreak, longBreak, customMode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Auto-start after mode change
  useEffect(() => {
    if (autoStartRef.current) {
      if (mode === 'work' && autoStartPomodoros) {
        setIsRunning(true);
      } else if ((mode === 'shortBreak' || mode === 'longBreak') && autoStartBreaks) {
        setIsRunning(true);
      }
      autoStartRef.current = false;
    }
  }, [mode, autoStartBreaks, autoStartPomodoros, customMode]);

  // Animate bubble when mode changes
  useEffect(() => {
    if (modeRef.current !== mode) {
      setBubbleAnimation('animate-bubble-pop');
      modeRef.current = mode;
      setTimeout(() => setBubbleAnimation(''), 500);
    }
  }, [mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound if enabled
    if (preferences?.soundEnabled !== false) {
      playNotificationSound();
    }

    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      // Determine next break type
      if (newCount % longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
      autoStartRef.current = true;
    } else {
      // Break completed, go back to work
      setMode('work');
      autoStartRef.current = true;
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreak * 60);
    } else {
      setTimeLeft(longBreak * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setPomodoroCount(0);
    setMode('work');
    setTimeLeft(workDuration * 60);
    // Reset custom mode
    if (customMode) {
      setCustomMode(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    let total;
    if (mode === 'work') {
      total = workDuration * 60;
    } else if (mode === 'shortBreak') {
      total = shortBreak * 60;
    } else {
      total = longBreak * 60;
    }
    return ((total - timeLeft) / total) * 100;
  };

  const getModeLabel = () => {
    if (mode === 'work') return 'Work';
    if (mode === 'shortBreak') return 'Short Break';
    return 'Long Break';
  };

  const getModeColor = () => {
    if (mode === 'work') return 'primary';
    if (mode === 'shortBreak') return 'success';
    return 'secondary';
  };

  const getBubbleGradient = () => {
    if (mode === 'work') {
      return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
    } else if (mode === 'shortBreak') {
      return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else {
      return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
    }
  };

  const getBubbleShadow = () => {
    if (mode === 'work') {
      return '0 20px 60px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)';
    } else if (mode === 'shortBreak') {
      return '0 20px 60px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)';
    } else {
      return '0 20px 60px rgba(96, 165, 250, 0.4), 0 0 40px rgba(96, 165, 250, 0.2)';
    }
  };

  return (
    <Box 
      className="w-full max-w-2xl mx-auto animate-fade-in"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: '24px', sm: '32px', md: '40px' },
      }}
    >
      <Paper
        elevation={0}
        className="rounded-[32px] bg-white/70 backdrop-blur-md shadow-xl border border-white/40"
        sx={{
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          padding: { xs: '32px', sm: '40px', md: '48px' },
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {/* Mode Chip */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 4, sm: 6, md: 8 },
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            label={getModeLabel()}
            color={getModeColor()}
            className="rounded-full px-5 py-2 text-base font-semibold shadow-md"
            sx={{
              borderRadius: '9999px',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              padding: { xs: '6px 16px', sm: '8px 20px' },
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            }}
          />
          {customMode && (
            <Chip
              label="CUSTOM MODE"
              color="info"
              className="rounded-full px-3 py-1 text-xs font-semibold shadow-md"
              sx={{
                borderRadius: '9999px',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600,
                padding: { xs: '4px 12px', sm: '6px 16px' },
                boxShadow: '0 2px 12px rgba(96, 165, 250, 0.3)',
              }}
            />
          )}
        </Box>

        {/* Pomodoro Count */}
        <Typography 
          variant="h6" 
          className="text-center"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            fontWeight: 600,
            letterSpacing: '0.3px',
            color: '#6d28d9',
            fontFamily: "'Nunito', sans-serif",
            mb: { xs: 4, sm: 6, md: 8 },
          }}
        >
          {pomodoroCount} Pomodoros Completed
        </Typography>

        {/* Bubble Timer */}
        <Box 
          className="flex justify-center mb-8"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Box
            className={`relative ${bubbleAnimation} ${isRunning ? 'animate-pulse-slow' : ''}`}
            sx={{
              position: 'relative',
              width: { xs: '260px', sm: '300px', md: '320px' },
              height: { xs: '260px', sm: '300px', md: '320px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer Glow */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: getBubbleGradient(),
                opacity: 0.2,
                filter: 'blur(30px)',
                animation: isRunning ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            />
            
            {/* Bubble Circle */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: '240px', sm: '280px', md: '280px' },
                height: { xs: '240px', sm: '280px', md: '280px' },
                borderRadius: '50%',
                background: getBubbleGradient(),
                boxShadow: getBubbleShadow(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Inner Circle with Progress */}
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: '220px', sm: '260px', md: '260px' },
                  height: { xs: '220px', sm: '260px', md: '260px' },
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              
              {/* Timer Text */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 800,
                  color: 'white',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                  letterSpacing: { xs: '2px', sm: '3px' },
                  fontFamily: "'Nunito', sans-serif",
                  lineHeight: 1,
                  position: 'relative',
                  zIndex: 10,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                  fontFeatureSettings: '"tnum"',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>

            {/* Progress Ring */}
            <CircularProgress
              variant="determinate"
              value={getProgress()}
              size={isMobile ? 260 : 320}
              thickness={3}
              sx={{
                position: 'absolute',
                color: 'rgba(255, 255, 255, 0.3)',
                zIndex: 0,
                width: { xs: '260px', sm: '300px', md: '320px' },
                height: { xs: '260px', sm: '300px', md: '320px' },
              }}
            />
          </Box>
        </Box>

        {/* Control Buttons */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, sm: 3 },
            mb: { xs: 4, sm: 6 },
            flexWrap: 'wrap',
          }}
        >
          <ButtonGroup 
            variant="contained" 
            size={isMobile ? "medium" : "large"} 
            className="rounded-full"
            sx={{
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            {!isRunning ? (
              <Button
                startIcon={<PlayArrow />}
                onClick={handleStart}
                className="rounded-l-full bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500 hover:from-pastel-purple-600 hover:to-pastel-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                sx={{
                  borderRadius: { xs: '9999px', sm: '9999px 0 0 9999px' },
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  padding: { xs: '10px 20px', sm: '12px 24px' },
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Start
              </Button>
            ) : (
              <Button
                startIcon={<Pause />}
                onClick={handlePause}
                className="rounded-l-full bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500 hover:from-pastel-purple-600 hover:to-pastel-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                sx={{
                  borderRadius: { xs: '9999px', sm: '9999px 0 0 9999px' },
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  padding: { xs: '10px 20px', sm: '12px 24px' },
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Pause
              </Button>
            )}
            <Button
              startIcon={<Stop />}
              onClick={handleStop}
              className="bg-red-400 hover:bg-red-500 shadow-md hover:shadow-lg transition-all duration-300"
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                padding: { xs: '10px 18px', sm: '12px 20px' },
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Stop
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={handleReset}
              className="rounded-r-full bg-pastel-purple-300 hover:bg-pastel-purple-400 shadow-md hover:shadow-lg transition-all duration-300"
              sx={{
                borderRadius: { xs: '9999px', sm: '0 9999px 9999px 0' },
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                padding: { xs: '10px 18px', sm: '12px 20px' },
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Reset
            </Button>
          </ButtonGroup>
        </Box>

        {/* Mode Selection Dropdown */}
        <TimerModeSelector
          mode={mode}
          onModeChange={(newMode) => {
            setMode(newMode);
            setIsRunning(false);
          }}
          workDuration={workDuration}
          shortBreak={shortBreak}
          longBreak={longBreak}
          customMode={customMode}
          onCustomModeChange={setCustomMode}
          customDurations={customDurations}
          onCustomDurationsChange={setCustomDurations}
          isAuthenticated={isAuthenticated}
        />
      </Paper>
    </Box>
  );
};

export default PomodoroTimer;

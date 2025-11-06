import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PomodoroTimer from '../PomodoroTimer';

// Mock the timer mode selector
jest.mock('../TimerModeSelector', () => {
  return function MockTimerModeSelector() {
    return <div data-testid="timer-mode-selector">Timer Mode Selector</div>;
  };
});

describe('PomodoroTimer', () => {
  const defaultProps = {
    preferences: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: true,
      autoStartPomodoros: false,
    },
    customPresets: [],
    onPresetsUpdate: jest.fn(),
    isAuthenticated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the timer component', () => {
    render(<PomodoroTimer {...defaultProps} />);
    expect(screen.getByText(/Work/i)).toBeInTheDocument();
  });

  it('should display the correct initial time', () => {
    render(<PomodoroTimer {...defaultProps} />);
    // Should show 25:00 for work mode
    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
  });

  it('should start the timer when start button is clicked', () => {
    render(<PomodoroTimer {...defaultProps} />);
    const startButton = screen.getByText(/Start/i);
    fireEvent.click(startButton);
    
    // Timer should be running
    expect(screen.getByText(/Pause/i)).toBeInTheDocument();
  });

  it('should pause the timer when pause button is clicked', () => {
    render(<PomodoroTimer {...defaultProps} />);
    const startButton = screen.getByText(/Start/i);
    fireEvent.click(startButton);
    
    const pauseButton = screen.getByText(/Pause/i);
    fireEvent.click(pauseButton);
    
    expect(screen.getByText(/Start/i)).toBeInTheDocument();
  });

  it('should reset the timer when reset button is clicked', () => {
    render(<PomodoroTimer {...defaultProps} />);
    const startButton = screen.getByText(/Start/i);
    fireEvent.click(startButton);
    
    // Advance time a bit
    jest.advanceTimersByTime(5000);
    
    const resetButton = screen.getByText(/Reset/i);
    fireEvent.click(resetButton);
    
    // Should be back to initial time
    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
  });
});


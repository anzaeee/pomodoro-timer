import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Box 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-purple-50 via-pastel-blue-50 to-pastel-purple-100 animate-fade-in"
      sx={{
        minHeight: '100vh',
        minHeight: '-webkit-fill-available', // iOS Safari fix
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '16px', sm: '24px' },
        paddingBottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: '24px' },
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={0}
          className="rounded-[32px] bg-white/70 backdrop-blur-md shadow-xl border border-white/40 animate-slide-in"
          sx={{
            borderRadius: '32px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            padding: { xs: '32px', sm: '40px', md: '48px' },
            width: '100%',
            maxWidth: '480px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              className="text-pastel-purple-600 font-bold"
              sx={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.25rem' },
                letterSpacing: '0.5px',
                color: '#6d28d9',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              className="text-gray-600"
              sx={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '1rem',
                color: '#6b7280',
                mb: 3,
              }}
            >
              Sign in to continue to your Pomodoro Timer
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              className="mb-4 rounded-2xl animate-slide-in"
              sx={{
                borderRadius: '20px',
                fontSize: '0.95rem',
                fontFamily: "'Nunito', sans-serif",
                mb: 3,
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                className="rounded-2xl"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    color: '#6b7280',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                className="rounded-2xl"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    color: '#6b7280',
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="rounded-full py-3 bg-gradient-to-r from-pastel-purple-500 to-pastel-blue-500 hover:from-pastel-purple-600 hover:to-pastel-blue-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              sx={{
                borderRadius: '9999px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 700,
                padding: '14px',
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: '0.5px',
                mb: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Login'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#9ca3af',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '0.875rem',
                }}
              >
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography 
                variant="body2" 
                className="text-gray-600 mb-2"
                sx={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  mb: 1.5,
                }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-pastel-purple-600 hover:text-pastel-purple-700 font-bold transition-colors duration-300"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
              <Link 
                to="/" 
                className="text-pastel-blue-600 hover:text-pastel-blue-700 transition-colors duration-300"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                Use timer without logging in
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;

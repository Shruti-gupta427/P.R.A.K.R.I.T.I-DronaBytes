import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <Box className="auth-container">
      {/* Animated Background */}
      <Box className="animated-background">
        <Box className="cityscape"></Box>
        <Box className="neon-grid"></Box>
        <Box className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <Box key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></Box>
          ))}
        </Box>
      </Box>

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box className="auth-card">
          {/* Header with Anime-style Title */}
          <Box className="auth-header">
            <Typography 
              variant="h3" 
              className="auth-title"
              sx={{
                background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 3s ease infinite',
                fontWeight: 900,
                textShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
                letterSpacing: '2px',
                mb: 1
              }}
            >
              PRAKRITI
            </Typography>
            <Typography 
              variant="h6" 
              className="auth-subtitle"
              sx={{
                color: '#00ffff',
                textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                fontWeight: 600,
                letterSpacing: '3px'
              }}
            >
              WELCOME BACK, PLAYER
            </Typography>
            <Box className="title-underline"></Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                bgcolor: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid #ff0000',
                color: '#ff0000',
                '& .MuiAlert-icon': {
                  color: '#ff0000'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <Box className="input-wrapper">
              <EmailIcon className="input-icon" sx={{ color: '#00ffff' }} />
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#00ffff',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff00ff',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff00ff',
                      boxShadow: '0 0 20px rgba(255, 0, 255, 0.8)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#00ffff',
                    '&.Mui-focused': {
                      color: '#ff00ff'
                    }
                  }
                }}
              />
            </Box>

            <Box className="input-wrapper">
              <LockIcon className="input-icon" sx={{ color: '#00ffff' }} />
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#00ffff' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#00ffff',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff00ff',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff00ff',
                      boxShadow: '0 0 20px rgba(255, 0, 255, 0.8)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#00ffff',
                    '&.Mui-focused': {
                      color: '#ff00ff'
                    }
                  }
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="auth-button"
              startIcon={<LoginIcon />}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '2px',
                background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                boxShadow: '0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4)',
                border: '2px solid transparent',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                },
                '&.Mui-disabled': {
                  background: 'rgba(128, 128, 128, 0.3)',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'LOADING...' : 'ENTER GAME'}
            </Button>

            <Box className="auth-link-container">
              <Typography variant="body2" sx={{ color: '#888', mr: 1 }}>
                New to PRAKRITI?
              </Typography>
              <Link to="/register" className="auth-link">
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#00ffff',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                    fontWeight: 600,
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 15px rgba(255, 0, 255, 0.8)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  CREATE ACCOUNT →
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;

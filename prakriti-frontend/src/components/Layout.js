import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container 
} from '@mui/material';
import '../styles/theme.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <>{children}</>;
  }

  return (
    <>
      <AppBar 
        position="static" 
        sx={{
          background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(26, 10, 46, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none',
              background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 900,
              letterSpacing: '2px',
              fontSize: '1.5rem',
              textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
            }}
          >
            PRAKRITI
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/dashboard"
                  sx={{
                    color: '#00ffff',
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/tasks"
                  sx={{
                    color: '#00ffff',
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }
                  }}
                >
                  Tasks
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/Complaint"
                  sx={{
                    color: '#00ffff',
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }
                  }}
                >
                  Complaints
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/leaderboard"
                  sx={{
                    color: '#00ffff',
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }
                  }}
                >
                  Leaderboard
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/profile"
                  sx={{
                    color: '#00ffff',
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }
                  }}
                >
                  Profile
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{
                    color: '#ff00ff',
                    border: '1px solid rgba(255, 0, 255, 0.5)',
                    '&:hover': {
                      color: '#ff0000',
                      borderColor: '#ff0000',
                      boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{
                    color: '#00ffff',
                    '&:hover': {
                      color: '#ff00ff',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  className="theme-button"
                  sx={{ px: 2 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 0, mb: 0, p: 0 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;

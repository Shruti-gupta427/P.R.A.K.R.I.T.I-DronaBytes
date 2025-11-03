import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container 
} from '@mui/material';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            PRAKRITI
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/tasks">
                  Tasks
                </Button>
                <Button color="inherit" component={Link} to="/complaints">
                  Complaints
                </Button>
                <Button color="inherit" component={Link} to="/leaderboard">
                  Leaderboard
                </Button>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
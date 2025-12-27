import React from 'react';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Nature as EcoIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import '../styles/theme.css';

const Home = () => {
  return (
    <Box className="theme-background">
      {/* Animated Background */}
      <Box className="theme-animated-bg">
        <Box className="theme-cityscape"></Box>
        <Box className="theme-neon-grid"></Box>
        <Box className="theme-particles">
          {[...Array(15)].map((_, i) => (
            <Box 
              key={i} 
              className="theme-particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </Box>
      </Box>

      <Container maxWidth="lg" className="theme-content">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', py: 8, mb: 6 }}>
          <Typography 
            variant="h1" 
            className="theme-title"
            sx={{ 
              fontSize: { xs: '3rem', md: '5rem' },
              mb: 2
            }}
          >
            PRAKRITI
          </Typography>
          <Typography 
            variant="h5" 
            className="theme-subtitle"
            sx={{ 
              fontSize: { xs: '1rem', md: '1.5rem' },
              mb: 4
            }}
          >
            PLANET RESTORATION & KNOWLEDGE THROUGH REAL-WORLD INTERACTIVE TASKS
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
            <Button
              component={Link}
              to="/register"
              className="theme-button"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              START YOUR JOURNEY
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5,
                borderColor: '#00ffff',
                color: '#00ffff',
                '&:hover': {
                  borderColor: '#ff00ff',
                  color: '#ff00ff',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
                }
              }}
            >
              LOGIN
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper className="theme-card" sx={{ textAlign: 'center', height: '100%' }}>
              <TrophyIcon sx={{ fontSize: 60, color: '#ff00ff', mb: 2, filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.8))' }} />
              <Typography variant="h6" className="theme-subtitle" gutterBottom>
                GAMIFICATION
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mt: 2 }}>
                Earn points, level up, and unlock badges by completing environmental tasks
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper className="theme-card" sx={{ textAlign: 'center', height: '100%' }}>
              <FireIcon sx={{ fontSize: 60, color: '#00ffff', mb: 2, filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }} />
              <Typography variant="h6" className="theme-subtitle" gutterBottom>
                STREAK SYSTEM
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mt: 2 }}>
                Maintain daily streaks and compete on the leaderboard
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper className="theme-card" sx={{ textAlign: 'center', height: '100%' }}>
              <EcoIcon sx={{ fontSize: 60, color: '#00ffff', mb: 2, filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }} />
              <Typography variant="h6" className="theme-subtitle" gutterBottom>
                ECO TASKS
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mt: 2 }}>
                Complete real-world environmental tasks and make a difference
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper className="theme-card" sx={{ textAlign: 'center', height: '100%' }}>
              <TrendingIcon sx={{ fontSize: 60, color: '#ff00ff', mb: 2, filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.8))' }} />
              <Typography variant="h6" className="theme-subtitle" gutterBottom>
                TRACK PROGRESS
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mt: 2 }}>
                Monitor your environmental impact and see your progress grow
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* About Section */}
        <Paper className="theme-card" sx={{ mb: 6 }}>
          <Typography variant="h4" className="theme-title" gutterBottom>
            ABOUT PRAKRITI
          </Typography>
          <Box className="title-underline" sx={{ width: 150, height: 3, mb: 3 }}></Box>
          <Typography variant="body1" sx={{ color: '#ccc', lineHeight: 1.8, fontSize: '1.1rem' }}>
            PRAKRITI is an innovative gamified environmental learning platform designed for Smart India Hackathon 2025. 
            Join the mission to restore our planet through interactive tasks, earn rewards, and compete with others 
            while making a real-world environmental impact.
          </Typography>
          <Typography variant="body1" sx={{ color: '#00ffff', mt: 3, fontWeight: 600 }}>
            Developed by <span style={{ color: '#ff00ff' }}>DronaBytes Team</span>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;

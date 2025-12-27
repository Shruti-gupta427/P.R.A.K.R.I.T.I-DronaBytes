import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  CircularProgress,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  Assignment as TaskIcon,
  Report as ComplaintIcon,
  TrendingUp as RankIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/authservices';
import '../styles/theme.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const response = await api.get(`/api/users/dashboard/${user._id}`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="theme-background">
        <Box className="theme-animated-bg">
          <Box className="theme-cityscape"></Box>
          <Box className="theme-neon-grid"></Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" className="theme-content">
          <CircularProgress sx={{ color: '#00ffff' }} />
        </Box>
      </Box>
    );
  }

  const userStats = user?.profile?.stats || {};
  const level = user?.profile?.level || 1;
  const exp = user?.profile?.experience || 0;
  const expForNextLevel = level * 100;
  const expProgress = Math.min((exp / expForNextLevel) * 100, 100);
  const expNeeded = Math.max(expForNextLevel - exp, 0);

  return (
    <Box className="theme-background">
      <Box className="theme-animated-bg">
        <Box className="theme-cityscape"></Box>
        <Box className="theme-neon-grid"></Box>
        <Box className="theme-particles">
          {[...Array(10)].map((_, i) => (
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

      <Box className="theme-content" sx={{ p: 3 }}>
        {/* Welcome Header */}
        <Paper className="theme-card" sx={{ mb: 4, textAlign: 'center', py: 4 }}>
          <Typography variant="h3" className="theme-title" gutterBottom>
            WELCOME BACK, {user?.profile?.firstName?.toUpperCase() || user?.username?.toUpperCase()}
          </Typography>
          <Typography variant="h6" className="theme-subtitle">
            READY TO SAVE THE PLANET?
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Level & Experience Card */}
          <Grid item xs={12} md={6}>
            <Paper className="theme-card">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <StarIcon sx={{ fontSize: 40, color: '#ff00ff', filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.8))' }} />
                <Typography variant="h5" className="theme-subtitle">
                  LEVEL {level}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>Experience Points</Typography>
                  <Typography variant="body2" className="theme-subtitle">
                    {exp} / {expForNextLevel} XP
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={expProgress} 
                  className="theme-progress"
                />
                <Typography variant="caption" sx={{ color: '#888', mt: 0.5, display: 'block' }}>
                  {expNeeded} XP needed for Level {level + 1}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: 2 }}>
                    <TaskIcon sx={{ color: '#00ffff', mb: 1 }} />
                    <Typography variant="h4" className="theme-subtitle">
                      {userStats.tasksCompleted || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>Tasks</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 0, 255, 0.1)', borderRadius: 2 }}>
                    <ComplaintIcon sx={{ color: '#ff00ff', mb: 1 }} />
                    <Typography variant="h4" sx={{ color: '#ff00ff', fontWeight: 700 }}>
                      {userStats.complaintsSubmitted || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>Complaints</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Rank & Streak Card */}
          <Grid item xs={12} md={6}>
            <Paper className="theme-card">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <RankIcon sx={{ fontSize: 40, color: '#00ffff', filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }} />
                <Typography variant="h5" className="theme-subtitle">
                  RANK & STREAK
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>Current Rank</Typography>
                  <Typography variant="h4" className="theme-subtitle">
                    #{stats?.rank || 'N/A'}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255, 0, 255, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                      <FireIcon sx={{ color: '#ff00ff', mb: 1 }} />
                      <Typography variant="h5" sx={{ color: '#ff00ff', fontWeight: 700 }}>
                        {user?.profile?.streak?.current || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>Current Streak</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                      <FireIcon sx={{ color: '#00ffff', mb: 1 }} />
                      <Typography variant="h5" className="theme-subtitle">
                        {user?.profile?.streak?.longest || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>Longest Streak</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ p: 2, bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                  <TrophyIcon sx={{ color: '#ff00ff', mb: 1 }} />
                  <Typography variant="h5" sx={{ color: '#ff00ff', fontWeight: 700 }}>
                    {user?.profile?.badges?.length || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>Badges Earned</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Points Card */}
          <Grid item xs={12}>
            <Paper className="theme-card">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TrophyIcon sx={{ fontSize: 40, color: '#ff00ff', filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.8))' }} />
                <Typography variant="h5" className="theme-subtitle">
                  TOTAL POINTS
                </Typography>
              </Box>
              <Typography variant="h2" className="theme-title" sx={{ textAlign: 'center', py: 2 }}>
                {userStats.pointsEarned || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
                Keep completing tasks to earn more points!
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper className="theme-card">
              <Typography variant="h6" className="theme-subtitle" gutterBottom>
                QUICK ACTIONS
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mt: 2, lineHeight: 1.8 }}>
                Start completing tasks to earn points and level up! Check out available tasks and make a difference for the environment.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  LinearProgress 
} from '@mui/material';
import api from '../services/authservices';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const userStats = user?.profile?.stats || {};
  const level = user?.profile?.level || 1;
  const exp = user?.profile?.experience || 0;
  const expForNextLevel = level * 100;
  const expProgress = (exp / expForNextLevel) * 100;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.profile?.firstName || user?.username}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Stats</Typography>
              <Typography variant="body1">Level: {level}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Experience: {exp} / {expForNextLevel}</Typography>
                <LinearProgress variant="determinate" value={expProgress} sx={{ mt: 1 }} />
              </Box>
              <Typography variant="body1">Tasks Completed: {userStats.tasksCompleted || 0}</Typography>
              <Typography variant="body1">Complaints Submitted: {userStats.complaintsSubmitted || 0}</Typography>
              <Typography variant="body1">Total Points: {userStats.pointsEarned || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Rank & Streak</Typography>
              <Typography variant="body1">Current Rank: #{stats?.rank || 'N/A'}</Typography>
              <Typography variant="body1">Current Streak: {user?.profile?.streak?.current || 0} days</Typography>
              <Typography variant="body1">Longest Streak: {user?.profile?.streak?.longest || 0} days</Typography>
              <Typography variant="body1">Badges Earned: {user?.profile?.badges?.length || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Quick Actions</Typography>
              <Typography variant="body2" color="text.secondary">
                Start completing tasks to earn points and level up! Check out available tasks and make a difference for the environment.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
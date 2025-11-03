import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip 
} from '@mui/material';

const Profile = () => {
  const { user } = useAuth();

  const userStats = user?.profile?.stats || {};
  const level = user?.profile?.level || 1;
  const badges = user?.profile?.badges || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profile Information</Typography>
              <Typography variant="body1">
                <strong>Username:</strong> {user?.username}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {user?.profile?.firstName} {user?.profile?.lastName}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {user?.role}
              </Typography>
              {user?.profile?.location?.coordinates[0] !== 0 && (
                <Typography variant="body1">
                  <strong>Location:</strong> {user.profile.location.coordinates[1]}, {user.profile.location.coordinates[0]}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Statistics</Typography>
              <Typography variant="body1">Level: <strong>{level}</strong></Typography>
              <Typography variant="body1">Experience: {user?.profile?.experience || 0}</Typography>
              <Typography variant="body1">Tasks Completed: {userStats.tasksCompleted || 0}</Typography>
              <Typography variant="body1">Complaints Submitted: {userStats.complaintsSubmitted || 0}</Typography>
              <Typography variant="body1">Total Points: {userStats.pointsEarned || 0}</Typography>
              <Typography variant="body1">Current Streak: {user?.profile?.streak?.current || 0} days</Typography>
              <Typography variant="body1">Longest Streak: {user?.profile?.streak?.longest || 0} days</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Badges</Typography>
              {badges.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No badges earned yet. Complete tasks to earn badges!
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {badges.map((badge, index) => (
                    <Chip 
                      key={index} 
                      label={badge} 
                      color="primary" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
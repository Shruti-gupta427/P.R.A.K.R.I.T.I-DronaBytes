import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Avatar,
  Button,
  LinearProgress,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import '../styles/theme.css';
import {
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as TaskIcon,
  Report as ComplaintIcon
} from '@mui/icons-material';
import EditProfileDialog from '../components/profile/EditProfileDialog';
import ActivityFeed from '../components/profile/ActivityFeed';
import StreakCalendar from '../components/profile/StreakCalendar';
import { getUserSubmissions, getUserComplaints, getUserDashboard } from '../services/authservices';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user?._id) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, submissionsRes, complaintsRes] = await Promise.all([
        getUserDashboard(user._id),
        getUserSubmissions(),
        getUserComplaints()
      ]);

      if (dashboardRes?.success) {
        setDashboardData(dashboardRes.data);
      }
      if (submissionsRes?.success) {
        setSubmissions(submissionsRes.data.submissions || []);
      }
      if (complaintsRes?.success) {
        setComplaints(complaintsRes.data.complaints || []);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    await refreshUser();
    await fetchProfileData();
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success'
    });
  };

  const userStats = user?.profile?.stats || {};
  const level = user?.profile?.level || 1;
  const experience = user?.profile?.experience || 0;
  const badges = user?.profile?.badges || [];
  const streak = user?.profile?.streak || { current: 0, longest: 0 };

  // Calculate XP for next level
  const expForNextLevel = level * 100;
  const expProgress = experience > 0 ? Math.min((experience / expForNextLevel) * 100, 100) : 0;
  const expNeeded = Math.max(expForNextLevel - experience, 0);

  // Get user initials for avatar
  const getInitials = () => {
    const firstName = user?.profile?.firstName || '';
    const lastName = user?.profile?.lastName || '';
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
        <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Profile Header */}
      <Paper
        className="theme-card"
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.3) 0%, rgba(0, 255, 255, 0.3) 100%)',
          color: 'white',
        }}
      >
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Avatar
            src={user?.profile?.avatar}
            sx={{
              width: 120,
              height: 120,
              fontSize: '3rem',
              bgcolor: 'rgba(255,255,255,0.2)',
              border: '4px solid white'
            }}
          >
            {getInitials()}
          </Avatar>
          <Box flex={1} minWidth={200}>
            <Typography variant="h4" gutterBottom>
              {user?.profile?.firstName && user?.profile?.lastName
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user?.username}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
              @{user?.username}
            </Typography>
            {user?.profile?.bio && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                {user.profile.bio}
              </Typography>
            )}
            <Box display="flex" gap={2} mt={2} flexWrap="wrap">
              <Chip
                icon={<StarIcon />}
                label={`Level ${level}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<TrophyIcon />}
                label={`${badges.length} Badges`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              {user?.isVerified && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Verified"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
            </Box>
          </Box>
          <Button
            className="theme-button"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            EDIT PROFILE
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={4}>
          <Paper className="theme-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" />
                Profile Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Username</Typography>
                  <Typography variant="body1" fontWeight="medium">{user?.username}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight="medium">{user?.email}</Typography>
                </Box>
                {(user?.profile?.firstName || user?.profile?.lastName) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.profile.firstName} {user.profile.lastName}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">Role</Typography>
                  <Chip
                    label={user?.role?.toUpperCase() || 'USER'}
                    size="small"
                    color={user?.role === 'admin' ? 'error' : user?.role === 'government' ? 'warning' : 'primary'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                {user?.profile?.location?.coordinates[0] !== 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.profile.location.coordinates[1].toFixed(4)}, {user.profile.location.coordinates[0].toFixed(4)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Paper>
        </Grid>

        {/* Statistics Card */}
        <Grid item xs={12} md={8}>
          <Paper className="theme-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon color="primary" />
                Statistics & Progress
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {/* Level Progress */}
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body1" fontWeight="medium">
                    Level {level} - Experience Points
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {experience} / {expForNextLevel} XP
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={expProgress}
                  className="theme-progress"
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {expNeeded} XP needed for Level {level + 1}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                    <TaskIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {userStats.tasksCompleted || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tasks Completed
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                    <ComplaintIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold" color="error.main">
                      {userStats.complaintsSubmitted || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Complaints Submitted
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                    <TrophyIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {userStats.pointsEarned || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Points
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                    <FireIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold" color="error.main">
                      {streak.current || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Current Streak (days)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                    <FireIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {streak.longest || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Longest Streak (days)
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Rank Display */}
              {dashboardData?.rank && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.contrastText">
                    Current Rank: #{dashboardData.rank}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Paper>
        </Grid>

        {/* Badges Section */}
        <Grid item xs={12}>
          <Paper className="theme-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrophyIcon color="primary" />
                Badges & Achievements
              </Typography>
              <Divider sx={{ my: 2 }} />
              {badges.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <TrophyIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No badges earned yet. Complete tasks to earn badges!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {badges.map((badge, index) => {
                    const badgeName = typeof badge === 'string' ? badge : badge.name || `Badge ${index + 1}`;
                    return (
                      <Paper
                        key={index}
                        elevation={2}
                        sx={{
                          p: 2,
                          minWidth: 150,
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <TrophyIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">
                          {badgeName}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Paper>
        </Grid>

        {/* Streak Calendar */}
        <Grid item xs={12} md={6}>
          <Paper className="theme-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FireIcon color="error" />
                Streak Calendar
              </Typography>
              <Divider sx={{ my: 2 }} />
              <StreakCalendar streak={streak} />
            </CardContent>
          </Paper>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={6}>
          <Paper className="theme-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TaskIcon color="primary" />
                Recent Activity
              </Typography>
              <Divider sx={{ my: 2 }} />
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <ActivityFeed submissions={submissions} complaints={complaints} />
              )}
            </CardContent>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUpdate={handleProfileUpdate}
        user={user}
      />
      </Box>
    </Box>
  );
};

export default Profile;

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';

const StreakCalendar = ({ streak = { current: 0, longest: 0 } }) => {
  // Generate last 30 days for visualization
  const generateLast30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const days = generateLast30Days();
  const currentStreak = streak.current || 0;
  const longestStreak = streak.longest || 0;

  // Simple visualization - show last 30 days
  // In a real implementation, you'd get actual activity data from backend
  const getDayIntensity = (dayIndex) => {
    // Simulate activity - in real app, this would come from backend
    // Show current streak days with higher intensity
    const daysFromToday = 29 - dayIndex;
    if (daysFromToday < currentStreak) {
      return Math.min(0.7 + (currentStreak - daysFromToday) * 0.1, 1);
    }
    // Random low activity for other days
    return Math.random() * 0.3;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FireIcon />
            {currentStreak} Day Streak
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Longest: {longestStreak} days
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2" color="text.secondary">
            Last 30 Days
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={0.5} sx={{ mb: 2 }}>
        {days.map((day, index) => {
          const intensity = getDayIntensity(index);
          const isToday = index === 29;
          
          return (
            <Grid item xs={1.2} key={index}>
              <Paper
                elevation={0}
                sx={{
                  aspectRatio: '1',
                  bgcolor: intensity > 0.5 
                    ? `rgba(255, 87, 34, ${intensity})` 
                    : 'grey.200',
                  border: isToday ? '2px solid' : '1px solid',
                  borderColor: isToday ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    zIndex: 1,
                    boxShadow: 2
                  }
                }}
                title={`${day.toLocaleDateString()} - ${intensity > 0.5 ? 'Active' : 'Inactive'}`}
              />
            </Grid>
          );
        })}
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Box display="flex" gap={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Paper
              sx={{
                width: 12,
                height: 12,
                bgcolor: 'grey.200',
                borderRadius: 0.5
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Less
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Paper
              sx={{
                width: 12,
                height: 12,
                bgcolor: 'error.main',
                borderRadius: 0.5
              }}
            />
            <Typography variant="caption" color="text.secondary">
              More
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Keep your streak going!
        </Typography>
      </Box>

      {/* Streak Milestones */}
      <Box mt={3}>
        <Typography variant="subtitle2" gutterBottom>
          Streak Milestones
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
          {[7, 30, 100, 365].map(milestone => (
            <Paper
              key={milestone}
              elevation={0}
              sx={{
                p: 1,
                px: 2,
                bgcolor: currentStreak >= milestone ? 'success.light' : 'grey.100',
                borderRadius: 1,
                border: currentStreak >= milestone ? '1px solid' : '1px solid',
                borderColor: currentStreak >= milestone ? 'success.main' : 'grey.300'
              }}
            >
              <Typography
                variant="caption"
                fontWeight={currentStreak >= milestone ? 'bold' : 'normal'}
                color={currentStreak >= milestone ? 'success.dark' : 'text.secondary'}
              >
                {milestone} days {currentStreak >= milestone && '✓'}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StreakCalendar;


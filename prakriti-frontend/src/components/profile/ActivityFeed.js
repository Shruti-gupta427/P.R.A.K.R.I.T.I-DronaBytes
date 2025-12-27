import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Report as ComplaintIcon,
  CheckCircle as VerifiedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  History as HistoryIcon
} from '@mui/icons-material';
// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
};

const ActivityFeed = ({ submissions = [], complaints = [] }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'resolved':
        return <VerifiedIcon color="success" />;
      case 'pending':
      case 'submitted':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <RejectedIcon color="error" />;
      default:
        return <HistoryIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'resolved':
        return 'success';
      case 'pending':
      case 'submitted':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Combine and sort activities by date
  const activities = [
    ...submissions.map(sub => ({
      type: 'task',
      id: sub.task?._id || sub.submission?._id,
      title: sub.task?.title || 'Task Submission',
      category: sub.task?.category,
      status: sub.submission?.status || 'pending',
      date: sub.submission?.submittedAt || sub.submission?.createdAt,
      points: sub.task?.points || 0,
      data: sub
    })),
    ...complaints.map(complaint => ({
      type: 'complaint',
      id: complaint._id,
      title: complaint.title || 'Complaint',
      category: complaint.category,
      status: complaint.status || 'submitted',
      date: complaint.createdAt,
      points: 0,
      data: complaint
    }))
  ].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  }).slice(0, 10); // Show only last 10 activities

  if (activities.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <HistoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No recent activity. Start completing tasks or submitting complaints!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ maxHeight: 500, overflow: 'auto' }}>
      {activities.map((activity, index) => (
        <React.Fragment key={`${activity.type}-${activity.id}-${index}`}>
          <ListItem
            sx={{
              px: 0,
              py: 1.5,
              '&:hover': {
                bgcolor: 'action.hover',
                borderRadius: 1
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {activity.type === 'task' ? (
                <TaskIcon color="primary" />
              ) : (
                <ComplaintIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="body2" fontWeight="medium">
                    {activity.title}
                  </Typography>
                  {activity.category && (
                    <Chip
                      label={activity.category}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    icon={getStatusIcon(activity.status)}
                    label={activity.status}
                    size="small"
                    color={getStatusColor(activity.status)}
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              }
              secondary={
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(activity.date)}
                  </Typography>
                  {activity.type === 'task' && activity.points > 0 && (
                    <>
                      <Typography variant="caption" color="text.secondary">•</Typography>
                      <Typography variant="caption" color="primary" fontWeight="medium">
                        {activity.points} points
                      </Typography>
                    </>
                  )}
                </Box>
              }
            />
          </ListItem>
          {index < activities.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ActivityFeed;


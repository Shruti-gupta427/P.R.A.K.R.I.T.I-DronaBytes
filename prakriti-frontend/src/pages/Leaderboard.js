import React, { useEffect, useState } from 'react';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  Paper,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import '../styles/theme.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/api/users/leaderboard/combined');
      if (response.data.success) {
        setLeaderboard(response.data.data);
      }
    } catch (error) {
      console.error('Leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 0) return <TrophyIcon sx={{ color: '#ffd700', fontSize: 30 }} />;
    if (rank === 1) return <TrophyIcon sx={{ color: '#c0c0c0', fontSize: 30 }} />;
    if (rank === 2) return <TrophyIcon sx={{ color: '#cd7f32', fontSize: 30 }} />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 0) return '#ffd700';
    if (rank === 1) return '#c0c0c0';
    if (rank === 2) return '#cd7f32';
    return '#00ffff';
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
        <Paper className="theme-card" sx={{ mb: 4, textAlign: 'center' }}>
          <TrophyIcon sx={{ fontSize: 60, color: '#ffd700', mb: 2, filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))' }} />
          <Typography variant="h3" className="theme-title" gutterBottom>
            LEADERBOARD
          </Typography>
          <Typography variant="h6" className="theme-subtitle">
            TOP ENVIRONMENTAL WARRIORS
          </Typography>
        </Paper>

        {leaderboard.length === 0 ? (
          <Paper className="theme-card" sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" className="theme-subtitle" gutterBottom>
              NO RANKINGS YET
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Start completing tasks to appear on the leaderboard!
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} className="theme-card">
            <Table className="theme-table">
              <TableHead>
                <TableRow>
                  <TableCell>RANK</TableCell>
                  <TableCell>USER</TableCell>
                  <TableCell>LEVEL</TableCell>
                  <TableCell>POINTS</TableCell>
                  <TableCell>TASKS</TableCell>
                  <TableCell>COMPLAINTS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((user, index) => (
                  <TableRow 
                    key={user._id}
                    sx={{
                      bgcolor: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                      '&:hover': {
                        bgcolor: index < 3 
                          ? 'rgba(255, 215, 0, 0.2)' 
                          : 'rgba(0, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRankIcon(index)}
                        <Chip 
                          label={`#${index + 1}`} 
                          className={index < 3 ? "theme-chip-primary" : "theme-chip"}
                          sx={{ 
                            bgcolor: index === 0 
                              ? 'rgba(255, 215, 0, 0.2)'
                              : index === 1 
                              ? 'rgba(192, 192, 192, 0.2)'
                              : index === 2
                              ? 'rgba(205, 127, 50, 0.2)'
                              : 'rgba(0, 255, 255, 0.2)',
                            borderColor: getRankColor(index),
                            color: getRankColor(index)
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#ff00ff', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                          {user.profile?.level || 1}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#00ffff', fontWeight: 700 }}>
                        {user.profile?.stats?.pointsEarned || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {user.profile?.stats?.tasksCompleted || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {user.profile?.stats?.complaintsSubmitted || 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Leaderboard;

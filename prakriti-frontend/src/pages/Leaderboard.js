import React, { useEffect, useState } from 'react';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress,
  Chip 
} from '@mui/material';

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Complaints</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Chip 
                    label={`#${index + 1}`} 
                    color={index < 3 ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.profile.level}</TableCell>
                <TableCell>{user.profile.stats.pointsEarned}</TableCell>
                <TableCell>{user.profile.stats.tasksCompleted}</TableCell>
                <TableCell>{user.profile.stats.complaintsSubmitted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaderboard;
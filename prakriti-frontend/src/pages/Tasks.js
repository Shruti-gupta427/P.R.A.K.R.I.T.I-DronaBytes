import React, { useEffect, useState } from 'react';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  CircularProgress,
  Chip 
} from '@mui/material';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error('Tasks error:', error);
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
        Available Eco-Tasks
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tasks.length === 0 ? (
          <Typography>No tasks available at the moment.</Typography>
        ) : (
          tasks.map((task) => (
            <Grid item xs={12} md={6} key={task._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{task.title}</Typography>
                    <Chip label={task.category} color="primary" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {task.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Typography variant="body2">
                      Points: <strong>{task.points}</strong>
                    </Typography>
                    <Typography variant="body2">|</Typography>
                    <Typography variant="body2">
                      Difficulty: <strong>{task.difficulty}</strong>
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    href={`/tasks/${task._id}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Tasks;
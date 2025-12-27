import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  CircularProgress,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Star as StarIcon,
  TrendingUp as DifficultyIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import '../styles/theme.css';

const Tasks = () => {
  const navigate = useNavigate();
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return '#00ffff';
      case 'medium':
        return '#ff00ff';
      case 'hard':
        return '#ff0000';
      default:
        return '#00ffff';
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
          <TaskIcon sx={{ fontSize: 60, color: '#00ffff', mb: 2, filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }} />
          <Typography variant="h3" className="theme-title" gutterBottom>
            AVAILABLE ECO-TASKS
          </Typography>
          <Typography variant="h6" className="theme-subtitle">
            COMPLETE TASKS TO EARN POINTS AND LEVEL UP
          </Typography>
        </Paper>
      
        {tasks.length === 0 ? (
          <Paper className="theme-card" sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" className="theme-subtitle" gutterBottom>
              NO TASKS AVAILABLE
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Check back later for new environmental tasks!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} md={6} lg={4} key={task._id}>
                <Card 
                  className="theme-card"
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.02)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" className="theme-subtitle" sx={{ flex: 1 }}>
                        {task.title}
                      </Typography>
                      <Chip 
                        label={task.category} 
                        className="theme-chip"
                        size="small"
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#ccc', 
                        mb: 3,
                        minHeight: '60px',
                        lineHeight: 1.6
                      }}
                    >
                      {task.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ color: '#ff00ff', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          Points: <span style={{ color: '#ff00ff', fontWeight: 700 }}>{task.points}</span>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DifficultyIcon sx={{ color: getDifficultyColor(task.difficulty), fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          Difficulty: <span style={{ color: getDifficultyColor(task.difficulty), fontWeight: 700 }}>
                            {task.difficulty?.toUpperCase() || 'EASY'}
                          </span>
                        </Typography>
                      </Box>

                      {task.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ color: '#00ffff', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#888' }}>
                            {task.location}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Button 
                      className="theme-button"
                      fullWidth
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      sx={{ mt: 'auto' }}
                    >
                      VIEW DETAILS
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Tasks;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  CircularProgress,
  Chip,
  Alert,
  Grid,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/theme.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    description: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userSubmission, setUserSubmission] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await api.get(`/api/tasks/${id}`);
      if (response.data.success) {
        const taskData = response.data.data.task;
        setTask(taskData);
        
        // Check if user has already submitted
        if (user) {
          const userSub = taskData.submissions?.find(
            sub => sub.user?._id === user._id || sub.user?.toString() === user._id
          );
          setUserSubmission(userSub);
        }
      }
    } catch (error) {
      console.error('Task details error:', error);
      setMessage({ type: 'error', text: 'Failed to load task details' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      setMessage({ type: 'error', text: 'Maximum 5 images allowed' });
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSubmissionData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to submit tasks' });
      return;
    }

    if (userSubmission) {
      setMessage({ type: 'error', text: 'You have already submitted this task' });
      return;
    }

    if (submissionData.images.length === 0) {
      setMessage({ type: 'error', text: 'Please upload at least one image' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('description', submissionData.description);
      
      // Append image files
      imagePreviews.forEach((img) => {
        formData.append('images', img.file);
      });

      // Get user location if available
      const getLocation = () => {
        return new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  type: 'Point',
                  coordinates: [position.coords.longitude, position.coords.latitude]
                });
              },
              () => resolve(null)
            );
          } else {
            resolve(null);
          }
        });
      };

      const location = await getLocation();
      if (location) {
        formData.append('location', JSON.stringify(location));
      }

      const response = await api.post(`/api/tasks/${id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Task submitted successfully! Awaiting verification.' });
        setSubmissionData({ description: '', images: [] });
        setImagePreviews([]);
        fetchTaskDetails(); // Refresh to show submission
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit task' 
      });
    } finally {
      setSubmitting(false);
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

  if (!task) {
    return (
      <Box className="theme-background">
        <Box className="theme-animated-bg">
          <Box className="theme-cityscape"></Box>
          <Box className="theme-neon-grid"></Box>
        </Box>
        <Box className="theme-content" sx={{ p: 3 }}>
          <Paper className="theme-card">
            <Typography variant="h6" className="theme-subtitle">
              Task not found
            </Typography>
            <Button onClick={() => navigate('/tasks')} className="theme-button" sx={{ mt: 2 }}>
              Back to Tasks
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  const taskLocation = task.location?.coordinates || [0, 0];

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
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/tasks')}
          sx={{ 
            mb: 3,
            color: '#00ffff',
            '&:hover': { color: '#ff00ff' }
          }}
        >
          Back to Tasks
        </Button>

        <Grid container spacing={3}>
          {/* Task Details */}
          <Grid item xs={12} md={8}>
            <Paper className="theme-card" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TaskIcon sx={{ fontSize: 40, color: '#00ffff' }} />
                <Box flex={1}>
                  <Typography variant="h4" className="theme-title" gutterBottom>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Chip label={task.category} className="theme-chip" />
                    <Chip 
                      label={task.difficulty?.toUpperCase() || 'EASY'} 
                      className="theme-chip-primary"
                    />
                    <Chip 
                      icon={<StarIcon />}
                      label={`${task.points} Points`}
                      sx={{ 
                        bgcolor: 'rgba(255, 0, 255, 0.2)',
                        border: '1px solid rgba(255, 0, 255, 0.5)',
                        color: '#ff00ff'
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: '#ccc', lineHeight: 1.8, mb: 3 }}>
                {task.description}
              </Typography>

              {task.location && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" className="theme-subtitle" gutterBottom>
                    <LocationIcon sx={{ mr: 1 }} />
                    Location
                  </Typography>
                  <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mt: 2 }}>
                    <MapContainer
                      center={[taskLocation[1], taskLocation[0]]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[taskLocation[1], taskLocation[0]]}>
                        <Popup>{task.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </Box>
                </Box>
              )}

              {task.requirements && (
                <Box>
                  <Typography variant="h6" className="theme-subtitle" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Images Required: {task.requirements.images || 1}
                  </Typography>
                  {task.requirements.checklist && task.requirements.checklist.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      {task.requirements.checklist.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                          • {item}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Paper>

            {/* Submission Form */}
            {user && !userSubmission ? (
              <Paper className="theme-card">
                <Typography variant="h5" className="theme-subtitle" gutterBottom>
                  Submit Task Completion
                </Typography>

                {message.text && (
                  <Alert 
                    severity={message.type} 
                    sx={{ 
                      mb: 3,
                      bgcolor: message.type === 'success' 
                        ? 'rgba(0, 255, 0, 0.2)' 
                        : 'rgba(255, 0, 0, 0.2)',
                      border: `1px solid ${message.type === 'success' ? '#00ff00' : '#ff0000'}`,
                      color: message.type === 'success' ? '#00ff00' : '#ff0000'
                    }}
                  >
                    {message.text}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={submissionData.description}
                    onChange={(e) => setSubmissionData({ ...submissionData, description: e.target.value })}
                    className="theme-input"
                    sx={{ mb: 3 }}
                    placeholder="Describe how you completed this task..."
                  />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" className="theme-subtitle" gutterBottom>
                      Upload Images ({imagePreviews.length}/5)
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      sx={{
                        borderColor: '#00ffff',
                        color: '#00ffff',
                        '&:hover': {
                          borderColor: '#ff00ff',
                          color: '#ff00ff'
                        }
                      }}
                    >
                      Upload Images
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {imagePreviews.length > 0 && (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {imagePreviews.map((img, index) => (
                          <Grid item xs={6} sm={4} key={index}>
                            <Card sx={{ position: 'relative' }}>
                              <CardMedia
                                component="img"
                                height="150"
                                image={img.preview}
                                alt={`Preview ${index + 1}`}
                              />
                              <IconButton
                                onClick={() => removeImage(index)}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  bgcolor: 'rgba(255, 0, 0, 0.7)',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.9)' }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    className="theme-button"
                    disabled={submitting}
                    sx={{ py: 1.5 }}
                  >
                    {submitting ? 'SUBMITTING...' : 'SUBMIT TASK'}
                  </Button>
                </Box>
              </Paper>
            ) : userSubmission ? (
              <Paper className="theme-card">
                <Alert severity="info" sx={{ bgcolor: 'rgba(0, 255, 255, 0.2)', color: '#00ffff' }}>
                  <Typography variant="h6" gutterBottom>
                    Submission Status: {userSubmission.status?.toUpperCase() || 'PENDING'}
                  </Typography>
                  {userSubmission.feedback && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Feedback: {userSubmission.feedback}
                    </Typography>
                  )}
                </Alert>
              </Paper>
            ) : (
              <Paper className="theme-card">
                <Alert severity="warning" sx={{ bgcolor: 'rgba(255, 255, 0, 0.2)', color: '#ffff00' }}>
                  Please login to submit this task
                </Alert>
              </Paper>
            )}
          </Grid>

          {/* Sidebar Stats */}
          <Grid item xs={12} md={4}>
            <Paper className="theme-card">
              <Typography variant="h6" className="theme-subtitle" gutterBottom>
                Task Statistics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  Total Submissions: <strong style={{ color: '#00ffff' }}>
                    {task.statistics?.totalSubmissions || 0}
                  </strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  Verified: <strong style={{ color: '#00ff00' }}>
                    {task.statistics?.verifiedSubmissions || 0}
                  </strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Pending: <strong style={{ color: '#ffff00' }}>
                    {task.statistics?.pendingSubmissions || 0}
                  </strong>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TaskDetails;


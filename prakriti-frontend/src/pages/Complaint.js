import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Report as ComplaintIcon,
  Send as SendIcon
} from '@mui/icons-material';
import '../styles/theme.css';

const Complaint = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pollution',
    location: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/api/complaints', formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Complaint submitted successfully!' });
        setFormData({ title: '', description: '', category: 'Pollution', location: '' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit complaint' 
      });
    } finally {
      setLoading(false);
    }
  };

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

      <Box className="theme-content" sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
        <Paper className="theme-card" sx={{ mb: 4, textAlign: 'center' }}>
          <ComplaintIcon sx={{ fontSize: 60, color: '#ff00ff', mb: 2, filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.8))' }} />
          <Typography variant="h3" className="theme-title" gutterBottom>
            SUBMIT ENVIRONMENTAL COMPLAINT
          </Typography>
          <Typography variant="h6" className="theme-subtitle">
            REPORT ISSUES AND MAKE A DIFFERENCE
          </Typography>
        </Paper>

        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ 
              mb: 3,
              bgcolor: message.type === 'success' 
                ? 'rgba(0, 255, 0, 0.2)' 
                : 'rgba(255, 0, 0, 0.2)',
              border: `1px solid ${message.type === 'success' ? '#00ff00' : '#ff0000'}`,
              color: message.type === 'success' ? '#00ff00' : '#ff0000',
              '& .MuiAlert-icon': {
                color: message.type === 'success' ? '#00ff00' : '#ff0000'
              }
            }}
          >
            {message.text}
          </Alert>
        )}

        <Paper className="theme-card">
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Complaint Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="theme-input"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={6}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="theme-input"
              placeholder="Describe the environmental issue in detail..."
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="theme-input"
              sx={{ mb: 2 }}
            >
              <MenuItem value="Pollution" sx={{ bgcolor: 'rgba(10, 10, 20, 0.9)', color: '#fff' }}>
                Pollution
              </MenuItem>
              <MenuItem value="Waste Management" sx={{ bgcolor: 'rgba(10, 10, 20, 0.9)', color: '#fff' }}>
                Waste Management
              </MenuItem>
              <MenuItem value="Water Quality" sx={{ bgcolor: 'rgba(10, 10, 20, 0.9)', color: '#fff' }}>
                Water Quality
              </MenuItem>
              <MenuItem value="Deforestation" sx={{ bgcolor: 'rgba(10, 10, 20, 0.9)', color: '#fff' }}>
                Deforestation
              </MenuItem>
              <MenuItem value="Wildlife" sx={{ bgcolor: 'rgba(10, 10, 20, 0.9)', color: '#fff' }}>
                Wildlife
              </MenuItem>
              <MenuItem value="Other" sx={{ bgcolor: 'rgba(10, 10, 20, 0.9)', color: '#fff' }}>
                Other
              </MenuItem>
            </TextField>
            
            <TextField
              margin="normal"
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
              className="theme-input"
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              className="theme-button"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <SendIcon />}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT COMPLAINT'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Complaint;

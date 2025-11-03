import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/authservices';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Alert 
} from '@mui/material';

const Complaints = () => {
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Submit Environmental Complaint
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mt: 2, mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Complaint Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              SelectProps={{ native: true }}
            >
              <option value="Pollution">Pollution</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Water Quality">Water Quality</option>
              <option value="Deforestation">Deforestation</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Other">Other</option>
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Complaints;
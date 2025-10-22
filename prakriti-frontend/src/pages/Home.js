import React from 'react';
import { Box, Typography, Container } from '@mui/material';
const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to PRAKRITI
        </Typography>
        <Typography variant="h6" color="text.secondary">
          An Innovative Gamified Environmental Learning Platform by **DronaBytes** for Smart India Hackathon 2025
        </Typography>
      </Box>
    </Container>
  );
};
export default Home;


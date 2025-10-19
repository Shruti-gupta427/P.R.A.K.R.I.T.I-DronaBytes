import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Complaints from './pages/Complaints';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green for eco-theme
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6F00', // Orange for accents
      light: '#FF9800',
      dark: '#E65100',
    },
    background: {
      default: '#F1F8E9', // Light green background
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import '../styles/theme.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m EcoBot, your environmental assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Replace with your chatbot API endpoint
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.content })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'I apologize, but I couldn\'t process your question. Please try again.'
      }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please check if the chatbot service is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={() => setIsOpen(true)}
          className="theme-button"
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)'
          }}
        >
          <ChatIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        height: 600,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper
        className="theme-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 0
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" className="theme-subtitle">
            <ChatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            EcoBot
          </Typography>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: '#00ffff' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: msg.role === 'user'
                    ? 'rgba(0, 255, 255, 0.2)'
                    : 'rgba(255, 0, 255, 0.2)',
                  border: `1px solid ${msg.role === 'user' ? '#00ffff' : '#ff00ff'}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  {msg.content}
                </Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ alignSelf: 'flex-start' }}>
              <CircularProgress size={20} sx={{ color: '#00ffff' }} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: '2px solid rgba(0, 255, 255, 0.3)',
            display: 'flex',
            gap: 1
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Ask me about the environment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="theme-input"
            disabled={loading}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="theme-button"
            sx={{ minWidth: 40 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot;


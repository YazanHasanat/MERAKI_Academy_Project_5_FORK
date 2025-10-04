'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Stack, TextField, Typography, Paper } from '@mui/material';

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Form submitted!\n${JSON.stringify(form, null, 2)}`);
  };

  return (
    <Box
      sx={{
        bgcolor: '#f8f9fa',
        minHeight: '100vh',
        py: 6,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Comic Sans MS', cursive",
      }}
    >
      <Container maxWidth="md">
        
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            position: 'relative',
            background: 'linear-gradient(135deg, #a1d4f9 0%, #c7f0f4 100%)',
            borderRadius: 3,
            p: 3,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          
          <img
            src="/assets/kiddyjoy.png"
            alt="Kids playing"
            style={{ maxHeight: 140, objectFit: 'contain' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              minWidth: 280,
              p: 3,
              borderRadius: 3,
              backgroundColor: '#fff',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: '#6a1b9a', textAlign: 'center' }}
            >
              Got Questions? <br /> We’re Here To Help!
            </Typography>

            <Stack spacing={2} sx={{ fontSize: 14 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1380/1380338.png"
                  alt="Chat icon"
                  width={22}
                />
                <Box>
                  <strong>Chat with Us:</strong> Click on the icon below for live support!
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                  alt="Email icon"
                  width={22}
                />
                <Box>
                  <strong>Email Us:</strong> info@kiddyjoy.com
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/483/483947.png"
                  alt="Phone icon"
                  width={22}
                />
                <Box>
                  <strong>Call Us:</strong> 1-800-KID-PLAY (1-800-543-7529)
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              flex: 1,
              minWidth: 280,
              p: 3,
              borderRadius: 3,
              backgroundColor: '#fff',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#1976d2' }}
            >
              Send Us A Message
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Your Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  type="email"
                />
                <TextField
                  label="Order Number (Optional)"
                  name="orderNumber"
                  value={form.orderNumber}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Your Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  size="small"
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#ff6600',
                    color: '#fff',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#e65c00',
                    },
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>

        
        <Box
          mt={4}
          sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}
        >
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              width={30}
              style={{ cursor: 'pointer' }}
            />
          </a>

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              alt="Instagram"
              width={30}
              style={{ cursor: 'pointer' }}
            />
          </a>

          <a href="mailto:info@kiddyjoy.com">
            <img
              src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
              alt="Email"
              width={30}
              style={{ cursor: 'pointer' }}
            />
          </a>
        </Box>
      </Container>
    </Box>
  );
}
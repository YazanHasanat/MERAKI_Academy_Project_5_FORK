'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

// ==== MUI Components ====
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';

// ==== MUI Icons ====
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// ==== TypeScript Interfaces ====
interface FormData {
  name: string;
  email: string;
  orderNumber: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  orderNumber?: string;
  message?: string;
}

interface Notification {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export default function ContactUsPage() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    orderNumber: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    severity: 'success',
  });

  // ==== Form Validation ====
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==== Handle Input Changes ====
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // ==== Handle Form Submit ====
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setNotification({
        open: true,
        message: "Your message has been sent successfully! We'll get back to you soon.",
        severity: 'success',
      });

      setForm({
        name: '',
        email: '',
        orderNumber: '',
        message: '',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Something went wrong. Please try again later.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: "'Poppins', 'Roboto', sans-serif",
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)'
              : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          opacity: 0.1,
          zIndex: -1,
        }}
      />

      {/* Floating Shapes */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            background:
              theme.palette.mode === 'light' ? 'rgba(103, 126, 234, 0.1)' : 'rgba(233, 69, 96, 0.1)',
            animation: 'float 20s infinite ease-in-out',
          },
          '&::before': {
            width: 400,
            height: 400,
            top: '-200px',
            right: '-200px',
            animationDelay: '0s',
          },
          '&::after': {
            width: 300,
            height: 300,
            bottom: '-150px',
            left: '-150px',
            animationDelay: '5s',
          },
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1, minWidth: '100vw' }}>
        {/* Header with image */}
        <Fade in={mounted} timeout={1000}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 2, md: 4 },
              overflow: 'hidden',
              mb: { xs: 4, md: 6 },
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              minHeight: { xs: 200, sm: 280, md: 360 },
              transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'transform 0.8s ease-out',
            }}
          >
            <Box
              component="img"
              src="/assets/kiddyj.png"
              alt="Kids playing"
              sx={{
                width: '100%',
                objectFit: 'contain',
                height: 'auto',
                maxHeight: { xs: 300, sm: 400, md: 500 },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, md: 4 },
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white',
              }}
            >
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="h6">
                We're here to help and answer any questions you might have
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'stretch',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {/* Left Card */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' }, maxWidth: { xs: '100%', md: '600px' } }}>
            <Fade in={mounted} timeout={1200}>
              <Paper
                elevation={8}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: { xs: 2, md: 3 },
                  height: '100%',
                  background: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30,30,30,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  transform: mounted ? 'translateX(0)' : 'translateX(-50px)',
                  transition: 'transform 0.8s ease-out 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Send Us A Message
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      label="Your Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                              <Typography variant="caption" color="white">
                                {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                              </Typography>
                            </Avatar>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Your Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Order Number (Optional)"
                      name="orderNumber"
                      value={form.orderNumber}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="caption" color="text.secondary">
                              #
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
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
                      error={!!errors.message}
                      helperText={errors.message}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                          transform: 'scale(1.02)',
                        },
                        '&:disabled': {
                          background: theme.palette.action.disabled,
                        },
                        fontWeight: 'bold',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Fade>
          </Box>
          {/* Get In Touch - Right Card */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 45%' },
              maxWidth: { xs: '100%', md: '600px' },
            }}
          >
            <Fade in={mounted} timeout={1400}>
              <Paper
                elevation={8}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: { xs: 2, md: 3 },
                  height: '100%',
                  background: theme.palette.mode === 'light' 
                    ? 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)' 
                    : 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(240, 147, 251, 0.3)' : 'rgba(233, 69, 96, 0.3)'}`,
                  transform: mounted ? 'translateX(0)' : 'translateX(50px)',
                  transition: 'transform 0.8s ease-out 0.4s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Get In Touch
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                  We're available 24/7 to answer your questions and help with any issues.
                </Typography>

                <Stack spacing={3}>
                  {[
                    { icon: <ChatIcon />, title: 'Live Chat', desc: 'Chat with our support team', color: 'primary.main' },
                    { icon: <EmailIcon />, title: 'Email Us', desc: 'kiddyjoy@gmail.com', color: 'secondary.main' },
                    { icon: <PhoneIcon />, title: 'Call Us', desc: '1-800-KID-PLAY', color: 'success.main' },
                  ].map((item, index) => (
                    <Fade in={mounted} timeout={1600 + index * 200} key={item.title}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          background: theme.palette.mode === 'light' 
                            ? 'rgba(255, 255, 255, 0.5)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            background: theme.palette.mode === 'light' 
                              ? 'rgba(255, 255, 255, 0.8)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateX(10px)',
                            transition: 'all 0.3s ease',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: item.color,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                  ))}
                </Stack>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
                  Follow Us
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
                  {[
                    { icon: <FacebookIcon />, href: 'https://facebook.com', color: 'primary.main' },
                    { icon: <InstagramIcon />, href: 'https://instagram.com', gradient: true },
                    { icon: <EmailIcon />, href: 'mailto:kiddyjoy@gmail.com', color: 'secondary.main' },
                  ].map((social, index) => (
                    <Fade in={mounted} timeout={2000 + index * 100} key={index}>
                      <IconButton
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: social.gradient 
                            ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
                            : social.color,
                          color: 'white',
                          width: 48,
                          height: 48,
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            transition: 'all 0.3s ease',
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Fade>
                  ))}
                </Box>
              </Paper>
            </Fade>
          </Box>
        </Box>

       {/* Snackbar */}
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }} icon={notification.severity === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>

      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>
    </Box>
  );
}
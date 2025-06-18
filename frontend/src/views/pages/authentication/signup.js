import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('/auth/request-signup', {
        email,
        password,
        gmail_app_password: gmailAppPassword,
      });

      localStorage.setItem(
        'pendingSignup',
        JSON.stringify({
          email,
          password,
          gmail_app_password: gmailAppPassword,
        })
      );

      alert('OTP sent! Please check your email.');
      navigate('/verify-signup');
    } catch (err) {
      alert('Signup failed. Try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #bbdefb, #e3f2fd)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Grid
        container
        sx={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          boxShadow: 4,
          borderRadius: 4,
          overflow: 'hidden',
          minHeight: '80vh',
        }}
      >
        {/* Left: Signup Intro & Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
              mb: 1,
              fontSize: '2.5rem',
            }}
          >
            Join SmartMail.AI
          </Typography>

          <Box
            sx={{
              backgroundColor: '#e3f2fd',
              borderLeft: '5px solid #1976d2',
              px: 2,
              py: 1.5,
              my: 3,
              borderRadius: 1,
              boxShadow: 1,
              maxWidth: '500px',
            }}
          >
            
              <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold', mt: 3, mb: 1 }}>
                Create your account and simplify your email workflow.
              </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 5,
              fontSize: '1.1rem',
              maxWidth: '500px',
            }}
          >
            Get clear insights through charts, organize emails by priority, and
            let AI help you with quick replies. Edit and send directly — all
            from one place.
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ mb: 3, color: '#1976d2', fontSize: '1rem' }}
          >
            Sign up to get started
          </Typography>

          <Stack spacing={3} sx={{ width: '100%', maxWidth: 500 }}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
  fullWidth
  label="Gmail App Password"
  type="password"
  value={gmailAppPassword}
  onChange={(e) => setGmailAppPassword(e.target.value)}
  helperText={
    <span>
      Use a Gmail App Password —{' '}
      <a
        href="https://myaccount.google.com/apppasswords"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline', color: '#1976d2' }}
      >
        Generate here
      </a>
      .
    </span>
  }
/>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSignup}
              disabled={!email || !password || !gmailAppPassword}
              sx={{
                backgroundColor: '#1976d2',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1.4,
                fontSize: '16px',
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Grid>

        {/* Right: Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: '#e3f2fd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Box
            component="img"
            src="https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png"
            alt="Signup Illustration"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;

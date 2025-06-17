import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomPostApi } from 'api';
import {
  Box,
  // Grid,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const VerifySignup = () => {
  const [otp, setOtp] = useState('');
  const [signupData, setSignupData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('pendingSignup');
    if (data) {
      setSignupData(JSON.parse(data));
    } else {
      alert('No signup data found. Please sign up again.');
      navigate('/signup');
    }
  }, [navigate]);

  const handleVerify = async () => {
    try {
      const { error } = await CustomPostApi('/auth/verify-signup', {
        ...signupData,
        otp,
      });

      if (error) {
        alert('Verification failed. Check OTP and try again.');
        return;
      }

      localStorage.removeItem('pendingSignup');
      alert('Verification successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Something went wrong during verification.');
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
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          backgroundColor: '#ffffff',
          boxShadow: 4,
          borderRadius: 4,
          p: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#1976d2',
            fontWeight: 'bold',
            fontSize: '2rem',
            mb: 2,
          }}
        >
          OTP Verification
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          We’ve sent a one-time password to your email. Please enter it below to complete your signup.
        </Typography>

        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerify}
          disabled={!otp}
          sx={{
            backgroundColor: '#1976d2',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.2,
            fontSize: '16px',
          }}
        >
          Verify
        </Button>
      </Box>
    </Box>
  );
};

export default VerifySignup;

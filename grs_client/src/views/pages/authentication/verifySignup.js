import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Paper } from '@mui/material';

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
      const res = await axios.post('/auth/verify-signup', {
        ...signupData,
        otp
      });

      // Success: remove temp data
      localStorage.removeItem('pendingSignup');
      alert('Verification successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      alert('Verification failed. Check OTP and try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" gutterBottom>Verify OTP</Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleVerify}
        disabled={!otp}
      >
        Verify
      </Button>
    </Paper>
  );
};

export default VerifySignup;

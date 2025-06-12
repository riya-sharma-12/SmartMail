import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Paper } from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('/auth/request-signup', {
        email,
        password,
        org_name: orgName,
        gmail_app_password: gmailAppPassword
      });

      localStorage.setItem('pendingSignup', JSON.stringify({
        email,
        password,
        org_name: orgName,
        gmail_app_password: gmailAppPassword
      }));

      alert('OTP sent! Please check your email.');
      navigate('/verify-signup');
    } catch (err) {
      alert('Signup failed. Try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" gutterBottom>Signup</Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Organization Name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        type="password"
        label="Gmail App Password"
        value={gmailAppPassword}
        onChange={(e) => setGmailAppPassword(e.target.value)}
        helperText="Use a Gmail App Password — not your actual password"
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSignup}
        disabled={!email || !password || !orgName || !gmailAppPassword}
      >
        Signup
      </Button>
    </Paper>
  );
};

export default Signup;

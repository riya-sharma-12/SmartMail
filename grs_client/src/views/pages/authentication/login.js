import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Import Link
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password });
       const { token, org_id } = res.data; 
       localStorage.setItem('org_id', org_id); 
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('userAuth', '1');
    //   localStorage.setItem('org_id', org_id);  
      console.log("ORG ID-----------------",org_id);
      await axios.get('http://localhost:5000/api/emails/fetch-emails', {
  headers: {
    Authorization: `Bearer ${token}`,
    org_id: org_id
  }
});

      localStorage.setItem('userAuth', '1');
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth margin="normal" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button fullWidth variant="contained" onClick={handleLogin}>Login</Button>

      {/* ✅ Add this block */}
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Sign up here
        </Link>
      </Typography>
    </Paper>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  // useMediaQuery,
  Stack,
  
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token, org_id } = res.data;
      localStorage.setItem('userEmail', email);
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      await axios.get('http://localhost:5000/api/emails/fetch-emails', {
        headers: {
          Authorization: `Bearer ${token}`,
          org_id: org_id
        }
      });
      localStorage.setItem('userAuth', '1');
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      alert('Login failed. Check your credentials.');
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
        px: 2
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
          minHeight: '80vh'
        }}
      >
    {/* Left: Login Form */}
<Grid item xs={12} md={6} sx={{ p: 6 }}>
  <Typography  sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center' , fontSize: '2.5rem'}}>
    Welcome to <br /> Smart Mail Responder
  </Typography>

  {/* Intro Heading */}
  
  {/* <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold', mt: 3, mb: 1,flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center' , }}>
    Smart Mail Responder helps you stay on top of your emails with ease
  </Typography> */}
  <Box
            sx={{
              backgroundColor: '#e3f2fd',
              borderLeft: '5px solid #1976d2',
              px: 2,
              py: 2.5,
              my: 3,
              borderRadius: 1,
              boxShadow: 1,
              maxWidth: '500px',
            }}
          >
            
              <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold', flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'}}>
    Smart Mail Responder helps you stay on top of your emails with ease
              </Typography>
          </Box>

  {/* Description Text */}
  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, fontSize: '1.1rem' }}>
    It shows you a clear summary of your email activity through simple charts, helps you focus on what matters most by organizing emails by priority, and even suggests smart replies for your important messages. You can review and edit the replies if needed, and send them directly—right from this website.
  </Typography>

  {/* Login Note */}
  <Typography variant="subtitle1" sx={{ mb: 3, color: '#1976d2', fontSize: '1rem' , display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',}}>
    Login to manage and respond to your emails
  </Typography>

  {/* Form fields and button below this */}

          <Stack spacing={3}>
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
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                backgroundColor: '#1976d2',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1.4,
                fontSize: '16px',
              }}
            >
              Login
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" style={{ color: '#1976d2', fontWeight: 500 }}>
                Sign up here
              </Link>
            </Typography>
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
            alt="Login Illustration"
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


export default Login;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   Button,
//   Stack,
//   Fade,
// } from '@mui/material';

// const AppleStyledLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [show, setShow] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post('/auth/login', { email, password });
//       const { token, org_id } = res.data;
//       localStorage.setItem('userEmail', email);
//       localStorage.setItem('token', token);
//       localStorage.setItem('authToken', token);
//       await axios.get('http://localhost:5000/api/emails/fetch-emails', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           org_id: org_id
//         }
//       });
//       localStorage.setItem('userAuth', '1');
//       navigate('/dashboard');
//       window.location.reload();
//     } catch (err) {
//       alert('Login failed. Check your credentials.');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         fontFamily: 'SF Pro Display, Roboto, sans-serif',
//         backgroundColor: '#f5f5f7',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         px: 2,
//       }}
//       onLoad={() => setShow(true)}
//     >
//       <Fade in={show} timeout={1000}>
//         <Grid container spacing={4} sx={{ maxWidth: '1200px' }}>
//           {/* Left Column */}
//           <Grid item xs={12} md={6}>
//             <Box sx={{ maxWidth: 520 }}>
//               <Typography
//                 variant="h2"
//                 sx={{
//                   fontWeight: 700,
//                   mb: 2,
//                   lineHeight: 1.1,
//                   fontSize: { xs: '5rem', md: '5rem' },
//                   letterSpacing: '-0.02em',
//                 }}
//               >
//                 SmartMail.AI
//               </Typography>

//               <Typography
//                 variant="h6"
//                 sx={{
//                   color: '#5f6368',
//                   mb: 2,
//                   fontWeight: 500,
//                   fontSize: { xs: '1.3rem', md: '1.3rem' },
//                 }}
//               >
//                 {/* It shows you a clear summary of your email activity through simple charts, helps you focus on what matters most by organizing emails by priority, and even suggests smart replies for your important messages. You can review and edit the replies if needed, and send them directly—right from this website.  */}
//               SmartMail.AI organizes your emails by priority, shows a clear activity summary with simple charts, and suggests smart replies you can review and send — all in one place.
//               </Typography>
//               <br></br>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   color: '#5f6368',
//                   mb: 5,
//                   fontWeight: 500,
//                   fontSize: { xs: '1.3rem', md: '1.3rem' },
//                    display: 'flex',
//       justifyContent: 'center', alignItems: 'center'}}
//               >
//                 Login to manage and respond to your emails
//               </Typography>

//               <Stack spacing={3}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   variant="outlined"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   sx={{
//                     backgroundColor: '#fff',
//                     borderRadius: '12px',
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '12px',
//                       fontSize: '1rem',
//                     },
//                   }}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   variant="outlined"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   sx={{
//                     backgroundColor: '#fff',
//                     borderRadius: '12px',
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '12px',
//                       fontSize: '1rem',
//                     },
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleLogin}
//                   sx={{
//                     backgroundColor: '#1a73e8',
//                     fontWeight: 'bold',
//                     textTransform: 'none',
//                     py: 1.4,
//                     fontSize: '16px',
//                     borderRadius: '12px',
//                     '&:hover': {
//                       backgroundColor: '#1669c1',
//                     },
//                   }}
//                 >
//                   Login
//                 </Button>
//               </Stack>
//             </Box>
//           </Grid>

//           {/* Right Column */}
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Box
//               component="img"
//               src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
//               alt="SmartMail Preview"
//               sx={{ width: '100%', maxWidth: 550 }}
//             />
//           </Grid>
//         </Grid>
//       </Fade>
//     </Box>
//   );
// };

// export default AppleStyledLogin;
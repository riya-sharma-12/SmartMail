import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { CustomGetApi, CustomPostApi } from 'api';
import { encryptValue } from 'utils/commonFunctions';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress
} from '@mui/material';



const RegisterNewUser = () => {
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [userLevels, setUserlevels] = useState([]);
  const [userDepts, setUserDepts] = useState([]);
  const [userData, setUserData] = useState({
    user_name: '',
    user_id: '',
    password: '',
    user_level: '',
    user_dept: '',
  });


  const steps = ['User Details', 'Review & Submit'];

  // Fetch user departments from the database
  useEffect(() => {
    // Fetch user departments and set them in state
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoadingOverlay(true);
      if (!userData.user_id) { return toast.error('Enter a Valid User Id!') }
      if (userData.password.length < 8 || userData.password.length > 16) { return toast.error('Password length can not we less then 8 or greater than 16!') }
      const encryptedEmail = encryptValue(userData.user_id);
      const encryptedPassword = encryptValue(userData.password);
      const apiData = {
        user_name: userData.user_name,
        user_id: encryptedEmail,
        password: encryptedPassword,
        user_level: userData.user_level,
        user_dept: userData.user_dept,
      };
      if (!userData.user_name || !userData.user_level || !userData.user_dept) { return toast.error('Please Filled Out all the Fields Correctly.') }
      const { data, error } = await CustomPostApi('carasuperadmin/registerNewuser', apiData);
      //console.log("data-->", data)
      if (!data) {
        toast.error(`Failed!, error -- ${error}`);
      } else {
        toast.success(`Success!, ${data?.msg}`);
        setActiveStep(0)
        setUserData({
          user_name: '',
          user_id: '',
          password: '',
          user_level: '',
          user_dept: '',
        })
      }
    } catch (err) {
      toast.error(`Failed!, error -- ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  };


  // fetch all user-levels
  const getAllUserLevels = async () => {
    try {
      setLoadingOverlay(true);

      const { data, error } = await CustomGetApi('caraadmin/getAllUserLevels');
      //console.log(data, error);
      if (!data) {
        toast.error(`Failed!, ${error}`)
      }
      else {
        const { userLevels } = data;
        toast.success('Users-Levels Fetched Successfully.');
        setUserlevels(userLevels);
      }
    } catch (err) {
      toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  };

  // fetch all user-depts
  const getAllCaraDepts = async () => {
    try {
      setLoadingOverlay(true);
      const { data, error } = await CustomGetApi('caraadmin/getAllCaraDepts');
      //console.log(data, error);
      if (!data) {
        toast.error(`Failed!, ${error}`)
      }
      else {
        const { allCaraDepts } = data;
        toast.success('All  Departments Fetched Successfully.');
        setUserDepts(allCaraDepts);
      }
    } catch (err) {
      toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  };


  useEffect(() => {
    getAllUserLevels();
    getAllCaraDepts()
  }, [])


  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* User details form fields */}
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <TextField
                name="user_name"
                label="User Name"
                fullWidth
                value={userData.user_name}
                onChange={handleChange}
              />
            </Grid>
            {/* User details form fields */}
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <TextField
                name="user_id"
                label="User Id"
                fullWidth
                type='email'
                value={userData.user_id}
                onChange={handleChange}
              />
            </Grid>
            {/* User details form fields */}
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <TextField
                name="password"
                label="User Password"
                fullWidth
                value={userData.password}
                onChange={handleChange}
              />
            </Grid>
            {/* Other user details fields */}
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {/* User level dropdown */}
              <FormControl fullWidth>
                <InputLabel id="user-dept-label">User Level</InputLabel>
                <Select
                  labelId="user-level-label"
                  name="user_level"
                  value={userData.user_level}
                  onChange={handleChange}
                >
                  {/* Populate user levels */}
                  {userLevels.map((item, ind) => (
                    <MenuItem key={ind} value={item.level_id}>{item.level_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {/* User department dropdown */}
              <FormControl fullWidth>
                <InputLabel id="user-dept-label">User Department</InputLabel>
                <Select
                  labelId="user-dept-label"
                  name="user_dept"
                  value={userData.user_dept}
                  onChange={handleChange}
                >
                  {/* Populate user departments */}
                  {userDepts.map((item, ind) => (
                    <MenuItem key={ind} value={item.dept_id}>{item.dept_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <div>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loadingOverlay}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            {/* Review user details */}
            <Typography variant="h6">Review User Details</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>User Name: </strong>{userData.user_name}</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>User Id: </strong>{userData.user_id}</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>User Password: </strong>{userData.password}</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              <strong>User Level:</strong>{' '}
              {userLevels.find((level) => level.level_id === userData.user_level)?.level_name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              <strong>User Department:</strong>{' '}
              {userDepts.find((dept) => dept.dept_id === userData.user_dept)?.dept_name}
            </Typography>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingOverlay}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid item xs={12}>
        <Grid container style={{
          display: 'flex',
          justifyContent: 'center',
          marginBlock: '10px',
        }}>
          <Typography variant="h2">
            <u>Register New Usessr</u>
          </Typography>
        </Grid>
      </Grid>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography variant="h5">Thank you for your submission!</Typography>
            </div>
          ) : (
            <div>
              <div>{getStepContent(activeStep)}</div>
              <div style={{ marginTop: '20px' }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default RegisterNewUser;

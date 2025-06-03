import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { CustomGetApi, CustomPostApi } from 'api';
//import { encryptValue } from 'utils/commonFunctions';
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
    CircularProgress,
    FormControlLabel,
    FormLabel, RadioGroup, Radio
} from '@mui/material';



const RegisterGrievance = () => {
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [allStates, setAllStates] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [grievanceData, setGrievanceData] = useState({
        grievance_type: 1,
        grievance_subject_id: '',
        // grievance_dept_code: '',
        applicant_gender: null,
        applicant_district_code: null,
        applicant_state_code: '',
        //applicant_country_code: '',
        grievance_category: 1,
        grievance_mail_subject: '',
        applicant_email_id: '',
        grievance_mail_body: '',
        applicant_regno: '',
        applicant_name: '',
        internal_remark: '',
        grievance_from: null
    });


    const steps = ['Grievance Details', 'Review & Submit'];

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
        setGrievanceData({ ...grievanceData, [e.target.name]: e.target.value });
    };
    const handleGrievanceCateChange = (e) => {
        handleChange(e);
        const value = e.target.value;
        const category = value == 1 ? "A" : value == 2 ? "I" : "A"
        getAllGrievanceSubj(category)
    }
    const handleStateChange = (e) => {
        handleChange(e);
        const value = e.target.value;
        getAllDistrictsOfState(value);
    }
    const handleSubmit = async () => {
        try {
            setLoadingOverlay(true);
            let currentEmail = grievanceData.applicant_email_id.split(',').filter((e) => e && e.trim());
            let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
            if (!regex.test(currentEmail)) { return toast.error('Enter a Valid Email Id!') }
            if (!grievanceData.grievance_mail_subject) { return toast.error('Enter a Valid Mail Subject!') }
            if (!grievanceData.grievance_subject_id) { return toast.error('Select a Valid Grievance Subject!') }
            //if (!grievanceData.applicant_email_id) { return toast.error('Enter a Valid Email Id!') }
            //const encryptedEmail = encryptValue(grievanceData.user_id);
            //const encryptedPassword = encryptValue(grievanceData.password);
            const apiData = grievanceData;
            //if (!grievanceData.user_name || !grievanceData.user_level || !grievanceData.user_dept) { return toast.error('Please Filled Out all the Fields Correctly.') }
            const { data, error } = await CustomPostApi('caraadmin/registerNewGrievance', apiData);
            //console.log("data-->", data)
            if (!data) {
                toast.error(`Failed!, error -- ${error}`);
            } else {
                toast.success(`Success!, ${data?.msg}`);
                setActiveStep(0)
                setGrievanceData({
                    grievance_type: 1,
                    grievance_subject_id: '',
                    // grievance_dept_code: '',
                    applicant_gender: null,
                    applicant_district_code: null,
                    applicant_state_code: '',
                    //applicant_country_code: '',
                    grievance_category: 1,
                    grievance_mail_subject: '',
                    applicant_email_id: '',
                    grievance_mail_body: '',
                    applicant_regno: '',
                    applicant_name: '',
                    internal_remark: '',
                    grievance_from: null
                })
            }
        } catch (err) {
            toast.error(`Failed!, error -- ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    };

    // fetch all states
    const getAllStates = async () => {
        try {
            setLoadingOverlay(true);
            const { data, error } = await CustomGetApi('carausers/getAllStates');
            //console.log(data, error);
            if (!data) {
                toast.error(`Failed!, ${error}`)
            }
            else {
                const { allStates } = data;
                toast.success('States Fetched Successfully.');
                setAllStates(allStates);
            }
            //console.log("all-states", allStates);
        } catch (err) {
            //console.log("catch error getAllComplainsQuery", err)
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    };

    // fetch all districts
    const getAllDistrictsOfState = async (state_lgd_code) => {
        try {
            setLoadingOverlay(true);
            const apiData = { state_lgd_code: state_lgd_code };
            const { data, error } = await CustomPostApi('carausers/getAllDistrictsOfState', apiData);
            if (!data) {
                toast.error(`Failed!, ${error}`)
            }
            else {
                const { allDistricts } = data;
                toast.success('Districts Fetched Successfully.');
                setAllDistricts(allDistricts);
            }
        } catch (err) {
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    };

    // fetch all subjects
    const getAllGrievanceSubj = async (category) => {
        try {
            setLoadingOverlay(true);
            const apiData = { subject_category: category };
            const { data, error } = await CustomPostApi('carausers/getAllGrievanceSubj', apiData);
            //console.log(data, error);
            if (!data) {
                toast.error(`Failed!, ${error}`)
            }
            else {
                const { allGrivSubj } = data;
                toast.success('Subjects Fetched Successfully.');
                setAllSubjects(allGrivSubj);
            }
            //console.log("allSubjects", allSubjects);
        } catch (err) {
            //console.log("catch error getAllComplainsQuery", err)
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    };


    useEffect(() => {
        getAllStates();
        getAllGrievanceSubj("A");
    }, [])


    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        {/* User details form fields */}
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <TextField
                                name="applicant_name"
                                label="User Name"
                                fullWidth
                                value={grievanceData.applicant_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        {/* User details form fields */}
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <TextField
                                name="applicant_email_id"
                                label="User Mail Id"
                                fullWidth
                                type='email'
                                value={grievanceData.applicant_email_id}
                                onChange={handleChange}
                            />
                        </Grid>
                        {/* User details form fields */}
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <TextField
                                name="grievance_mail_subject"
                                label="User Mail Subject"
                                fullWidth
                                value={grievanceData.grievance_mail_subject}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <TextField
                                name="applicant_regno"
                                label="User Caring RegNo"
                                fullWidth
                                value={grievanceData.applicant_regno}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Grievance Category</FormLabel>
                                <RadioGroup
                                    aria-label="Grievance Category"
                                    name="grievance_category"
                                    value={grievanceData.grievance_category}
                                    onChange={handleGrievanceCateChange}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Program Devision" />
                                    <FormControlLabel value={2} control={<Radio />} label="IT" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Grievance Type</FormLabel>
                                <RadioGroup
                                    aria-label="Grievance Type"
                                    name="grievance_type"
                                    value={grievanceData.grievance_type}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Query" />
                                    <FormControlLabel value={2} control={<Radio />} label="Complain" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {/* Other user details fields */}
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            {/* User level dropdown */}
                            <FormControl fullWidth>
                                <InputLabel id="user-dept-label">Grievance Subject</InputLabel>
                                <Select
                                    labelId="grievance_subject_id"
                                    name="grievance_subject_id"
                                    value={grievanceData.grievance_subject_id}
                                    onChange={handleChange}
                                >
                                    {allSubjects.map((item, ind) => (
                                        <MenuItem key={ind} value={item.subject_id}>{item.subject_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            {/* User department dropdown */}
                            <FormControl fullWidth>
                                <InputLabel id="user-dept-label">Grievance From</InputLabel>
                                <Select
                                    labelId="grievance_from"
                                    name="grievance_from"
                                    value={grievanceData.grievance_from}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Domestic Parents</MenuItem>
                                    <MenuItem value={2}>Inter-Country Parents</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            {/* User level dropdown */}
                            <FormControl fullWidth>
                                <InputLabel id="user-dept-label">States</InputLabel>
                                <Select
                                    labelId="applicant_state_code"
                                    name="applicant_state_code"
                                    value={grievanceData.applicant_state_code}
                                    onChange={handleStateChange}
                                >
                                    {allStates.map((item, ind) => (
                                        <MenuItem key={ind} value={item.lgd_code}>{item.state_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            {/* User level dropdown */}
                            <FormControl fullWidth>
                                <InputLabel id="user-dept-label">Districts</InputLabel>
                                <Select
                                    labelId="applicant_district_code"
                                    name="applicant_district_code"
                                    value={grievanceData.applicant_district_code}
                                    onChange={handleChange}
                                >
                                    {allDistricts.map((item, ind) => (
                                        <MenuItem key={ind} value={item.district_lgd_code}>{item.district_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <TextField
                                name="internal_remark"
                                label="Internal Remark"
                                fullWidth
                                multiline
                                rows={4}
                                value={grievanceData.internal_remark}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    aria-label="Gender"
                                    name="applicant_gender"
                                    value={grievanceData.applicant_gender}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Male" />
                                    <FormControlLabel value={2} control={<Radio />} label="Female" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item lg={8} md={8} sm={12} xs={12}>
                            <TextField
                                name="grievance_mail_body"
                                label="Grievance Mail Body"
                                fullWidth
                                multiline
                                rows={8}
                                value={grievanceData.grievance_mail_body}
                                onChange={handleChange}
                            />
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
                        <Typography variant="h6">Review Grievance Details</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Applicant Name: </strong>{grievanceData.applicant_name}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Applicant Email Id: </strong>{grievanceData.applicant_email_id}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Grievance Mail Subject: </strong>{grievanceData.grievance_mail_subject}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Applicant RegNo: </strong>{grievanceData.applicant_regno}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Grievance Mail Body: </strong>{grievanceData.grievance_mail_body}</Typography>
                        {/* <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            <strong>User Level:</strong>{' '}
                            {userLevels.find((level) => level.level_id === grievanceData.user_level)?.level_name}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            <strong>User Department:</strong>{' '}
                            {userDepts.find((dept) => dept.dept_id === grievanceData.user_dept)?.dept_name}
                        </Typography> */}
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
                        <u>Register New Grievance</u>
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

export default RegisterGrievance;

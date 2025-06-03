import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CustomPostApi } from 'api';
import {
    Container,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Button,
    Grid,
    Paper,
    Typography,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    FormHelperText
} from '@mui/material';



const steps = ['Carings Info', 'Personal Details', 'Grievance Information', 'Review and Submit'];

const IT_ComplainForm = ({ grievanceSubjects, setLoadingOverlay }) => {
    const [activeStep, setActiveStep] = useState(0);
    const initialFormData = {
        grievance_from: '',
        regOncarings: '',
        caringsRegId: '',
        fullName: '',
        mobileNo: '',
        email: '',
        grievanceSubject: '',
        grievanceDesc: '',
        uploadFile: '',
        uploadFileValue: '',
    }
    const [formData, setFormData] = useState(initialFormData);
    const [uploadDocError, setUploadDocerror] = useState(null);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegITComplain = async () => {
        //console.log("submitted");
        try {
            setLoadingOverlay(true);
            let apiFormData = new FormData();
            apiFormData.append("applicant_type", formData.grievance_from)
            apiFormData.append("applicant_reg_on_carings", formData.regOncarings)
            const regOncarings = formData.regOncarings == "1" ? formData.caringsRegId : "NA";
            apiFormData.append("applicant_regno", regOncarings)
            apiFormData.append("applicant_name", formData.fullName)
            apiFormData.append("applicant_gender", "NA")
            apiFormData.append("applicant_email_id", formData.email)
            apiFormData.append("applicant_phone_no", formData.mobileNo)
            apiFormData.append("applicant_address", "NA")
            apiFormData.append("applicant_district_code", "NA")
            apiFormData.append("applicant_state_code", "NA")
            apiFormData.append("applicant_country_code", "NA")
            apiFormData.append("grievance_category", "1")
            apiFormData.append("grievance_type", "1")
            apiFormData.append("grievance_subject_id", formData.grievanceSubject)
            apiFormData.append("grievance_against_type", "0")
            apiFormData.append("grievance_against_code", "NA")
            apiFormData.append("grievance", formData.grievanceDesc)
            apiFormData.append("upload_file", formData.uploadFile)
            ////console.log(formData, apiData);
            const { data, error } = await CustomPostApi('grievance/registergrievance', apiFormData, 'multipart/form-data');
            if (!data) {
                //console.log("err", error)
                toast.error(`Failed!, ${error}`);
            } else {
                setLoadingOverlay(false);
                const tokenNO = data.data?.grievanceTokenNo;
                toast.success(`Your Complain Is Successfully Registered with us with a token no -- ${tokenNO}, we will get back to you ASAP.`);
            }
        } catch (err) {
            //console.log("catch err", err);
        } finally {
            setLoadingOverlay(false);
            setFormData(initialFormData);
            setActiveStep(0);
        }
    };
    // const handleVerify = () => {
    //     // Add logic for verifying registration number
    //     //console.log('Verifying registration number:', formData.caringsRegId);
    // };
    const verifyGrievancerIdentification = async () => {
        try {
            setLoadingOverlay(true);
            if (formData.regOncarings !== "1") {
                return toast.error('You Select you are not Regestered on Carings');
            }
            if (!formData.grievance_from) {
                return toast.error('First Select an Grievance From');
            }
            if (!formData.caringsRegId) {
                return toast.error("You Didn't Entered Your Login-Id Yet.");
            }
            const apiData = {
                grievance_from: formData.grievance_from,
                caringsRegId: formData.caringsRegId
            };
            const { data, error } = await CustomPostApi('grievance/verifyGrievancerIdentification', apiData);
            if (!data) {
                toast.error(`Failed!, ${error}`);
            } else {
                setLoadingOverlay(false);
                toast.success(`Success!, ${data?.msg}`);
                const grievancerDetail = data?.data.grievancerDetail;
                //console.log("data", grievancerDetail);
                setFormData({
                    ...formData,
                    fullName: grievancerDetail.name,
                    mobileNo: grievancerDetail.phone_no,
                    email: grievancerDetail.email_id,
                });
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } catch (err) {
            //console.log("catch err", err);
        } finally {
            setLoadingOverlay(false);
        }
    }
    const handleChangeUploadDoc = (event) => {
        const file = event.target.files[0];
        // Validate file format and size
        if (!file.type.match('application/pdf')) {
            setUploadDocerror('Please select a PDF file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5 MB limit
            setUploadDocerror('File size cannot exceed 5MB.');
            return;
        }
        setFormData({ ...formData, uploadFileValue: event.target.value, uploadFile: file });
        setUploadDocerror(null); // Clear any previous errors
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Have a CARINGS Registration?</FormLabel>
                                <RadioGroup
                                    aria-label="caringsRegistration"
                                    name="regOncarings"
                                    value={formData.regOncarings}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="0" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {formData.regOncarings === '1' && (
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">Grievance From</InputLabel>
                                    <Select
                                        labelId="Grievance-Subject"
                                        name="grievance_from"
                                        value={formData.grievance_from}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="0">Domestic Parents</MenuItem>
                                        <MenuItem value="1">Inter-Country Parents</MenuItem>
                                        <MenuItem value="2">DCPU</MenuItem>
                                        <MenuItem value="3">SARA</MenuItem>
                                        <MenuItem value="4">AFAA</MenuItem>
                                        <MenuItem value="5">SAA</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {
                            formData.regOncarings === '1' && (
                                <Grid item lg={8} md={12} sm={12} xs={12}>
                                    <TextField
                                        name="caringsRegId"
                                        label="CARINGS LOGIN ID"
                                        fullWidth
                                        value={formData.caringsRegId}
                                        onChange={handleChange}
                                    />
                                    <Button variant="contained" color="primary"
                                        style={{ marginTop: '10px' }}
                                        onClick={verifyGrievancerIdentification}>
                                        Verify
                                    </Button>
                                </Grid>
                            )
                        }
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="fullName"
                                label="Full Name"
                                fullWidth
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="mobileNo"
                                label="Mobile No."
                                fullWidth
                                value={formData.mobileNo}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="email"
                                label="Email ID"
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="country-label">Grievance Subjects</InputLabel>
                                <Select
                                    labelId="Grievance-Subject"
                                    name="grievanceSubject"
                                    value={formData.grievanceSubject}
                                    onChange={handleChange}
                                >
                                    {grievanceSubjects.map((item, key) => (
                                        <MenuItem key={key} value={item.subject_id}>{item.subject_name}</MenuItem>
                                    ))};
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="grievanceDesc"
                                label="Grievance Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.grievanceDesc}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload File
                                <input
                                    name="uploadFile"
                                    label="uploadFile"
                                    value={formData.uploadFileValue}
                                    onChange={handleChangeUploadDoc}
                                    type="file"
                                />
                            </Button>
                            {uploadDocError && (
                                <FormHelperText error>{uploadDocError}</FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography variant="h3" sx={{ marginBottom: 2 }}>
                                Review and Submit
                            </Typography>
                            <Typography key={0} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>Name: </strong> {formData.fullName}
                            </Typography>
                            <Typography key={1} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>Phone: </strong> {formData.mobileNo}
                            </Typography>
                            <Typography key={2} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>Email: </strong> {formData.email}
                            </Typography>
                            <Typography key={3} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>Grievance Subject: </strong> {grievanceSubjects.length > 0 ? grievanceSubjects.reduce((acc, curr) => {
                                    //console.log(acc,"acc");
                                    if (curr.subject_id === formData.grievanceSubject) acc = curr.subject_name;
                                    return acc?.subject_name;
                                }) : ""}
                            </Typography>
                            <Typography key={4} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>Grievance Remark: </strong> {formData.grievanceDesc}
                            </Typography>
                        </motion.div>
                    </div>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container>
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
                                {activeStep === steps.length - 1 ?
                                    <Button variant="contained" color="primary" onClick={handleRegITComplain}>
                                        Submit
                                    </Button> : <Button variant="contained" color="primary" onClick={handleNext}>
                                        Next
                                    </Button>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Paper>
        </Container>
    );
};


export default IT_ComplainForm

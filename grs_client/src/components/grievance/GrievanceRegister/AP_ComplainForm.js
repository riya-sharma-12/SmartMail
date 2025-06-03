import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CustomPostApi, CustomGetApi } from 'api';
import {
    Container, Stepper, Step, StepLabel, TextField, Select, MenuItem, InputLabel, Button, Grid, Paper,
    Typography, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, FormHelperText, Link, Backdrop, CircularProgress
} from '@mui/material';
//import { handleChangeUploadDoc } from 'utils/commonFunctions';


//const steps = ['Grievance From', 'Personal & Grievance Details', 'Grievance Against', 'Review & Submit'];
const steps = ['Grievance Details', 'Review & Submit'];

const AP_ComplainForm = ({ grievanceSubjects, countrys, states, getAllDistrictOfState, districts, getAllAgencyOfDistrict, agencys }) => {
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [dataUpdated, isDataUpdated] = useState(false);
    const [allStates, setAllStates] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const queryParameters = new URLSearchParams(window.location.search)
    const tokenNo = queryParameters.get("tokenNo");
    //console.log(tokenNo)
    const initialFormData = {
        grievance_from: '',
        regOncarings: '',
        caringsRegId: '',
        name: '',
        phone: '',
        applicant_email_id: '',
        gender: '',
        country: '',
        state: '',
        district: '',
        address: '',
        grievance_remark: '',
        uploadFile: '',
        uploadFileValue: '',
        grievance_subject: '',
        grievance_against: '',
        applicant_state_code: '',
        agency_district: '',
        agency_regNo: '',
        grievance_mail_body: '',
        grievance_mail_subject: '',
        grievance_category: '',
        grievance_type: ''

    }
    const [formData, setFormData] = useState(initialFormData);
    const [uploadDocError, setUploadDocerror] = useState(null);
    //console.log(setUploadDocerror)
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // fetch all states
    const getAllStates = async () => {
        try {
            setLoadingOverlay(true);
            const { data, error } = await CustomGetApi('/emails/fetch-emails');
            //console.log(data, error);
            if (!data) {
                toast.error(`Failed!, ${error}`)
            }
            else {
                const { allStates } = data;
                toast.success('All Complains Fetched Successfully.');
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

    // fetch all subjects
    const getAllSubjects = async () => {
        try {
            setLoadingOverlay(true);
            const apiData = {};
            const { data, error } = await CustomPostApi('/emails/fetch-emails', apiData);
            //console.log(data, error);
            if (!data) {
                toast.error(`Failed!, ${error}`)
            }
            else {
                const { allGrivSubj } = data;
                toast.success('All Complains Fetched Successfully.');
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

    // fetch grievance details
    const getGrievanceData = async () => {
        try {
            setLoadingOverlay(true);
            const apiData = {
                email_token: tokenNo
            };
            const { data, error } = await CustomPostApi('superadmin/getGrievanceData', apiData);
            if (!data) {
                //console.log(error);
                toast.error(`Failed!, Records Not Found.`);
            } else {
                const { getGrievanceData } = data
                toast.success(`Success!, ${data?.msg}`);
                //console.log(data);
                setFormData({
                    ...formData,
                    name: getGrievanceData.applicant_name,
                    applicant_email_id: getGrievanceData.applicant_email_id,
                    grievance_mail_body: getGrievanceData.grievance_mail_body,
                    gender: getGrievanceData.applicant_gender,
                    grievance_mail_subject: getGrievanceData.grievance_mail_subject,
                    grievance_category: getGrievanceData.grievance_category,
                    grievance_type: getGrievanceData.grievance_type,
                    applicant_state_code: getGrievanceData.applicant_state_code
                });
            }
        } catch (err) {
            //console.log("catch err", err);
        } finally {
            setLoadingOverlay(false);
        }
    };

    // update grievance data
    const updateGrievanceData = async () => {
        try {
            setLoadingOverlay(true);
            //console.log("inside updateGrievanceData")
            const apiData = {
                email_token: tokenNo,
                applicant_state_code: formData.applicant_state_code,
                grievance_category: formData.grievance_category,
                grievance_type: formData.grievance_type,
                gender: formData.gender,
            };
            const { data, error } = await CustomPostApi('superadmin/updateGrievanceData', apiData);
            //console.log("data-->", data)
            if (!data) {
                //console.log("error in updation", error);
                toast.error(`Failed!, Records Not Found.`);
            } else {
                toast.success(`Success!, ${data?.msg}`);
                //console.log(data);
                isDataUpdated(!dataUpdated)
                setActiveStep(0)
            }
        } catch (err) {
            //console.log("catch err", err);
        } finally {
            setLoadingOverlay(false);
        }
    };

    const verifyRegisterParentIndentification = async () => {
        try {
            setLoadingOverlay(true);
            if (formData.regOncarings !== "1") {
                return toast.error('You Select you are not Regestered on Carings');
            }
            if (!formData.grievance_from) {
                return toast.error('First Select an Grievance From');
            }
            if (!formData.caringsRegId) {
                return toast.error("You Didn't Entered Your Registraction-Id Yet.");
            }
            const apiData = {
                grievance_from: formData.grievance_from,
                caringsRegId: formData.caringsRegId
            };
            const { data, error } = await CustomPostApi('grievance/verifyGrievancerIdentification', apiData);
            if (!data) {
                //console.log(error);
                toast.error(`Failed!, Records Not Found.`);
            } else {
                setLoadingOverlay(false);
                toast.success(`Success!, ${data?.msg}`);
                const grievancerDetail = data?.data.grievancerDetail;
                //console.log("data", grievancerDetail);
                if (grievancerDetail?.state_code) { await getAllDistrictOfState(grievancerDetail.state_code) }
                setFormData({
                    ...formData,
                    name: grievancerDetail.name,
                    phone: grievancerDetail.phone_no,
                    applicant_email_id: grievancerDetail.applicant_email_id,
                    gender: grievancerDetail.gender ? grievancerDetail.gender.toString() : "",
                    state: grievancerDetail.state_code ? grievancerDetail.state_code.toString() : "",
                    district: grievancerDetail.district_code ? grievancerDetail.district_code.toString() : "",
                    address: grievancerDetail.address || 'NA',
                });
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } catch (err) {
            //console.log("catch err", err);
        } finally {
            setLoadingOverlay(false);
        }
    };

    // const handleRegAPComplain = async () => {
    //     try {
    //         setLoadingOverlay(true);
    //         let apiFormData = new FormData();
    //         apiFormData.append("applicant_type", formData.grievance_from)
    //         apiFormData.append("applicant_reg_on_carings", formData.regOncarings)
    //         apiFormData.append("applicant_regno", formData.regOncarings == "1" ? formData.caringsRegId : "NA")
    //         apiFormData.append("applicant_name", formData.name)
    //         apiFormData.append("applicant_gender", formData.gender == 0 ? "M" : formData.gender == 1 ? "F" : "O")
    //         apiFormData.append("applicant_email_id", formData.applicant_email_id)
    //         apiFormData.append("applicant_phone_no", formData.phone)
    //         apiFormData.append("applicant_address", formData.address)
    //         apiFormData.append("applicant_district_code", formData.district)
    //         apiFormData.append("applicant_state_code", formData.state)
    //         apiFormData.append("applicant_country_code", formData.country)
    //         apiFormData.append("grievance_category", "0")
    //         apiFormData.append("grievance_type", "1")
    //         apiFormData.append("grievance_subject_id", formData.grievance_subject)
    //         apiFormData.append("grievance_against_type", formData.grievance_against)
    //         apiFormData.append("grievance_against_code", formData.agency_regNo ? formData.agency_regNo : "NA")
    //         apiFormData.append("grievance", formData.grievance_remark)
    //         apiFormData.append("upload_file", formData.uploadFile)
    //         const { data, error } = await CustomPostApi('grievance/registergrievance', apiFormData, 'multipart/form-data');
    //         if (!data) {
    //             //console.log("err", error)
    //             toast.error(`Failed!, ${error}`);
    //         } else {
    //             setLoadingOverlay(false);
    //             const tokenNO = data.data?.grievanceTokenNo;
    //             toast.success(`Your Query Is Successfully Registered with us with a token no -- ${tokenNO}, we will get back to you ASAP.`);
    //         }
    //     } catch (err) {
    //         //console.log("catch err", err);
    //     } finally {
    //         setLoadingOverlay(false);
    //         //setFormData(initialFormData);
    //         //setActiveStep(0);
    //     }
    // };




    // const handleChangeUploadDoc = (event) => {
    //     const file = event.target.files[0];
    //     // Validate file format and size
    //     if (!file.type.match('application/pdf')) {
    //         setUploadDocerror('Please select a PDF file.');
    //         return;
    //     }
    //     if (file.size > 5 * 1024 * 1024) { // 5 MB limit
    //         setUploadDocerror('File size cannot exceed 5MB.');
    //         return;
    //     }
    //     setFormData({ ...formData, uploadFileValue: event.target.value, uploadFile: file });
    //     setUploadDocerror(null); // Clear any previous errors
    // };

    useEffect(() => {
        getAllStates();
        getAllSubjects();
    }, [])

    useEffect(() => {
        getGrievanceData();
    }, [dataUpdated])


    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="applicant_email_id"
                                label="Email-ID"
                                fullWidth
                                value={formData.applicant_email_id}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="grievance_mail_subject"
                                label="Mail-Subject"
                                fullWidth
                                value={formData.grievance_mail_subject}
                            //onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="country-label">Grievance Subject</InputLabel>
                                <Select
                                    labelId="grievanceSubject"
                                    name="grievance_subject"
                                    value={formData.grievance_subject}
                                    onChange={handleChange}
                                >
                                    {allSubjects.map((item, ind) => (
                                        <MenuItem key={ind} value={item.subject_id}>{item.subject_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
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
                                    {/* <MenuItem value="2">DCPU</MenuItem>
                                    <MenuItem value="3">SARA</MenuItem>
                                    <MenuItem value="4">AFAA</MenuItem>
                                    <MenuItem value="5">SAA</MenuItem> */}
                                    {/* Add more countries as needed */}
                                </Select>
                            </FormControl>
                        </Grid>
                        {formData.grievance_from && parseInt(formData.grievance_from) < 2 && (
                            // <Grid container spacing={4}>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
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
                        )}
                        {parseInt(formData.grievance_from) < 2 && formData.regOncarings === '1' && (
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <TextField
                                    name="caringsRegId"
                                    label="CARINGS Registration ID"
                                    fullWidth
                                    value={formData.caringsRegId}
                                    onChange={handleChange}
                                />
                                <Button variant="contained" color="primary"
                                    style={{ marginTop: '10px' }}
                                    onClick={verifyRegisterParentIndentification}>
                                    Verify
                                </Button>
                            </Grid>
                        )}
                        {/* </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}> */}
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="name"
                                label="Name"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    aria-label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Male" />
                                    <FormControlLabel value="2" control={<Radio />} label="Female" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Grievance Category</FormLabel>
                                <RadioGroup
                                    aria-label="Grievance-Category"
                                    name="grievance_category"
                                    value={formData.grievance_category}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Adoption Process" />
                                    <FormControlLabel value="2" control={<Radio />} label="IT" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Grievance Type</FormLabel>
                                <RadioGroup
                                    aria-label="Grievance-Type"
                                    name="grievance_type"
                                    value={formData.grievance_type}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Query" />
                                    <FormControlLabel value="2" control={<Radio />} label="Complain" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                                name="phone"
                                label="phone"
                                fullWidth
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid> */}
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            {formData.grievance_from == 1 ?
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">Country</InputLabel>
                                    <Select
                                        labelId="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={(e) => { handleChange(e); }}
                                    >
                                        {countrys.map((item, ind) => (
                                            <MenuItem key={ind} value={item.country_code}>{item.country_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                :
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">State</InputLabel>
                                    <Select
                                        labelId="State"
                                        name="applicant_state_code"
                                        value={formData.applicant_state_code}
                                        //onChange={(e) => { handleChange(e); getAllDistrictOfState(e.target.value); }}
                                        onChange={handleChange}
                                    >
                                        {allStates.map((item, ind) => (
                                            <MenuItem key={ind} value={item.lgd_code}>{item.state_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            {formData.grievance_from == 1 ? null
                                :
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">District</InputLabel>
                                    <Select
                                        labelId="District"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                    >
                                        {districts.map((item, ind) => (
                                            <MenuItem key={ind} value={item.district_code}>{item.district_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        <Grid item lg={8} md={8} sm={12} xs={12}>
                            <TextField
                                name="grievance_mail_body"
                                label="Grievance Body"
                                fullWidth
                                multiline
                                rows={8}
                                value={formData.grievance_mail_body}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <TextField
                                name="grievance_remark"
                                label="Internal Remark"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.grievance_remark}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                <Link href={'https://mail.google.com/mail/u/0/#inbox/'} target="_blank" color={'inherit'}>See an Mail</Link>
                                {/* <input
                                    name="uploadFile"
                                    label="uploadFile"
                                    value={formData.uploadFileValue}
                                    onChange={handleChangeUploadDoc}
                                    type="file"
                                /> */}
                            </Button>
                            {uploadDocError && (
                                <FormHelperText error>{uploadDocError}</FormHelperText>
                            )}
                        </Grid>
                        {/* </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}> */}

                        {formData.grievance_subject && (
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">Grievance Against</InputLabel>
                                    <Select
                                        labelId="grievanceAgainst"
                                        name="grievance_against"
                                        value={formData.grievance_against}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="4">SAA</MenuItem>
                                        <MenuItem value="5">DCPU</MenuItem>
                                        <MenuItem value="2">SARA</MenuItem>
                                        <MenuItem value="1">CARA</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {formData.grievance_against && parseInt(formData.grievance_against) > 1 && (
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">Agency State</InputLabel>
                                    <Select
                                        labelId="agencyState"
                                        name="applicant_state_code"
                                        value={formData.applicant_state_code}
                                        //onChange={(e) => { handleChange(e); getAllDistrictOfState(e.target.value); }}
                                        onChange={handleChange}
                                    >
                                        {/* <MenuItem value="0">Domestic Parents</MenuItem> */}
                                        {states.map((item, ind) => (
                                            <MenuItem key={ind} value={item.state_code}>{item.state_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {formData.grievance_against && parseInt(formData.grievance_against) > 2 && (
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">Agency District</InputLabel>
                                    <Select
                                        labelId="agencyDistrict"
                                        name="agency_district"
                                        value={formData.agency_district}
                                        onChange={(e) => { handleChange(e); getAllAgencyOfDistrict(e.target.value); }}
                                    >
                                        {districts.map((item, ind) => (
                                            <MenuItem key={ind} value={item.district_code}>{item.district_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {formData.grievance_against && parseInt(formData.grievance_against) == 4 && (
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="country-label">Agency Registraction No</InputLabel>
                                    <Select
                                        labelId="agency"
                                        name="agency_regNo"
                                        value={formData.agency_regNo}
                                        onChange={handleChange}
                                    >
                                        {agencys.map((item, ind) => (
                                            <MenuItem key={ind} value={item.reg_no}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
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
                        >
                            <Typography variant="h3" sx={{ marginBottom: 2 }}>
                                Review and Submit
                            </Typography>
                            {/* {
                                grievanceFormKeys.map((item, key) => (
                                    <Typography key={key} variant="body1" sx={{ marginBottom: 2 }}>
                                        <strong>{item.toUpperCase()}:</strong> {formData[item]}
                                    </Typography>
                                ))
                            } */}
                            {/* <Typography key={0} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>GRIEVANCE FROM :</strong> {formData.grievance_from}
                            </Typography> */}
                            <Typography key={1} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>REGISTERED ON CARINGS :</strong> {formData.regOncarings == 1 ? "YES" : "NO"}
                            </Typography>
                            {formData.regOncarings == 1 &&
                                (<Typography key={2} variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>CARINGS REGISTRACTION ID :</strong> {formData.caringsRegId}
                                </Typography>)
                            }
                            <Typography key={3} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>NAME :</strong> {formData.name}
                            </Typography>
                            <Typography key={4} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>PHONE :</strong> {formData.phone}
                            </Typography>
                            <Typography key={5} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>EMAIL-ID :</strong> {formData.email}
                            </Typography>
                            <Typography key={6} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>GENDER :</strong> {formData.gender == 0 ? "MALE" : "FEMALE"}
                            </Typography>
                            {formData.grievance_from == 1 ?
                                (<Typography key={7} variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>COUNTRY :</strong> {countrys.reduce((value, curr) => {
                                        if (curr.country_code === formData.country) value = curr.country_name;
                                        return value;
                                    })}
                                </Typography>)
                                :
                                (<>
                                    <Typography key={7} variant="body1" sx={{ marginBottom: 2 }}>
                                        <strong>STATE :</strong>
                                        {states.reduce((acc, curr) => {
                                            if (curr.state_code == formData.state) acc = curr.state_name;
                                            return acc;
                                        }, null)}
                                    </Typography>
                                    <Typography key={8} variant="body1" sx={{ marginBottom: 2 }}>
                                        <strong>DISTRICT :</strong> {districts.reduce((acc, curr) => {
                                            if (curr.district_code === formData.district) {
                                                acc = curr.district_name;
                                            }
                                            return acc;
                                        }, null)}
                                    </Typography>
                                </>)
                            }

                            <Typography key={9} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>ADDRESS :</strong> {formData.address}
                            </Typography>
                            <Typography key={10} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>GRIEVANCE REMARK :</strong> {formData.grievance_remark}
                            </Typography>
                            <Typography key={11} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>GRIEVANCE SUBJECT :</strong> {grievanceSubjects.reduce((value, curr) => {
                                    if (curr.subject_id == formData.grievance_subject) value = curr.subject_name;
                                    return value;
                                }, null)}
                            </Typography>
                            <Typography key={12} variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>GRIEVANCE AGAINST :</strong> {formData.grievance_against == 1 ? "CARA" : formData.grievance_against == 2 ? "SARA" : formData.grievance_against == 4 ? "SAA" : "DCPU"}
                            </Typography>
                            {formData.grievance_against && parseInt(formData?.grievance_against) > 1 &&
                                (<Typography key={13} variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>AGENCY STATE :</strong> {states.reduce((value, curr) => {
                                        if (curr.state_code == formData.applicant_state_code) value = curr.state_name;
                                        return value;
                                    }, null)}
                                </Typography>)
                            }
                            {formData.grievance_against && parseInt(formData.grievance_against) > 2 &&
                                (<Typography key={14} variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>AGENCY DISTRICT :</strong> {districts.reduce((value, curr) => {
                                        if (curr.district_code == formData.agency_district) value = curr.district_name;
                                        return value;
                                    }, null)}
                                </Typography>)
                            }
                            {formData.grievance_against && parseInt(formData.grievance_against) == 4 &&
                                (<Typography key={15} variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>AGENCY REGISTRACTION-NO :</strong> {agencys.reduce((value, curr) => {
                                        if (curr.reg_no == formData.agency_regNo) value = curr.name;
                                        return value;
                                    }, null)}
                                </Typography>)
                            }
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
                                    <Button variant="contained" color="primary" onClick={updateGrievanceData}>
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

export default AP_ComplainForm

import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Button, Typography, Backdrop, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Divider, MenuItem, Select, FormControl, InputLabel, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SendIcon from '@mui/icons-material/Send';
// components
//import FormSkeloton from 'components/common/Skeloton/FormSkeloton';
import { gridSpacing } from 'store/constant';
//import { CustomPostApi, CustomGetApi } from 'api';
import { CustomGetApi, CustomPostApi } from 'api';
// ==============================|| View Cara Users Table ||============================== //

const UnResolvedGrievancesView = () => {
    const theme = useTheme();
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [allGrievances, setAllGrievances] = useState([]);
    //const [selectedDocumentToview, setSelectedDocumentToview] = useState("");
    //const [caraDepts, setCaraDepts] = useState([]);
    const [openGrievanceReplyDialog, setOpenGrievanceReplyDialog] = useState(false);
    const initialGrievanceFormData = {
        'email_token': '',
        'applicant_name': '',
        'email-body': '',
        'grievance_mail_subject': '',
        'grievance_mail_body': '',
        'cc_ids': '',
        'reply_body': '',
        'reply_type': '0'
    }
    const [openedGrievancer, setOpenedGrievancer] = useState(initialGrievanceFormData);
    const handleClickopenGrievanceReplyDialog = (currentGrievancer) => {
        //console.log("inside handleClickopenGrievanceReplyDialog", openGrievanceReplyDialog)
        const grievancerDetails = currentGrievancer;
        setOpenedGrievancer({
            ...openedGrievancer,
            email_token: grievancerDetails.email_token,
            applicant_name: grievancerDetails.applicant_name,
            "email-body": grievancerDetails["email-body"],
            grievance_mail_subject: grievancerDetails.grievance_mail_subject,
            grievance_mail_body: grievancerDetails.grievance_mail_body,
        })
        setOpenGrievanceReplyDialog(true);
    };

    const handleCloseopenGrievanceReplyDialog = () => {
        setOpenGrievanceReplyDialog(false);
    };

    const handleChange = (e) => {
        setOpenedGrievancer({ ...openedGrievancer, [e.target.name]: e.target.value });
    };
    const validateCC = (ccIds) => {
        // If ccIds is empty or null, return true (valid)
        if (!ccIds || ccIds.trim() === '') {
            return true;
        }

        // Split the comma-separated values into an array
        const emails = ccIds.split(',').map((email) => email.trim());

        // Validate each email in the array
        const isValidEmail = emails.every((email) => {
            // Regular expression for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        });

        return isValidEmail;
    };

    const columns = [
        {
            field: 'from_email', headerName: 'From Email', width: 200, renderCell: (params) => (
                <Button variant="contained" endIcon={<SendIcon />} onClick={() => handleClickopenGrievanceReplyDialog(params.row)}>
                    {params.value}
                </Button>
            )
        },
        // {
        //     field: 'grievance_dept_code', // Assuming 'action' is the field for the selector column
        //     headerName: 'Take Action',
        //     width: 200,
        //     renderCell: (params) => (
        //         params.value ? <strong>
        //             {caraDepts.find((dept) => dept.dept_id === params.value)?.dept_name}
        //         </strong> : "Not-Avilable"
        //     ),
        // },
        { field: 'email-subject', headerName: 'Subject', width: 100 },
        { field: 'email-body', headerName: 'Mail-Id', width: 200 },
        { field: 'email-category', headerName: 'Categories', width: 200 },
         { field: 'email_status', headerName: 'Status', width: 200 },
        { field: 'email_created_at', headerName: 'Created At', width: 200 },
        { field: 'email_received_at', headerName: 'Received At', width: 200 },
        { field: 'llm_reply', headerName: 'LLM Reply', width: 200 },
        { field: 'final_reply', headerName: 'Final Reply', width: 200 },
        { field: 'email_replied_at', headerName: 'Replied At', width: 200 },
        { field: 'applicant_regno', headerName: 'Reg-No', width: 200, renderCell: (params) => params.value ? params.value : "Not-Available" },
        { field: 'grievance_from', headerName: 'USER-LEVEL', width: 200, renderCell: (params) => params.value ? params.value : "Not-Available" },
        { field: 'grievance_mail_subject', headerName: 'Mail-Subject', width: 200 },
        { field: 'grievance_mail_body', headerName: 'mail-Body', width: 300 },
        {
            field: 'attached_docs', headerName: 'Attached Documents', width: 300, renderCell: (params) => (
                params.value ?
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select Document</InputLabel>
                        <Select
                            value={""} // Assuming 'action' is a property in each row
                            label={"Select Document"}
                        //onChange={(e) => moveGrievanceBetweenCaraDepts(params.row, e.target.value)}
                        >
                            {params.value.map((item, ind) => <MenuItem key={ind} value={item}><Link href={`/grievance/pdf/${item}`} target="_blank">{item}</Link></MenuItem>)}
                        </Select>
                    </FormControl>
                    : "No-Document Attached"
            )
        },
        { field: 'grievance_category', headerName: 'Grievance-Category', width: 150, renderCell: (params) => params.value == 1 ? "Program-Division" : params.value == 2 ? "IT" : "Not-Available" },
        { field: 'grievance_type', headerName: 'Grievance-Type', width: 150, renderCell: (params) => params.value == 1 ? "Query" : params.value == 2 ? "Complain" : "Not-Available" },
        { field: 'grievance_subject_id', headerName: 'Grievance-Subject', width: 200 },
        //{ field: 'applicant_state_code', headerName: 'CREATION-DATE', width: 200 },
        //{ field: 'applicant_district_code', headerName: 'CREATION-DATE', width: 200 },
        { field: 'internal_remark', headerName: 'Internal-Remark', width: 300, renderCell: (params) => params.value ? params.value : "Not-Available" },
        { field: 'grievance_entry_date', headerName: 'CREATION-DATE', width: 200, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "Not-Avilable" },
        {
            field: '', headerName: 'Push Back Grievance', width: 200, renderCell: (params) => (
                <Button variant="contained" onClick={() => pushBackGrievanceFromConsultantLevel(params.row.email_token)}>
                    Push-Back
                </Button>
            )
        },
        {
            field: 'user_status', headerName: 'Action', width: 200, renderCell: (params) => (
                <Button variant="contained" onClick={() => updateGrievanceStatusToResolved(params.row.email_token)}>
                    Click for Marked-Resolved
                </Button>
            )
        }
    ];
    const getAllGrievances = async () => {
        try {
            setLoadingOverlay(true);
            const { data, error } = await CustomGetApi('caraemployee/getAllUnResolvedGrievances');
            if (!data) toast.error(`Failed!, ${error}`)
            else {
                //console.log(data);
                toast.success(`Success!, ${data?.msg}`)
                console.log("allGrievances", data?.allGrievances)
                setAllGrievances(data?.allGrievances);
            }
        } catch (err) {
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    }
    const updateGrievanceStatusToResolved = async (email_token) => {
        try {
            const isConfirmed = window.confirm(`Are You Sure you want to Change the status of grievance to Resolved of G.NO -- ${email_token}`);
            if (isConfirmed) {
                setLoadingOverlay(true);
                const apiData = {
                    email_token: email_token
                }
                const { data, error } = await CustomPostApi('caraemployee/updateGrievanceStatusToResolved', apiData);
                if (!data) toast.error(`Failed!, ${error}`)
                else {
                    toast.success(`Success!, ${data?.msg}`)
                    getAllGrievances();
                }
            } else {
                toast.error('Cancelled!')
            }

        } catch (err) {
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    }

    const sendGrievanceReply = async () => {
        try {
            const isConfirmed = window.confirm(`Are You Sure you want to send this reply of G.NO -- ${openedGrievancer.email_token}`);
            if (isConfirmed) {
                setLoadingOverlay(true);
                const cc_ids = openedGrievancer.cc_ids.trim();
                const validate_ccIds = validateCC(cc_ids);
                if (!openedGrievancer.email-body) { return toast.error('Failed to fetch applicant email id.') }
                if (!validate_ccIds) { return toast.error('Invalid emails inside cc field.') }
                if (!openedGrievancer?.reply_body || openedGrievancer?.reply_body.length < 100) { return toast.error('Reply Body can not be less than 100 characters') }

                const apiData = openedGrievancer;
                const { data, error } = await CustomPostApi('caraemployee/sendGrievanceReply', apiData);
                if (!data) toast.error(`failed to reply! , ${error}`)
                else {
                    toast.success(`Success!, ${data?.msg}`)
                    getAllGrievances();
                    setOpenedGrievancer(initialGrievanceFormData);
                    setOpenGrievanceReplyDialog(false);
                }
            } else {
                toast.error('Cancelled!')
            }
        } catch (err) {
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    }

    const pushBackGrievanceFromConsultantLevel = async (email_token) => {
        try {
            setLoadingOverlay(true);
            if (!email_token) { return toast.error('Failed to get Grievance Details to Push it Back!') }
            const apiData = {
                email_token: email_token
            };
            const { data, error } = await CustomPostApi('caraemployee/pushBackGrievanceFromConsultantLevel', apiData);
            //console.log(data, error);
            if (!data) {
                //console.log("error moveGrievanceBetweenCaraDepts", error);
                return toast.error(`Failed!, ${error}`)
            }
            else {
                getAllGrievances();
                return toast.success('Grievances Pushed Backed Successfully.');
            }
        } catch (err) {
            //console.log("catch error moveGrievanceBetweenCaraDepts", err)
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    }

    // const handleViewGrievanceAttachedDoc = async (documentName) => {
    //     try {
    //         if (!selectedDocumentToview){return}
    //         else {
    //             setSelectedDocumentToview(documentName);

    //         }
    //     } catch (err) {
    //         toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    //     }
    // }



    useEffect(() => {
        getAllGrievances();
        //getAllCaraDepts();
    }, [])
    return (
        <Grid container spacing={gridSpacing}>
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOverlay}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid item xs={12}>
                <Grid container style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBlock: '10px',
                }}>
                    <Typography variant="h2">
                        <u>View Un-Resolved Grievances List</u>
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <DataGrid
                    rows={allGrievances}
                    columns={columns}
                    getRowId={(row) => row.email_token}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "wheat",
                            color: "black",
                            fontWeight: 700,
                        },
                        "& .MuiDataGrid-virtualScrollerRenderZone": {
                            backgroundColor: "white",
                            color: "black",
                        },
                    }}
                    //onRowClick={handleRowClick}
                    pageSizeOptions={[5, 10]}
                />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                {openGrievanceReplyDialog && (
                    <Box >
                        <Dialog
                            open={openGrievanceReplyDialog}
                            onClose={handleCloseopenGrievanceReplyDialog}
                            fullWidth
                            maxWidth="xl"

                        // PaperProps={{
                        //     component: 'form',
                        //     onSubmit: (event) => {
                        //         event.preventDefault();
                        //         const formData = new FormData(event.currentTarget);
                        //         const formJson = Object.fromEntries(formData.entries());
                        //         //const email = formJson.email;
                        //         //console.log(email);
                        //         handleCloseopenGrievanceReplyDialog();
                        //     },
                        //     sx: {
                        //         margin: '4px', // Adjust the margin value as needed
                        //     },
                        // }}
                        >
                            <DialogTitle>Grievance Reply</DialogTitle>
                            <Grid container spacing={3}>
                                {/* User details form fields */}
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <TextField
                                        name="applicant_name"
                                        label="Grievancer Name"
                                        fullWidth
                                        value={openedGrievancer.applicant_name}
                                        disabled
                                    />
                                </Grid>
                                {/* User details form fields */}
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <TextField
                                        name="email-body"
                                        label="Grievancer Mail Id"
                                        fullWidth
                                        type='email'
                                        value={openedGrievancer.email-body}
                                        disabled
                                    />
                                </Grid>
                                {/* User details form fields */}
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                    <TextField
                                        name="grievance_mail_subject"
                                        label="Grievancer Mail Subject"
                                        fullWidth
                                        value={openedGrievancer.grievance_mail_subject}
                                        disabled
                                    />
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <DialogContent>
                                        <TextField
                                            name="grievance_mail_body"
                                            label="Grievance Mail Body"
                                            autoFocus
                                            required
                                            margin="dense"
                                            variant="standard"
                                            fullWidth
                                            multiline
                                            rows={8}
                                            disabled
                                            value={openedGrievancer.grievance_mail_body}
                                        />
                                        <Divider sx={{ marginTop: '50px' }} />
                                        <DialogContentText sx={{ color: theme.palette.primary.main }}>
                                            Please enter your reply in the field below.
                                        </DialogContentText>
                                        <Divider />
                                        <TextField
                                            margin="dense"
                                            id="cc"
                                            name="cc_ids"
                                            label="CC (comma-separated emails)"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            multiline
                                            rows={2}
                                            value={openedGrievancer.cc_ids}
                                            onChange={handleChange}
                                        />

                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="name"
                                            name="reply_body"
                                            label="Reply Body"
                                            type="text"
                                            multiline
                                            rows={8}
                                            fullWidth
                                            variant="standard"
                                            value={openedGrievancer.reply_body}
                                            onChange={handleChange}
                                        />
                                        <FormControl sx={{ marginTop: '20px', width: '30%' }}>
                                            <InputLabel id="reply-type-select-label">Select Reply</InputLabel>

                                            <Select
                                                value={openedGrievancer.reply_type} // Assuming 'action' is a property in each row
                                                label={"Select Reply Type"}
                                                onChange={(e) => setOpenedGrievancer({ ...openedGrievancer, reply_type: e.target.value })}
                                            >
                                                <MenuItem key={0} value={0}>Under-Process</MenuItem>
                                                <MenuItem key={1} value={1}>Interim</MenuItem>
                                                <MenuItem key={2} value={2}>Final</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseopenGrievanceReplyDialog}>Cancel</Button>
                                        <Button type="submit" endIcon={<SendIcon />} onClick={() => sendGrievanceReply()}>Send</Button>
                                    </DialogActions>
                                </Grid>
                            </Grid>
                        </Dialog>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default UnResolvedGrievancesView;
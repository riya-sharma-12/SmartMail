import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
// material-ui
import { Grid, Typography, Backdrop, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
//import FormSkeloton from 'components/common/Skeloton/FormSkeloton';
import { gridSpacing } from 'store/constant';
// import { CustomPostApi, CustomGetApi } from 'api';
// ==============================|| View Cara Users Table ||============================== //

const AllGrievancesView = () => {
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [allGrievances, setAllGrievances] = useState([]);
    // const [caraDepts, setCaraDepts] = useState([]);

    const columns = [
        { field: 'from_email', headerName: 'Email From', width: 150 },
        // {
        //     field: 'grievance_dept_code', // Assuming 'action' is the field for the selector column
        //     headerName: 'Take Action',
        //     width: 200,
        //     renderCell: (params) => (
        //         <FormControl fullWidth>
        //             <InputLabel id="demo-simple-select-label">Select Department</InputLabel>
        //             <Select
        //                 value={params.row.grievance_dept_code} // Assuming 'action' is a property in each row
        //                 label={"Select Department"}
        //                 onChange={(e) => moveGrievanceBetweenCaraDepts(params.row, e.target.value)}
        //             >
        //                 {caraDepts.map((item, ind) => <MenuItem key={ind} value={item.dept_id}>{item.dept_name}</MenuItem>)}
        //             </Select>
        //         </FormControl>
        //     ),
        // },
        { field: 'email-subject', headerName: 'Subject', width: 100 },
        { field: 'email-body', headerName: 'Body', width: 200 },
        { field: 'email-category', headerName: 'Categories', width: 200 },
         { field: 'email_status', headerName: 'Status', width: 200 },
        { field: 'email_created_at', headerName: 'Created At', width: 200 },
        { field: 'email_received_at', headerName: 'Received At', width: 200 },
        { field: 'llm_reply', headerName: 'LLM Reply', width: 200 },
        { field: 'final_reply', headerName: 'Final Reply', width: 200 },
        { field: 'email_replied_at', headerName: 'Replied At', width: 200 },
        // { field: 'applicant_regno', headerName: 'Reg-No', width: 200, renderCell: (params) => params.value ? params.value : "Not-Available" },
        // { field: 'grievance_from', headerName: 'USER-LEVEL', width: 200, renderCell: (params) => params.value ? params.value : "Not-Available" },
        // { field: 'grievance_mail_subject', headerName: 'Mail-Subject', width: 200 },
        // { field: 'grievance_mail_body', headerName: 'mail-Body', width: 300 },
        // { field: 'grievance_category', headerName: 'Grievance-Category', width: 150, renderCell: (params) => params.value == 1 ? "Program-Division" : params.value == 2 ? "IT" : "Not-Available" },
        // { field: 'grievance_type', headerName: 'Grievance-Type', width: 150, renderCell: (params) => params.value == 1 ? "Query" : params.value == 2 ? "Complain" : "Not-Available" },
        // { field: 'grievance_subject_id', headerName: 'Grievance-Subject', width: 200 },
        // //{ field: 'applicant_state_code', headerName: 'CREATION-DATE', width: 200 },
        // //{ field: 'applicant_district_code', headerName: 'CREATION-DATE', width: 200 },
        // { field: 'internal_remark', headerName: 'Internal-Remark', width: 300, renderCell: (params) => params.value ? params.value : "Not-Available" },
        // { field: 'grievance_entry_date', headerName: 'CREATION-DATE', width: 200, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "Not-Avilable" },
        // {
        //     field: 'user_status', headerName: 'Status', width: 200, renderCell: () => (
        //             <Button variant="contained" style={{ backgroundColor: '#FF0000' }}>
        //                 Not-Resolved
        //             </Button>
        //     )
        // }
    ];
    const getAllGrievances = async () => {
        try {
            setLoadingOverlay(true);
            const { data, error } = await CustomGetApi('/admin/getAllEmails');
            if (!data) toast.error(`Failed!, ${error}`)
            else {
                //console.log(data);
                toast.success(`Success!, ${data?.msg}`)
                setAllGrievances(data?.allGrievances);
            }
        } catch (err) {
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    }

    const getAllCaraDepts = async () => {
        try {
            setLoadingOverlay(true);
            const { data, error } = await CustomGetApi('/admin/getAllEmails');
            if (!data) toast.error(`Failed!, ${error}`)
            else {
                //console.log(data);
                toast.success(`Success!, ${data?.msg}`)
                setCaraDepts(data?.allCaraDepts);
            }
        } catch (err) {
            toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
        } finally {
            setLoadingOverlay(false);
        }
    }

    // const moveGrievanceBetweenCaraDepts = async (row, dept_move_to) => {
    //     try {
    //         setLoadingOverlay(true);
    //         //console.log("inside moveGrievanceBetweenCaraDepts", row, dept_move_to)
    //         const apiData = {
    //             email_token: row?.email_token,
    //             dept_move_to: dept_move_to
    //         };
    //         const { data, error } = await CustomPostApi('caraadmin/moveGrievanceBetweenCaraDepts', apiData);
    //         //console.log(data, error);
    //         if (!data) {
    //             //console.log("error moveGrievanceBetweenCaraDepts", error);
    //             return toast.error(`Failed!, ${error}`)
    //         }
    //         else {
    //             getAllGrievances();
    //             return toast.success('Grievances Moved Successfully.');
    //         }
    //     } catch (err) {
    //         //console.log("catch error moveGrievanceBetweenCaraDepts", err)
    //         toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    //     } finally {
    //         setLoadingOverlay(false);
    //     }
    // }



    useEffect(() => {
        getAllGrievances();
        getAllCaraDepts();
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
                        <u>View All Emails</u>
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
                    checkboxSelection
                />
            </Grid>
        </Grid>
    );
};

export default AllGrievancesView;
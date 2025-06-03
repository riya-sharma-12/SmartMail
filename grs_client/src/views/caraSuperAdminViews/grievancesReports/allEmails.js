import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
// material-ui
import { Grid, Typography, Backdrop, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
//import FormSkeloton from 'components/common/Skeloton/FormSkeloton';
import { gridSpacing } from 'store/constant';
import { CustomGetApi } from 'api';
// ==============================|| View Cara Users Table ||============================== //

const AllGrievancesView = () => {
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [allGrievances, setAllGrievances] = useState([]);
    //const [caraDepts, setCaraDepts] = useState([]);

    const columns = [
         {
    field: 'from_email',
    headerName: 'Email From',
    width: 150,
    valueFormatter: (params) => {
      let email = params.value || '';
      if (email.startsWith('"')) {
        email = email.substring(1); // Remove leading "
      }
      return email;
    },
  },
  {
  field: 'email-subject',
  headerName: 'Subject',
  width: 200,
  valueFormatter: (params) => {
    return params.value?.replace(/^[“"]|[”"]$/g, '') || '';
  }
},

    { field: 'email-body', headerName: 'Body', width: 200 },
        { field: 'email-category', headerName: 'Categories', width: 200 },
         { field: 'email_status', headerName: 'Status', width: 200, valueGetter: (params) => (params.row.email_status == 0 ? 'No' : 'Yes')  },
        { field: 'email_created_at', headerName: 'Created At', width: 200 },
        { field: 'email_received_at', headerName: 'Received At', width: 200 },
        { field: 'llm_reply', headerName: 'LLM Reply', width: 200 },
        { field: 'final_reply', headerName: 'Final Reply', width: 200 },
        { field: 'email_replied_at', headerName: 'Replied At', width: 200 },
    ];
    const getAllGrievances = async () => {
        try {
            setLoadingOverlay(true);
            const { data, error } = await CustomGetApi('/admin/getAllEmails');
            console.log("data", data);
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

    useEffect(() => {
        getAllGrievances();
        // getAllCaraDepts();
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
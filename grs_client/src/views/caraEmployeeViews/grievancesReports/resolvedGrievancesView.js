import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
// material-ui
import { Grid, Typography, Backdrop, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
//import FormSkeloton from 'components/common/Skeloton/FormSkeloton';
import { gridSpacing } from 'store/constant';
import {  CustomGetApi } from 'api';
// ==============================|| View Cara Users Table ||============================== //

const ResolvedGrievancesView = () => {
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [allGrievances, setAllGrievances] = useState([]);
    const [caraDepts, setCaraDepts] = useState([]);

    const columns = [
         {
      field: 'from_email',
      headerName: 'Email From',
      width: 150,
      valueFormatter: (params) => {
        let email = params.value || '';
        return email.startsWith('"') ? email.substring(1) : email;
      }
    },
    {
  field: 'email-subject',
  headerName: 'Subject',
  width: 200,

  // Custom sort comparator to remove quotes before comparison
  sortComparator: (v1, v2) => {
    const clean = (val) =>
      (val || '').replace(/^[“"']|[”"']$/g, '').toLowerCase();

    return clean(v1).localeCompare(clean(v2));
  }
},
{
  field: 'email-body',
  headerName: 'Body',
  width: 200,

  // ✅ Show the original unmodified value — NO valueFormatter

  // ✅ Sort using cleaned value (remove leading non-alphanumerics)
  sortComparator: (v1, v2) => {
    const clean = (val) =>
      (val || '').replace(/^[^a-zA-Z0-9]+/, '').trim().toLowerCase();

    return clean(v1).localeCompare(clean(v2));
  }
},
{
  field: 'email-category',
  headerName: 'Categories',
  width: 135,
  valueFormatter: (params) => {
    const value = params.value;
    if (value === 'top-priority') return 'Top Priority';
    if (value === 'less-priority') return 'Less Priority';
    if (value === 'spam') return 'Spam Mail';
    return value; // default fallback
  }
},
    {
      field: 'email_status',
      headerName: 'Status',
      width: 135,
      valueGetter: (params) => (params.row.email_status === 0 ? 'Not Replied' : 'Reply Sent')
    },
    {   field: 'email_created_at',
  headerName: 'Created At',
  type: 'dateTime',
  width: 180,
  valueFormatter: (params) => {
    const date = new Date(params.value);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  },
}
,
     { field: 'email_received_at', headerName: 'Received At', type: 'dateTime',
  width: 180,
  valueFormatter: (params) => {
    const date = new Date(params.value);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, },
{
  field: 'llm_reply',
  headerName: 'LLM Reply',
  width: 200,
  type: 'string',
  valueGetter: (params) => {
    const raw = (params.value ?? '').toString().trim();
    const cleaned = raw.replace(/^[^a-zA-Z0-9]+/, '');
    return cleaned.length === 0 ? 'NA' : cleaned;
  },
  sortComparator: (v1, v2) => {
    const clean = (val) =>
      (val ?? '').toString().replace(/^[^a-zA-Z0-9]+/, '').trim().toLowerCase();

    return clean(v1).localeCompare(clean(v2));
  },
},
{
      field: 'final_reply',
      headerName: 'Final Reply',
      width: 200,
      valueGetter: (params) => {
    const raw = (params.value ?? '').toString().trim();
    const cleaned = raw.replace(/^[^a-zA-Z0-9]+/, '');
    return cleaned.length === 0 ? 'NA' : cleaned;
  }},
   {
  field: 'email_replied_at',
  headerName: 'Reply Generated At',
  type: 'dateTime',
  width: 180,
  valueFormatter: (params) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  },
}
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
                        <u>View New Emails</u>
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

export default ResolvedGrievancesView;
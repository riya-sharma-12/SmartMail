import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
// material-ui
import { Grid, Button, Typography, Backdrop, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
//import FormSkeloton from 'components/common/Skeloton/FormSkeloton';
import { gridSpacing } from 'store/constant';
import { CustomPostApi, CustomGetApi } from 'api';
import { encryptValue } from 'utils/commonFunctions';
// ==============================|| View Cara Users Table ||============================== //

const ViewAllCaraUsers = () => {
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [caraUsers, setCaraUsers] = useState([]);

  const columns = [
    { field: 'user_name', headerName: 'NAME', width: 150 },
    { field: 'user_id', headerName: 'USER-ID', width: 300 },
    { field: 'user_level', headerName: 'USER-LEVEL', width: 200 },
    { field: 'user_dept', headerName: 'DEPARTMENT', width: 200 },
    { field: 'user_creater_id', headerName: 'CREATER-ID', width: 200 },
    { field: 'user_created_at', headerName: 'CREATION-DATE', width: 200, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "Not-Avilable" },
    {
      field: 'user_status', headerName: 'Status', width: 100, renderCell: (params) => (
        params.value == 0 ?
          <Button variant="contained" style={{ backgroundColor: '#FF0000' }} onClick={() => handleChangeCaraUserStatus(params.row.user_id)}>
            Blocked
          </Button>
          :
          <Button variant="contained" disableElevation onClick={() => handleChangeCaraUserStatus(params.row.user_id)}>
            Active
          </Button>
      )
    }
  ];
  const getAllCaraGrievanceUsers = async () => {
    try {
      setLoadingOverlay(true);
      const { data, error } = await CustomGetApi('caraadmin/getAllCaraGrievanceUsers');
      if (!data) toast.error(`Failed!, ${error}`)
      else {
        //console.log(data);
        toast.success(`Success!, ${data?.msg}`)
        setCaraUsers(data?.allUsers);
      }
    } catch (err) {
      toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  }

  const handleChangeCaraUserStatus = async (user_id) => {
    try {
      //console.log(user_id, "user_id")
      const isConfirmed = window.confirm(`Are You Sure you want to Change the status of user with a user-id -- ${user_id}`);
      if (isConfirmed) {
        setLoadingOverlay(true);
        const encryptedEmail = encryptValue(user_id);
        const apiData = {
          user_id: encryptedEmail
        }
        //console.log(apiData, user_id)
        const { data, error } = await CustomPostApi('carasuperadmin/blockunblockCurrUser', apiData);
        if (!data) toast.error(`Failed!, ${error}`)
        else {
          toast.success(`Success!, ${data?.msg}`)
          getAllCaraGrievanceUsers();
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



  useEffect(() => {
    getAllCaraGrievanceUsers();
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
            <u>View Cara Users List</u>
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          rows={caraUsers}
          columns={columns}
          getRowId={(row) => row.user_id}
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

export default ViewAllCaraUsers;
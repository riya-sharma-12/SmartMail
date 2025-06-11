import PropTypes from 'prop-types';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Backdrop, CircularProgress, Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper, Dialog, DialogContent, DialogContentText, DialogActions, Button, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import { CustomPostApi } from 'api';

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: '99%',
  top: '-55px !important',
  padding: '0 12px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px'
  }
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: 434,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff'
  }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));


// const initialGrievanceDetailForm = {
//   'email_token': "",
//   'applicant_email_id': "",
//   'mail_message_id': "",
//   'grievance_mail_subject': "",
//   'grievance_mail_body': "",
//   'applicant_name': "",
//   'applicant_gender': "",
//   'applicant_regno': "",
//   'applicant_state_code': "",
//   'applicant_district_code': "",
//   'grievance_category': "",
//   'grievance_type': "",
//   'grievance_from': "",
//   'internal_remark': "",
//   'grievance_status': "",
//   'grievance_entry_date': "",
//   'dept_id': "",
//   'dept_name': ""
// }

const columns = [
  // { field: 'id', headerName: 'S.NO', width: 200 },
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
  {
  field: 'email_created_at',
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
}

,
    {
      field: 'final_reply',
      headerName: 'Final Reply',
      width: 200,
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
      // renderCell: (params) => (
      //   <div
      //     onDoubleClick={() => {
      //       setSelectedEmail(params.row);
      //       setEditedReply(params.value || '');
      //       setEditDialogOpen(true);
      //     }}
      //     style={{ cursor: 'pointer'}}
      //   >
      //     {params.value}
      //   </div>
      // )
    },
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

// ==============================|| SEARCH INPUT - MOBILE||============================== //




const MobileSearch = ({ searchValue, setSearchValue, handleKeyPress, popupState }) => {
  const theme = useTheme();

  return (
    <OutlineInputStyle
      id="input-search-header"
      value={searchValue}
      type='number'
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={handleKeyPress} // Listen for key press event
      placeholder="Search Email"
      startAdornment={
        <InputAdornment position="start">
          <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
        </InputAdornment>
      }
      // endAdornment={
      //   <InputAdornment position="end">
      //     <ButtonBase sx={{ borderRadius: '12px' }}>
      //       <HeaderAvatarStyle variant="rounded">
      //         <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
      //       </HeaderAvatarStyle>
      //     </ButtonBase>
      //     <Box sx={{ ml: 2 }}>
      //       <ButtonBase sx={{ borderRadius: '12px' }}>
      //         <Avatar
      //           variant="rounded"
      //           sx={{
      //             ...theme.typography.commonAvatar,
      //             ...theme.typography.mediumAvatar,
      //             background: theme.palette.orange.light,
      //             color: theme.palette.orange.dark,
      //             '&:hover': {
      //               background: theme.palette.orange.dark,
      //               color: theme.palette.orange.light
      //             }
      //           }}
      //           {...bindToggle(popupState)}
      //         >
      //           <IconX stroke={1.5} size="1.3rem" />
      //         </Avatar>
      //       </ButtonBase>
      //     </Box>
      //   </InputAdornment>
      // }
      aria-describedby="search-helper-text"
      inputProps={{ 'aria-label': 'weight' }}
    />
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PopupState
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [allgrievanceReplyLog, setAllGrievanceReplyLog] = useState([]);
  //console.log(allgrievanceReplyLog)
  const [openDialog, setOpenDialog] = useState(false);
  //const [grievanceDetails, setgrievanceDetails] = useState(initialGrievanceDetailForm);


  const handleClickopenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseopenDialog = () => {
    setOpenDialog(false);
    //setgrievanceDetails(initialGrievanceDetailForm);
    setAllGrievanceReplyLog([])
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchValue(searchValue); // Assuming handleSearchValue is your search function
    }
  };

  //handleSearchValue
  const handleSearchValue = (value) => {
    try {
      const email_subject = value;
      if (email_subject) {
        grievanceReplyLog(value);
      } else {
        setOpenDialog(false);
        return toast.error('Invalid Email')
      }

    } catch (error) {
      setOpenDialog(false);
      return toast.error('Catch a Error -- Invalid Email')
    }
  };


  const grievanceReplyLog = async (emailSubject) => {
    try {
      setLoadingOverlay(true);
      const apiData = { emailSubject: emailSubject }
      const { data, error } = await CustomPostApi('/admin/getAllEmailsBySubjs', apiData);
      if (!data) toast.error(`Failed!, ${error}`)
      else {
        toast.success(`Success!, ${data?.msg}`)
        //const grievanceDetail = data?.data?.grievanceDetail;
        const grievanceReplyHistory = data?.allGrievances;
        //setgrievanceDetails(grievanceDetail);
        setAllGrievanceReplyLog(grievanceReplyHistory)
        handleClickopenDialog()
      }
    } catch (err) {
      toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  }

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingOverlay}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                  <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <>
                    <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                      <Card
                        sx={{
                          background: '#fff',
                          [theme.breakpoints.down('sm')]: {
                            border: 0,
                            boxShadow: 'none'
                          }
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs>
                              <MobileSearch value={searchValue} setValue={setSearchValue} handleKeyPress={handleKeyPress} popupState={popupState} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Transitions>
                  </>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={searchValue}
          type='text'
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for key press event
          placeholder="Search Email"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          // endAdornment={
          //   <InputAdornment position="end">
          //     <ButtonBase sx={{ borderRadius: '12px' }}>
          //       <HeaderAvatarStyle variant="rounded">
          //         <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
          //       </HeaderAvatarStyle>
          //     </ButtonBase>
          //   </InputAdornment>
          // }
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight' }}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseopenDialog}
        fullWidth
        maxWidth="xl"
      >
        <DialogActions>
          <Button onClick={handleCloseopenDialog}><CloseRoundedIcon /></Button>
        </DialogActions>
        {/* <DialogTitle variant='h2'>Grievance Details of Token No -- {searchValue}</DialogTitle>
        <Divider sx={{ marginBottom: '30px' }} /> */}
        <Grid container spacing={3}>
          {/* User details form fields */}
          {/* <Grid item lg={3} md={6} sm={12} xs={12}>
            <TextField
              name="applicant_name"
              label="Grievancer Name"
              fullWidth
              value={grievanceDetails.applicant_name}
              disabled
            />
          </Grid> */}
          {/* User details form fields */}
          {/* <Grid item lg={3} md={6} sm={12} xs={12}>
            <TextField
              name="applicant_email_id"
              label="Grievancer Mail Id"
              fullWidth
              type='email'
              value={grievanceDetails.applicant_name}
              disabled
            />
          </Grid> */}
          {/* User details form fields */}
          {/* <Grid item lg={3} md={6} sm={12} xs={12}>
            <TextField
              name="grievance_mail_subject"
              label="Grievancer Mail Subject"
              fullWidth
              value={grievanceDetails.applicant_name}
              disabled
            />
          </Grid> */}
          {/* <Grid item lg={3} md={6} sm={12} xs={12}>
            <TextField
              name="grievance_entry_date"
              label="Grievancer Entry Date"
              fullWidth
              type='text'
              value={grievanceDetails.applicant_name}
              disabled
            />
          </Grid> */}
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <DialogContent>
              {/* <TextField
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
                value={grievanceDetails.applicant_name}
              />
              <Divider sx={{ marginTop: '50px' }} /> */}
              <DialogContentText variant='h2' sx={{ color: theme.palette.primary.main }}>
                Emails Found:
              </DialogContentText>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <DataGrid
                  rows={allgrievanceReplyLog}
                  columns={columns}
                  getRowId={(row) => row.id}
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
                  pageSizeOptions={[10, 20, 100]}
                //checkboxSelection
                />
              </Grid>
              <Divider />
            </DialogContent>
          </Grid>
        </Grid>
      </Dialog >
    </>
  );
};

export default SearchSection;

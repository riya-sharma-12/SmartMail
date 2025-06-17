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
import { IconSearch } from '@tabler/icons';
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
    return value; 
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




const MobileSearch = ({ searchValue, setSearchValue, handleKeyPress }) => {
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
      aria-describedby="search-helper-text"
      inputProps={{ 'aria-label': 'weight' }}
    />
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [conversationLog, setConversationLog] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);


  const handleClickopenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseopenDialog = () => {
    setOpenDialog(false);
    setConversationLog([])
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
        fetchEmails(value);
      } else {
        setOpenDialog(false);
        return toast.error('Invalid Email')
      }

    } catch (error) {
      setOpenDialog(false);
      return toast.error('Catch a Error -- Invalid Email')
    }
  };


  const fetchEmails = async (emailSubject) => {
    try {
      setLoadingOverlay(true);
      const apiData = { emailSubject: emailSubject }
      const { data, error } = await CustomPostApi('/admin/getallEmailsBySubjs', apiData);
      if (!data) toast.error(`Failed!, ${error}`)
      else {
        toast.success(`Success!, ${data?.msg}`)
        const emailReplyHistory	 = data?.allEmails;
        setConversationLog(emailReplyHistory)
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
          onKeyDown={handleKeyPress} 
          placeholder="Search Email"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
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
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <DialogContent>
              <DialogContentText variant='h2' sx={{ color: theme.palette.primary.main }}>
                Emails Found:
              </DialogContentText>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <DataGrid
                  rows={conversationLog}
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
                  pageSizeOptions={[10, 20, 100]}
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

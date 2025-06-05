import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'store/constant';
import { CustomGetApi, CustomPostApi } from 'api'; // ✅ Make sure this includes CustomPostApi

const AllGrievancesView = () => {
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [allGrievances, setAllGrievances] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

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
      valueFormatter: (params) => params.value?.replace(/^[“"]|[”"]$/g, '') || ''
    },
    { field: 'email-body', headerName: 'Body', width: 200 },
    { field: 'email-category', headerName: 'Categories', width: 200 },
    {
      field: 'email_status',
      headerName: 'Status',
      width: 200,
      valueGetter: (params) => (params.row.email_status === 0 ? 'No' : 'Yes')
    },
    { field: 'email_created_at', headerName: 'Created At', width: 200 },
    { field: 'email_received_at', headerName: 'Received At', width: 200 },
    { field: 'llm_reply', headerName: 'LLM Reply', width: 200 },
    {
      field: 'final_reply',
      headerName: 'Final Reply',
      width: 200,
      renderCell: (params) => (
        <div
          onDoubleClick={() => {
            setSelectedEmail(params.row);
            setEditedReply(params.value || '');
            setEditDialogOpen(true);
          }}
          style={{ cursor: 'pointer'}}
        >
          {params.value}
        </div>
      )
    },
    { field: 'email_replied_at', headerName: 'Replied At', width: 200 }
  ];

  const getAllGrievances = async () => {
    try {
      setLoadingOverlay(true);
      const { data, error } = await CustomGetApi('/admin/getAllEmails');
      if (!data) toast.error(`Failed! ${error}`);
      else {
        toast.success(`Success! ${data?.msg}`);
        setAllGrievances(data?.allGrievances || []);
      }
    } catch (err) {
      toast.error(`Something Went Wrong! ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  };

  useEffect(() => {
    getAllGrievances();
  }, []);

  const handleSaveEditedReply = async () => {
  if (!selectedEmail?.reply_id) {
    toast.error('Reply ID missing, cannot update reply');
    return;
  }

  try {
    const payload = {
      reply_id: selectedEmail.reply_id,
      final_reply: editedReply
    };

    const response = await CustomPostApi('/reply/saveReply', payload);

    if (response?.data?.success) {
      const updated = allGrievances.map((item) =>
        item.email_token === selectedEmail.email_token
          ? { ...item, final_reply: editedReply }
          : item
      );
      setAllGrievances(updated);
      setEditDialogOpen(false);
      toast.success('Reply updated in DB!');
    } else {
      toast.error('Failed to update reply in DB');
    }
  } catch (err) {
    toast.error(`Error updating reply: ${err.message}`);
  }
};


const handleSubmitReply = async () => {
  if (!selectedEmail?.reply_id) {
    toast.error('Reply ID missing, cannot submit reply');
    return;
  }
  try {
    const payload = {
      reply_id: selectedEmail.reply_id,
      resp_id: selectedEmail.email_token // or selectedEmail.resp_id if you renamed it
    };
    const response = await CustomPostApi('/reply/sendReplyEmail', payload);
    console.log("Reply sent response:", response);
    toast.success('Reply sent!');
    setEditDialogOpen(false);
  } catch (err) {
    toast.error('Failed to send reply');
  }
};


  return (
    <Grid container spacing={gridSpacing}>
      <Toaster position="top-center" reverseOrder={false} />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOverlay}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid item xs={12}>
        <Grid container justifyContent="center" sx={{ mb: 2 }}>
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
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'wheat',
              color: 'black',
              fontWeight: 700
            },
            '& .MuiDataGrid-virtualScrollerRenderZone': {
              backgroundColor: 'white',
              color: 'black'
            }
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </Grid>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Final Reply</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={6}
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditedReply}>Save</Button>
          <Button variant="contained" color="success" onClick={handleSubmitReply}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AllGrievancesView;

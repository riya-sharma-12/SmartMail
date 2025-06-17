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
import {  CustomGetApi, CustomPostApi } from 'api';

const NewEmailsView = () => {
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
const [editedReply, setEditedReply] = useState('');
const [selectedEmail, setSelectedEmail] = useState(null);

    const [allEmails, setallEmails] = useState([]);

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
  field: 'email_created_at',
  headerName: 'Fetched At',
  type: 'dateTime',
  width: 180,
  valueFormatter: (params) => {
    const date = new Date(params.value);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  },
},
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
  },
  sortComparator: (v1, v2) => {
    const clean = (val) =>
      (val ?? '').toString().replace(/^[^a-zA-Z0-9]+/, '').trim().toLowerCase();

    return clean(v1).localeCompare(clean(v2));
  },
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

 const getallEmails = async () => {
  try {
    setLoadingOverlay(true);
    const { data, error } = await CustomGetApi('/admin/getallEmails');

    if (!data) {
      toast.error(`Failed! ${error}`);
    } else {
      toast.success(`Success! ${data?.msg}`);

      const today = new Date().toISOString().slice(0, 10); // e.g., '2025-06-16'

      const filtered = (data?.allEmails || []).filter((email) =>
        email.email_created_at?.startsWith(today)
      );

      setallEmails(filtered);
    }
  } catch (err) {
    toast.error(`Something Went Wrong! ${err}`);
  } finally {
    setLoadingOverlay(false);
  }
};

  useEffect(() => {
    getallEmails();
  }, []);


const handleSaveEditedReply = async () => {
  if (!selectedEmail?.email_token) {
    toast.error('Email Token missing');
    return;
  }

  try {
    const payload = {
      reply_id: selectedEmail?.reply_id ?? null, 
      final_reply: editedReply,
      resp_id: selectedEmail.email_token, 
      org_id: selectedEmail.org_id ?? null 
    };

    const response = await CustomPostApi('/reply/saveReply', payload);

    if (response?.data?.success && response.data.reply_id) {
      const updated = allEmails.map((item) =>
        item.email_token === selectedEmail.email_token
          ? { ...item, final_reply: editedReply, reply_id: response.data.reply_id }
          : item
      );
      setallEmails(updated);
      setSelectedEmail((prev) => ({ ...prev, reply_id: response.data.reply_id }));
      toast.success('Reply saved successfully!');
    } else {
      toast.error('Failed to save reply');
    }
  } catch (err) {
    toast.error(`Error saving reply: ${err.message}`);
  }
};


const handleSubmitReply = async () => {
  if (!selectedEmail?.reply_id) {
    // Try to create reply first
    try {
      const payload = {
        final_reply: editedReply,
        resp_id: selectedEmail.email_token,
        org_id: selectedEmail.org_id ?? null
      };
      const saveResponse = await CustomPostApi('/reply/saveReply', payload);

      if (saveResponse?.data?.success && saveResponse.data.reply_id) {
        selectedEmail.reply_id = saveResponse.data.reply_id; // update local object
        setSelectedEmail({ ...selectedEmail }); // trigger re-render
      } else {
        toast.error('Failed to create reply before sending');
        return;
      }
    } catch (err) {
      toast.error(`Failed to auto-create reply: ${err.message}`);
      return;
    }
  }

  try {
    const payload = {
      reply_id: selectedEmail.reply_id,
      resp_id: selectedEmail.email_token
    };

    const response = await CustomPostApi('/reply/sendReplyEmail', payload);

    if (response?.status === 200 || response?.data) {
      const updated = allEmails.map((item) =>
        item.reply_id === selectedEmail.reply_id
          ? { ...item, email_status: 1 }
          : item
      );
      setallEmails(updated);
      toast.success('Reply sent!');
      setEditDialogOpen(false);
    } else {
      toast.error('Failed to send reply');
    }
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
          rows={allEmails}
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
          <Button variant="contained" color="success" onClick={handleSubmitReply}>Send Reply</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default NewEmailsView;

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
    { field: 'email_created_at', headerName: 'Created At', type:'date', width: 135, valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      } },
     { field: 'email_received_at', headerName: 'Received At', type:'date', width: 135, valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      } },
//   {
//   field: 'llm_reply',
//   headerName: 'LLM Reply',
//   width: 200,
//   // sortingOrder: ['asc', 'desc'], // Optional, but helps toggle both directions
//   sortComparator: (v1, v2) => {
//     const clean = (val) =>
//       (val || '')
//         .toString()
//         .trim()
//         .replace(/^[^a-zA-Z0-9]+/, '')
//         .toLowerCase();

//     const a = clean(v1);
//     const b = clean(v2);

//     // Null or empty values should always come LAST (bottom), regardless of direction
//     const isEmpty = (str) => !str || str.length === 0;

//     if (isEmpty(a) && !isEmpty(b)) return 1;
//     if (!isEmpty(a) && isEmpty(b)) return -1;
//     if (isEmpty(a) && isEmpty(b)) return 0;

//     return a.localeCompare(b);
//   }
// }
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
  type: 'date',
  width: 135,
  valueFormatter: (params) => {
    const value = params?.value;
    return value ? new Date(value).toLocaleDateString() : '';
  }
}
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
      toast.success('Reply updated in DB!');
    } else {
      toast.error('Failed to update reply in DB');
    }
  } catch (err) {
    toast.error(`Error updating reply: ${err.message}`);
  }
};


// const handleSubmitReply = async () => {
//   if (!selectedEmail?.reply_id) {
//     toast.error('Reply ID missing, cannot submit reply');
//     return;
//   }
//   try {
//     const payload = {
//       reply_id: selectedEmail.reply_id,
//       resp_id: selectedEmail.email_token // or selectedEmail.resp_id if you renamed it
//     };
//     const response = await CustomPostApi('/reply/sendReplyEmail', payload);
//     console.log("Reply sent response:", response);
//     toast.success('Reply sent!');
//     setEditDialogOpen(false);
//   } catch (err) {
//     toast.error('Failed to send reply');
//   }
// };


const handleSubmitReply = async () => {
  if (!selectedEmail?.reply_id) {
    toast.error('Reply ID missing, cannot submit reply');
    return;
  }

  try {
    const payload = {
      reply_id: selectedEmail.reply_id,
      resp_id: selectedEmail.email_token
    };

    const response = await CustomPostApi('/reply/sendReplyEmail', payload);
    console.log("Reply sent response:", response);

    // ✅ Accept a successful HTTP status code even if 'success' field is missing
    if (response?.status === 200 || response?.data) {
      const updated = allGrievances.map((item) =>
        item.reply_id === selectedEmail.reply_id
          ? { ...item, email_status: 1 }
          : item
      );
      setAllGrievances(updated);
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
          <Button variant="contained" color="success" onClick={handleSubmitReply}>Send Reply</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AllGrievancesView;

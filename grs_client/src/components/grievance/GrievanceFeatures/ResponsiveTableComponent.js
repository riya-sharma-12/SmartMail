import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const ResponsiveTableComponent = ({ rows, columns, onRowClick }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      autoHeight
      //disableColumnFilter
      onRowClick={onRowClick}
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
    />
  );
};

export default ResponsiveTableComponent;

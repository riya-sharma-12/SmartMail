import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';

const ResponsiveTableComponent = ({ title, rows, columns, pageSize, onRowClick }) => {
    return (
        <Grid item sm={12} xs={12}>
            {title && (
                <Typography variant='h2' textAlign={"center"} sx={{my:4}}>{title}</Typography>
            )}
            <DataGrid
                rows={rows}
                columns={columns}
                // getRowId={(row) => row.rowId}
                pageSize={pageSize}
                loading={rows.length === 0}
                getRowHeight={() => 'auto'}
                checkboxSelection
                //disableRowSelectionOnClick
                onRowClick={onRowClick ? onRowClick() : () => null}
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
            //onRowSelectionModelChange={handleSelectionModelChange ? handleSelectionModelChange() : () => null}
            //rowSelectionModel={rowSelectionModel ? rowSelectionModel() : () => null}
            />
        </Grid>
    );
};

export default ResponsiveTableComponent;
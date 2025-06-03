import React from "react";
import { Grid, Divider, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const CommonReportTable = ({ rows, columns, title }) => {
    return (
        <Grid>
            <Grid item xs={12}>
                <Divider />
                <Typography variant="h2" align="center" bgcolor="wheat" sx={{ paddingBlock: 1 }}>
                    {title}
                </Typography>
                <Divider />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
                <div style={{ height: 300, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        getRowHeight={()=>'auto'}
                        rowSpacingType="border"
                        checkboxSelection
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#eef2f6",
                                color: "black",
                                fontWeight: 700,
                            },
                            "& .MuiDataGrid-virtualScrollerRenderZone": {
                                backgroundColor: "white",
                                color: "black",
                                fontWeight:500
                            },
                        }}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default CommonReportTable;

import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import GrievanceChartCard from './GrievanceChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import { calculateGrievancePercentageChange } from 'views/utilities/Functions/CommonFunc';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //



const PopularCard = ({ isLoading, grievanceYearlyStats, currentYearGrie, previousYearGrie }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();


  const [anchorEl, setAnchorEl] = useState(null);

  const GrievanceArrowUpDown = {
    "0": <Grid item>
      <Avatar
        variant="rounded"
        sx={{
          width: 16,
          height: 16,
          borderRadius: '5px',
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.dark,
          ml: 2
        }}
      >
        <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
      </Avatar>
    </Grid>,
    "1": <Grid item>
      <Avatar
        variant="rounded"
        sx={{
          width: 16,
          height: 16,
          borderRadius: '5px',
          backgroundColor: theme.palette.orange.light,
          color: theme.palette.orange.dark,
          ml: 2
        }}
      >
        <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
      </Avatar>
    </Grid>
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">Grievances Analytics of {currentYear} Compared by Last Year</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary[200],
                        cursor: 'pointer'
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      {/* <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem> */}
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <GrievanceChartCard grievanceYearlyStats={grievanceYearlyStats} currentYearGrie={currentYearGrie} previousYearGrie={previousYearGrie} />
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Grievances
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {currentYearGrie && previousYearGrie ? parseInt(currentYearGrie?.total_grievance) - parseInt(previousYearGrie?.total_grievance) : "NAN"}
                            </Typography>
                          </Grid>
                          {
                            currentYearGrie && previousYearGrie &&
                              parseInt(currentYearGrie?.total_grievance) > parseInt(previousYearGrie?.total_grievance) ? GrievanceArrowUpDown["0"] :
                              parseInt(currentYearGrie?.total_grievance) < parseInt(previousYearGrie?.total_grievance) ? GrievanceArrowUpDown["1"] :
                                parseInt(currentYearGrie?.total_query_resolved) == parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["0"]
                                  : "NAN"
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                    {calculateGrievancePercentageChange(currentYearGrie?.total_grievance, previousYearGrie?.total_grievance)}% {currentYearGrie && previousYearGrie && parseInt(currentYearGrie?.total_grievance) > parseInt(previousYearGrie?.total_grievance) ? "Increased" : "Less"}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Complains
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {currentYearGrie && previousYearGrie ? parseInt(currentYearGrie?.total_complains) - parseInt(previousYearGrie?.total_complains) : "NAN"}
                            </Typography>
                          </Grid>
                          {
                            currentYearGrie && previousYearGrie &&
                              parseInt(currentYearGrie?.total_complains) > parseInt(previousYearGrie?.total_complains) ? GrievanceArrowUpDown["0"] :
                              parseInt(currentYearGrie?.total_complains) < parseInt(previousYearGrie?.total_complains) ? GrievanceArrowUpDown["1"] :
                                parseInt(currentYearGrie?.total_query_resolved) == parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["0"]
                                  : "NAN"
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                      {calculateGrievancePercentageChange(currentYearGrie?.total_complains, previousYearGrie?.total_complains)}% {currentYearGrie && previousYearGrie && parseInt(currentYearGrie?.total_complains) > parseInt(previousYearGrie?.total_query) ? "Increased" : "Less"}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Querys
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {currentYearGrie && previousYearGrie ? parseInt(currentYearGrie?.total_query) - parseInt(previousYearGrie?.total_query) : "NAN"}
                            </Typography>
                          </Grid>
                          {
                            currentYearGrie && previousYearGrie &&
                              parseInt(currentYearGrie?.total_query) > parseInt(previousYearGrie?.total_query) ? GrievanceArrowUpDown["0"] :
                              parseInt(currentYearGrie?.total_query) < parseInt(previousYearGrie?.total_query) ? GrievanceArrowUpDown["1"] :
                                parseInt(currentYearGrie?.total_query_resolved) == parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["0"]
                                  : "NAN"
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                      {calculateGrievancePercentageChange(currentYearGrie?.total_query, previousYearGrie?.total_query)}% {currentYearGrie && previousYearGrie && parseInt(currentYearGrie?.total_query) > parseInt(previousYearGrie?.total_query) ? "Increased" : "Less"}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Complains Resolved
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {currentYearGrie && previousYearGrie ? parseInt(currentYearGrie?.total_complains_resolved) - parseInt(previousYearGrie?.total_complains_resolved) : "NAN"}
                            </Typography>
                          </Grid>
                          {
                            currentYearGrie && previousYearGrie &&
                              parseInt(currentYearGrie?.total_complains_resolved) > parseInt(previousYearGrie?.total_complains_resolved) ? GrievanceArrowUpDown["0"] :
                              parseInt(currentYearGrie?.total_complains_resolved) < parseInt(previousYearGrie?.total_complains_resolved) ? GrievanceArrowUpDown["1"] :
                                parseInt(currentYearGrie?.total_query_resolved) == parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["0"]
                                  : "NAN"
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                      {calculateGrievancePercentageChange(currentYearGrie?.total_complains_resolved, previousYearGrie?.total_complains_resolved)}% {currentYearGrie && previousYearGrie && parseInt(currentYearGrie?.total_complains_resolved) > parseInt(previousYearGrie?.total_complains_resolved) ? "Increased" : "Less"}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Querys Resolved
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {currentYearGrie && previousYearGrie ? parseInt(currentYearGrie?.total_query_resolved) - parseInt(previousYearGrie?.total_query_resolved) : "NAN"}
                            </Typography>
                          </Grid>
                          {
                            currentYearGrie && previousYearGrie &&
                              parseInt(currentYearGrie?.total_query_resolved) > parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["0"] :
                              parseInt(currentYearGrie?.total_query_resolved) < parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["1"] :
                                parseInt(currentYearGrie?.total_query_resolved) == parseInt(previousYearGrie?.total_query_resolved) ? GrievanceArrowUpDown["0"]
                                  : "NAN"
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                      {calculateGrievancePercentageChange(currentYearGrie?.total_query_resolved, previousYearGrie?.total_query_resolved)}% {currentYearGrie && previousYearGrie && parseInt(currentYearGrie?.total_query_resolved) > parseInt(previousYearGrie?.total_query_resolved) ? "Increased" : "Less"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              {/* View All */}
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;

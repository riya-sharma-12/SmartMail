import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';
import { calculateGrievancePercentageChange } from 'views/utilities/Functions/CommonFunc';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const GrievanceChartCard = ({ grievanceYearlyStats, currentYearGrie, previousYearGrie }) => {
  const theme = useTheme();
  const currentMonth = new Date().getMonth() + 1;
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const orangeDark = theme.palette.secondary[800];



  useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: {
        theme: 'light'
      }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart);
  }, [navType, orangeDark]);

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                Grievance
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
                {
                  grievanceYearlyStats ? grievanceYearlyStats.map((item) => (
                    item?.month == currentMonth ? item?.total_grievance : 0
                  ))
                    : 0
                }
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {grievanceYearlyStats?.length > 0 && (
            <Typography variant="subtitle2" sx={{ color: theme.palette.grey[800] }}>
              {calculateGrievancePercentageChange(currentYearGrie?.total_grievance, previousYearGrie?.total_grievance)}% {currentYearGrie && previousYearGrie && parseInt(currentYearGrie?.total_grievance) > parseInt(previousYearGrie?.total_grievance) ? "Increased" : "Less"}
            </Typography>

          )}
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default GrievanceChartCard;

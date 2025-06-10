// material-ui
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalGrievanceBarChart = ({ emailData }) => {
  const theme = useTheme();

  const categoryCounts = {
    'top-priority': 0,
    'less-priority': 0,
    'spam': 0
  };

  emailData.forEach(email => {
    const category = email['email-category'];
    if (categoryCounts.hasOwnProperty(category)) {
      categoryCounts[category]++;
    }
  });

  const labels = Object.keys(categoryCounts).map(label =>
    label.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Email Count',
        data: Object.values(categoryCounts),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main
        ],
        borderRadius: 4,
        maxBarThickness: 130,
        barPercentage: 0.8,     // Slightly broaden bars
              }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: theme.palette.text.secondary,
          font: { size: 12 }
        },
        grid: {
          color: theme.palette.divider,
          borderDash: [3, 3]
        }
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          font: { size: 12 }
        },
        grid: { display: false }
      }
    }
  };

  return (
    <Card
      sx={{
        height: 500, // Increased height for more vertical length
        width: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Email Categories Overview
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          flexGrow: 1,
          px: 2,
          pt: 0,
          position: 'relative',
          height: '100%'
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </CardContent>
    </Card>
  );
};

export default TotalGrievanceBarChart;

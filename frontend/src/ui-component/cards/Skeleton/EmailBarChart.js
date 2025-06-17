// material-ui
import { Card, CardContent, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmailBarChart = ({ emailData }) => {
  // Count emails per category
  const categoryCounts = {
    'top-priority': 0,
    'less-priority': 0,
    'spam': 0
  };

  emailData.forEach(email => {
    const category = email.category;
    if (categoryCounts[category] !== undefined) {
      categoryCounts[category]++;
    }
  });

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Email Count',
        data: Object.values(categoryCounts),
        backgroundColor: ['#1976d2', '#9c27b0', '#f44336'], // Blue, Purple, Red
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Email Category Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Email Categories Overview
        </Typography>
        <Bar data={chartData} options={chartOptions} />
      </CardContent>
    </Card>
  );
};

export default EmailBarChart;

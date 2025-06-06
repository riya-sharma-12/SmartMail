// ===========================|| DASHBOARD - MONTHLY MAIL COUNT CHART ||=========================== //



const chartData = {
  type: 'line',
  height: 350, // Increased height for better axis visibility
  options: {
    chart: {
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], // Add more months as needed
      title: {
        text: 'Month'
      },
      labels: {
        style: {
          colors: '#fff'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Number of Mails'
      },
      labels: {
        style: {
          colors: '#fff'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: true
      },
      y: {
        title: {
          formatter: () => 'Mails'
        }
      },
      marker: {
        show: true
      }
    }
  },
  series: [
    {
      name: 'Mails per Month',
      data: [45, 66, 41, 89, 25, 44, 9, 54] // These are sample mail counts for Jan–Aug
    }
  ]
};

export default chartData;

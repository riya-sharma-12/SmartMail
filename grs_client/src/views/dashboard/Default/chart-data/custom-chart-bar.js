// ===========================|| DASHBOARD - MONTHLY MAIL COUNT CHART ||=========================== //



const CustomChartData = (title, seriesName, categories, data) => {
    console.log("check --", title, categories, data)
    return {
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
      categories: categories, // Add more months as needed
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
        text: title
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
      name: seriesName,
      data: data // These are sample mail counts for Jan–Aug
    }
  ]
    };
};

export default CustomChartData;

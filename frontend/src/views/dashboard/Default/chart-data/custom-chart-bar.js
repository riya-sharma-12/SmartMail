// ===========================|| DASHBOARD - MONTHLY MAIL COUNT CHART ||=========================== //



const CustomChartData = (title, xAxisLabel, seriesName, categories, data) => {
    console.log("check --", title, categories, data);

  const safeData = Array.isArray(data) ? data : [];
  const maxVal = Math.max(...safeData, 10);

  // Choose step size based on range
  let step = 10;
  if (maxVal > 50 && maxVal <= 100) step = 20;
  else if (maxVal > 100 && maxVal <= 200) step = 50;
  else if (maxVal > 200) step = 100;

  const roundedMax = Math.ceil(maxVal / step) * step;
  const tickAmount = Math.ceil(roundedMax / step);

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
        text: xAxisLabel
      },
      labels: {
        style: {
          colors: '#fff'
        }
      },
      tooltip: {
    enabled: false  // ✅ This disables the mini floating x-label
  }
    },
     yaxis: {
        min: 0,
        max: roundedMax,
        tickAmount: tickAmount,
        title: { text: title },
        labels: { style: { colors: '#fff' } }
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
        data: safeData
      }
    ]
    };
};

export default CustomChartData;

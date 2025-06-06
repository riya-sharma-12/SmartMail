import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { CustomGetApi } from 'api';

const ChartDataYear = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartCounts, setChartCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await CustomGetApi('/admin/getAllEmails');
        if (error) {
          console.error('API error:', error);
          setLoading(false);
          return;
        }
        const emails = data?.allGrievances || [];

        if (!emails.length) {
  setChartLabels([]);
  setChartCounts([]);
  return;
}

        const emailCountsByDate = {};
        emails.forEach(email => {
          const date = new Date(email.created_at);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
          emailCountsByDate[formattedDate] = (emailCountsByDate[formattedDate] || 0) + 1;
        });

        const sortedDates = Object.keys(emailCountsByDate).sort((a, b) => {
          const parse = str => {
            const [day, mon] = str.split(' ');
            const monthIndex = new Date(`${mon} 1, 2000`).getMonth();
            return new Date(2024, monthIndex, parseInt(day));
          };
          return parse(a) - parse(b);
        });

        setChartLabels(sortedDates);
        setChartCounts(sortedDates.map(date => emailCountsByDate[date]));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading chart...</div>;


  const chartData = {
    type: 'line',
    height: 90,
    options: {
      chart: {
        sparkline: { enabled: true }
      },
      dataLabels: { enabled: false },
      colors: ['#fff'],
      fill: { type: 'solid', opacity: 1 },
      stroke: { curve: 'smooth', width: 3 },
      tooltip: {
        theme: 'dark',
        fixed: { enabled: false },
        x: { show: true },
        y: { title: { formatter: () => 'Emails' } },
        marker: { show: false }
      },
      xaxis: {
        categories: chartLabels,
        labels: {
          style: { colors: '#fff' }
        }
      },
      yaxis: {
        min: 0,
        labels: {
          style: { colors: '#fff' }
        }
      }
    },
    series: [{
      name: 'Emails',
      data: chartCounts
    }]
  };

  return <Chart {...chartData} />;
};

export default ChartDataYear;

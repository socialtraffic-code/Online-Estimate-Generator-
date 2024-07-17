import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Estimate } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EstimateChartProps {
  estimates: Estimate[];
}

const EstimateChart: React.FC<EstimateChartProps> = ({ estimates }) => {
  const totalEstimates = estimates.length;
  const acceptedEstimates = estimates.filter(est => est.status === 'Accepted').length;
  const declinedEstimates = estimates.filter(est => est.status === 'Declined').length;
  const pendingEstimates = estimates.filter(est => est.status === 'Pending').length;

  const data = {
    labels: ['Total', 'Accepted', 'Declined', 'Pending'],
    datasets: [
      {
        label: 'Estimates',
        data: [totalEstimates, acceptedEstimates, declinedEstimates, pendingEstimates],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Correcting the type issue here
      },
      title: {
        display: true,
        text: 'Estimate Status Overview',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default EstimateChart;

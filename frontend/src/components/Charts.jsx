import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export const StatusBarChart = ({ dataMap }) => {
  const labels = Object.keys(dataMap || {});
  const values = Object.values(dataMap || {});

  const data = {
    labels,
    datasets: [
      {
        label: 'Applications',
        data: values,
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Saved (Indigo)
          'rgba(59, 130, 246, 0.8)', // Applied (Blue)
          'rgba(245, 158, 11, 0.8)', // Under Review (Amber)
          'rgba(16, 185, 129, 0.8)', // Approved (Emerald)
          'rgba(244, 63, 94, 0.8)',  // Rejected (Rose)
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export const CategoryDoughnutChart = ({ categories }) => {
  const labels = (categories || []).map((c) => c._id || 'Unknown');
  const counts = (categories || []).map((c) => c.count || 0);

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ec4899',
          '#8b5cf6',
          '#06b6d4',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 14, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export const StateDistributionChart = ({ states }) => {
  const labels = (states || []).map((s) => s._id || 'Other');
  const values = (states || []).map((s) => s.count || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Registered Students',
        data: values,
        backgroundColor: 'rgba(79, 70, 229, 0.85)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { stepSize: 1 },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

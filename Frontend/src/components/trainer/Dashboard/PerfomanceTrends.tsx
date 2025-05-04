import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const PerformanceTrends = () => {
  const [currentChart, setCurrentChart] = useState('revenue');

  const chartData = {
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      dataset: [1200, 1350, 1400, 1280],
      color: '#6366f1',
      label: 'Revenue ($)',
    },
    reviews: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      dataset: [4.2, 4.5, 4.7, 4.8],
      color: '#10b981',
      label: 'Rating (out of 5)',
    },
    clients: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      dataset: [12, 18, 22, 24],
      color: '#f59e0b',
      label: 'New Clients',
    },
  };

  const data = {
    labels: chartData[currentChart].labels,
    datasets: [
      {
        label: chartData[currentChart].label,
        data: chartData[currentChart].dataset,
        borderColor: chartData[currentChart].color,
        backgroundColor: `${chartData[currentChart].color}33`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartData[currentChart].color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartData[currentChart].color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#b0b0b0',
          callback: (value) => (currentChart === 'revenue' ? `$${value}` : value),
        },
        grid: { color: '#2c2c2c' },
      },
      x: {
        ticks: { color: '#b0b0b0' },
        grid: { color: '#2c2c2c' },
      },
    },
    plugins: {
      legend: { labels: { color: '#ffffff' } },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2c2c2c',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            if (currentChart === 'revenue') return `Revenue: $${context.parsed.y}`;
            if (currentChart === 'reviews') return `Rating: ${context.parsed.y}/5`;
            return `Clients: ${context.parsed.y}`;
          },
        },
      },
    },
    animation: { duration: 1000, easing: 'easeInOutQuart' },
  };

  return (
    <Card className="bg-[#1e1e1e] border-[#2c2c2c] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)] mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-[#6366f1]">Performance Trends</CardTitle>
          <div className="flex gap-2">
            {['revenue', 'reviews', 'clients'].map((chart) => (
              <Button
                key={chart}
                variant={currentChart === chart ? 'default' : 'outline'}
                className={`${
                  currentChart === chart
                    ? 'bg-[#6366f1] text-white border-[#6366f1]'
                    : 'bg-[#121212] text-[#b0b0b0] border-[#2c2c2c] hover:bg-[#6366f1]/10 hover:text-[#6366f1]'
                } text-sm`}
                onClick={() => setCurrentChart(chart)}
              >
                {chart.charAt(0).toUpperCase() + chart.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrends;
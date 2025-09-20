import { useEffect, useState } from 'react';
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
  ChartOptions,
  TooltipItem,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const PerformanceTrends = () => {
  const [currentChart, setCurrentChart] = useState<'sessions' | 'activeClients' | 'clients'>('sessions');

  const [labels, setLabels] = useState<string[]>(['Jan', 'Feb', 'Mar', 'Apr']);
  const [series, setSeries] = useState<{ sessions: number[]; activeClients: number[]; clients: number[] }>({ sessions: [0,0,0,0], activeClients: [0,0,0,0], clients: [0,0,0,0] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await (await import('@/services/implementation/trainerServices')).TrainerService.getDashboardTrends();
        if (!mounted) return;
        setLabels(res.labels);
        setSeries({ sessions: res.sessions, activeClients: res.activeClients, clients: res.newClients });
      } catch {
        // toast handled in service
      }
    })();
    return () => { mounted = false; };
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: currentChart === 'sessions' ? 'Sessions' : currentChart === 'activeClients' ? 'Active Clients' : 'New Clients',
        data: currentChart === 'sessions' ? series.sessions : currentChart === 'activeClients' ? series.activeClients : series.clients,
        borderColor: currentChart === 'sessions' ? '#6366f1' : currentChart === 'activeClients' ? '#10b981' : '#f59e0b',
        backgroundColor: `${currentChart === 'sessions' ? '#6366f1' : currentChart === 'activeClients' ? '#10b981' : '#f59e0b'}33`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: currentChart === 'sessions' ? '#6366f1' : currentChart === 'activeClients' ? '#10b981' : '#f59e0b',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: currentChart === 'sessions' ? '#6366f1' : currentChart === 'activeClients' ? '#10b981' : '#f59e0b',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#b0b0b0',
          callback: (value: number | string) => value as string | number,
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
          label: (context: TooltipItem<'line'>) => {
            if (currentChart === 'sessions') return `Sessions: ${context.parsed.y}`;
            if (currentChart === 'activeClients') return `Active Clients: ${context.parsed.y}`;
            return `New Clients: ${context.parsed.y}`;
          },
        },
      },
    },
    animation: { duration: 1000, easing: 'easeInOutQuart' as const },
  };

  return (
    <Card className="bg-[#1e1e1e] border-[#2c2c2c] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)] mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-[#6366f1]">Performance Trends</CardTitle>
          <div className="flex gap-2">
            {(['sessions', 'activeClients', 'clients'] as const).map((chart) => (
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
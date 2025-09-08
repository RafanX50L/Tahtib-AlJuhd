import { useEffect, useState } from 'react';
import { ProgressService } from '@/services/progress.service';

type Summary = {
  data: {
    streaks: { daily: number; weekly: number };
    health: { latestWeight: number | null; latestBmi: number | null };
  }
};

const SummaryCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
  <div className="bg-[#1A1F2D] rounded-xl p-4 border border-[#2A3145]">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
    {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

const ProgressSummary = () => {
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(0);
  const [weekly, setWeekly] = useState(0);
  const [bmi, setBmi] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [summary, weightSeries] = await Promise.all([
          ProgressService.getSummary() as Promise<Summary>,
          ProgressService.listHealth({ metricType: 'weight', limit: 1 }) as Promise<{ data: Array<{ value: number }> }>,
        ]);
        if (!mounted) return;
        setDaily(summary?.data?.streaks?.daily ?? 0);
        setWeekly(summary?.data?.streaks?.weekly ?? 0);
        setBmi(summary?.data?.health?.latestBmi ?? null);
        const latestWeight = weightSeries?.data?.[0]?.value ?? null;
        setWeight(latestWeight);
      } catch {
        // no-op
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="bg-[#1A1F2D] rounded-xl p-4 border border-[#2A3145]">Loading progress...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard title="Daily Streak" value={`${daily} days`} subtitle="Keep it going!" />
      <SummaryCard title="Weekly Streak" value={`${weekly} weeks`} subtitle="Consistency pays off" />
      <SummaryCard title="Latest BMI" value={bmi !== null ? bmi.toFixed(1) : '—'} subtitle="Updated recently" />
      <SummaryCard title="Latest Weight" value={weight !== null ? `${weight} kg` : '—'} subtitle="Track weekly" />
    </div>
  );
};

export default ProgressSummary;



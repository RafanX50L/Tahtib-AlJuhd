import { useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/client/Sidebar';
import CFooter from '@/components/client/Footer';
import Header, { SidebarRef } from '@/components/client/Header';
import styles from '@/components/client/Personalization/styles/BasicDetails.module.css';
import ProgressSummary from '@/components/client/Dashboard/ProgressSummary';
import { ProgressService } from '@/services/progress.service';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type MetricRow = { value: number; recordedAt: string };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-[#1A1F2D] rounded-xl p-4 border border-[#2A3145]">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </section>
);

const CProgress = () => {
  const sidebarRef = useRef<SidebarRef>(null);
  const [bmiRows, setBmiRows] = useState<MetricRow[]>([]);
  const [weightRows, setWeightRows] = useState<MetricRow[]>([]);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newHeartRate, setNewHeartRate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  type RecentDay = { updatedAt: string; weekKey: string; dayKey: string; status: 'in_progress'|'completed'; completionPercentage: number };
  const [recentDays, setRecentDays] = useState<RecentDay[]>([]);

  const handleMenuToggle = () => {
    sidebarRef.current?.toggleSidebar();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [bmiRes, weightRes, recentRes] = await Promise.all([
          ProgressService.listHealth({ metricType: 'bmi', limit: 30 }),
          ProgressService.listHealth({ metricType: 'weight', limit: 30 }),
          ProgressService.listRecentWorkoutDays({ limit: 10 }),
        ]);
        if (!mounted) return;
        setBmiRows((bmiRes?.data || []).map((r: { value: number; recordedAt: string }) => ({ value: r.value, recordedAt: r.recordedAt })));
        setWeightRows((weightRes?.data || []).map((r: { value: number; recordedAt: string }) => ({ value: r.value, recordedAt: r.recordedAt })));
        const recentData: RecentDay[] = (recentRes && (recentRes as { data: RecentDay[] }).data) || [];
        setRecentDays(recentData);
      } catch {
        // no-op
      }
    })();
    return () => { mounted = false; };
  }, []);

  const submitWeight = async () => {
    if (!newWeight) return;
    setSubmitting(true);
    try {
      await ProgressService.recordHealth({ metricType: 'weight', value: parseFloat(newWeight) });
      const res = await ProgressService.listHealth({ metricType: 'weight', limit: 30 });
      setWeightRows((res?.data || []).map((r: { value: number; recordedAt: string }) => ({ value: r.value, recordedAt: r.recordedAt })));
      setNewWeight('');
    } finally {
      setSubmitting(false);
    }
  };

  const submitHeartRate = async () => {
    if (!newHeartRate) return;
    setSubmitting(true);
    try {
      await ProgressService.recordHealth({ metricType: 'heart_rate', value: parseFloat(newHeartRate) });
      setNewHeartRate('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar ref={sidebarRef} />
      <main className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all duration-300 ${styles.container}`}>
        <Header title="Progress" content="Your streaks and health metrics" onMenuToggle={handleMenuToggle} />

        <div className="space-y-8">
          <ProgressSummary />

          <Section title="Record Metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Weight (kg)</label>
                <div className="mt-1 flex gap-2">
                  <input value={newWeight} onChange={e => setNewWeight(e.target.value)} className="bg-[#12151E] border border-[#2A3145] rounded px-3 py-2 w-full" placeholder="e.g., 74.5" />
                  <button disabled={submitting} onClick={submitWeight} className="bg-[#4CAF50] px-4 rounded disabled:opacity-50">Save</button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Heart Rate (bpm)</label>
                <div className="mt-1 flex gap-2">
                  <input value={newHeartRate} onChange={e => setNewHeartRate(e.target.value)} className="bg-[#12151E] border border-[#2A3145] rounded px-3 py-2 w-full" placeholder="e.g., 72" />
                  <button disabled={submitting} onClick={submitHeartRate} className="bg-[#4CAF50] px-4 rounded disabled:opacity-50">Save</button>
                </div>
              </div>
            </div>
          </Section>

          <Section title="BMI (last 30 records)">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">BMI</th>
                  </tr>
                </thead>
                <tbody>
                  {bmiRows.map((r, idx) => (
                    <tr key={idx} className="border-t border-[#2A3145]">
                      <td className="py-2">{new Date(r.recordedAt).toLocaleDateString()}</td>
                      <td className="py-2">{r.value.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bmiRows.length > 1 && (
              <div className="mt-4">
                <Line
                  data={{
                    labels: bmiRows.slice().reverse().map(r => new Date(r.recordedAt).toLocaleDateString()),
                    datasets: [{
                      label: 'BMI',
                      data: bmiRows.slice().reverse().map(r => r.value),
                      borderColor: '#4CAF50',
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      tension: 0.4,
                      fill: true,
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
              </div>
            )}
          </Section>

          <Section title="Weight (last 30 records)">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {weightRows.map((r, idx) => (
                    <tr key={idx} className="border-t border-[#2A3145]">
                      <td className="py-2">{new Date(r.recordedAt).toLocaleDateString()}</td>
                      <td className="py-2">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Recent Workout Days">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="py-2">Updated</th>
                    <th className="py-2">Week</th>
                    <th className="py-2">Day</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDays.map((d, idx) => (
                    <tr key={idx} className="border-top border-[#2A3145]">
                      <td className="py-2">{new Date(d.updatedAt).toLocaleString()}</td>
                      <td className="py-2">{d.weekKey}</td>
                      <td className="py-2">{d.dayKey}</td>
                      <td className="py-2 capitalize">{d.status}</td>
                      <td className="py-2">{d.completionPercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <CFooter />
        </div>
      </main>
    </div>
  );
};

export default CProgress;



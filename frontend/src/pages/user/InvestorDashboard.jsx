import { useFetch } from '../../hooks/useFetch';
import { getAnalytics, getRecommendations } from '../../utils/api';
import { LoadingSpinner, ErrorState } from '../../components/dashboard/States';
import { formatCurrency, scoreColor } from '../../utils/helpers';
import { DollarSign, TrendingUp, Clock, Shield, Zap, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis,
} from 'recharts';

const tt = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, itemStyle: { color: '#94a3b8' } };

export default function InvestorDashboard() {
  const { data, loading, error, refetch } = useFetch(getAnalytics);
  const { data: recData } = useFetch(() => getRecommendations({ limit: 100 }));

  if (loading) return <LoadingSpinner text="Loading investment intelligence..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { investmentRanking = [], summary } = data?.data || {};
  const recs = recData?.data || [];

  const highPotential = recs.filter(r => r.roiCategory === 'High Potential');
  const avgROI = investmentRanking.length
    ? Math.round(investmentRanking.reduce((s, r) => s + (r.estimatedROI || 0), 0) / investmentRanking.length)
    : 0;
  const fastestPayback = investmentRanking.length
    ? Math.min(...investmentRanking.map(r => r.paybackPeriodMonths || 99))
    : 0;

  // Top 8 by ROI for chart
  const roiChart = [...investmentRanking]
    .sort((a, b) => b.estimatedROI - a.estimatedROI)
    .slice(0, 8);

  // Risk vs ROI scatter
  const scatterData = recs
    .filter(r => r.estimatedROI && r.demandScore)
    .slice(0, 30)
    .map(r => ({ x: r.demandScore, y: r.estimatedROI, z: r.estimatedCost / 10000, name: r.locationId?.name }));

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-green-500/10 to-ev-dark-card border-green-500/20">
        <div className="flex items-center gap-3">
          <TrendingUp size={28} className="text-green-400" />
          <div>
            <h2 className="text-white font-bold text-lg">EV Investment Intelligence Hub</h2>
            <p className="text-ev-gray text-sm">Identify profitable EV charging opportunities across Nigeria</p>
          </div>
        </div>
      </div>

      {/* Investment KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'High Potential Sites', value: highPotential.length, icon: Zap, color: 'text-green-400', sub: 'ROI ≥ 25% annually' },
          { label: 'Avg Annual ROI', value: `${avgROI}%`, icon: TrendingUp, color: 'text-blue-400', sub: 'Across all sites' },
          { label: 'Fastest Payback', value: `${fastestPayback}mo`, icon: Clock, color: 'text-amber-400', sub: 'Best location' },
          { label: 'Total Opportunity', value: formatCurrency(summary?.totalEstimatedInvestment ?? 0), icon: DollarSign, color: 'text-purple-400', sub: 'Market size' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-current/10 shrink-0 ${color}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-ev-gray text-xs uppercase tracking-wide">{label}</p>
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-ev-gray/60 text-xs">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ROI Chart + Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-white font-semibold mb-4">Top ROI Locations</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={roiChart} layout="vertical" margin={{ top: 0, right: 30, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
              <Tooltip {...tt} formatter={v => [`${v}%`, 'Annual ROI']} />
              <Bar dataKey="estimatedROI" radius={[0, 4, 4, 0]}>
                {roiChart.map((r, i) => <Cell key={i} fill="#22c55e" fillOpacity={1 - i * 0.08} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-1">Demand vs ROI Analysis</h3>
          <p className="text-ev-gray text-xs mb-3">Higher demand score → higher ROI potential. Bubble size = investment cost.</p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="x" name="Demand Score" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Demand', position: 'insideBottom', fill: '#64748b', fontSize: 10 }} />
              <YAxis dataKey="y" name="ROI %" tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
              <ZAxis dataKey="z" range={[40, 200]} />
              <Tooltip {...tt} cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => n === 'ROI %' ? `${v}%` : v} />
              <Scatter data={scatterData} fill="#0ea5e9" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investment Ranking Table */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BarChart2 size={16} className="text-green-400" /> Investment Rankings — Top Opportunities
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ev-gray text-xs uppercase border-b border-ev-dark-border">
                <th className="text-left pb-2">#</th>
                <th className="text-left pb-2">Location</th>
                <th className="text-left pb-2">City</th>
                <th className="text-right pb-2">Demand</th>
                <th className="text-right pb-2">Annual ROI</th>
                <th className="text-right pb-2">Investment</th>
                <th className="text-right pb-2">Payback</th>
                <th className="text-right pb-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {investmentRanking.slice(0, 10).map((r, i) => (
                <tr key={i} className="border-b border-ev-dark-border/40 hover:bg-ev-dark-border/20">
                  <td className="py-2.5 text-ev-gray font-mono">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-2.5 text-white font-medium">{r.name}</td>
                  <td className="py-2.5 text-ev-gray">{r.city}</td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: scoreColor(r.demandScore) }}>{r.demandScore}</td>
                  <td className="py-2.5 text-right text-green-400 font-mono font-bold">{r.estimatedROI}%</td>
                  <td className="py-2.5 text-right text-white">{formatCurrency(r.estimatedCost)}</td>
                  <td className="py-2.5 text-right text-amber-400">{r.paybackPeriodMonths}mo</td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.estimatedROI >= 25 ? 'bg-green-500/20 text-green-400'
                      : r.estimatedROI >= 15 ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-ev-dark-border text-ev-gray'
                    }`}>
                      {r.estimatedROI >= 25 ? 'High Potential' : r.estimatedROI >= 15 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

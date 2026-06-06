import { useFetch } from '../hooks/useFetch';
import { getAnalytics } from '../utils/api';
import { LoadingSpinner, ErrorState } from '../components/dashboard/States';
import { formatCurrency } from '../utils/helpers';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { TrendingUp, Activity, DollarSign, Layers } from 'lucide-react';

const PRIORITY_COLORS = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };
const CITY_COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f97316', '#eab308', '#06b6d4', '#ec4899', '#84cc16', '#f43f5e', '#8b5cf6'];

const tooltipStyle = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, itemStyle: { color: '#94a3b8' } };

export default function Analytics() {
  const { data, loading, error, refetch } = useFetch(getAnalytics);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { summary, cityBreakdown = [], forecastData = [], priorityDistribution = [], investmentRanking = [] } = data?.data || {};

  // Growth trend: derive from forecast
  const growthTrend = forecastData.map((f, i) => ({
    ...f,
    evGrowth: Math.round(8 + i * 1.5 + (i % 3) * 0.8),
    stationGap: Math.max(0, 40 - i * 3),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Locations', value: summary?.totalLocations, icon: Layers, color: 'text-ev-blue' },
          { label: 'Avg Demand Score', value: summary?.avgDemandScore, icon: Activity, color: 'text-green-400', suffix: '/100' },
          { label: 'Avg Utilization', value: `${summary?.avgUtilization}%`, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Total Est. Investment', value: formatCurrency(summary?.totalEstimatedInvestment || 0), icon: DollarSign, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color, suffix }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-current/10 ${color}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-ev-gray text-xs uppercase tracking-wide">{label}</p>
              <p className="text-white font-bold text-lg">{value}{suffix}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 12-Month Utilization Forecast */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">12-Month Utilization & Demand Growth Forecast</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={forecastData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Area type="monotone" dataKey="utilization" name="Utilization %" stroke="#0ea5e9" fill="url(#utilGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="demandGrowth" name="Demand Growth" stroke="#a855f7" fill="url(#demandGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row: City Breakdown + Priority Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">City-by-City Demand Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cityBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Bar dataKey="avgDemand" name="Avg Demand" radius={[4, 4, 0, 0]}>
                {cityBreakdown.map((_, i) => (
                  <Cell key={i} fill={CITY_COLORS[i % CITY_COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="stationCount" name="Stations" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={priorityDistribution} dataKey="count" nameKey="priority" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                {priorityDistribution.map((entry) => (
                  <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* EV Growth Trend */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">Projected EV Adoption Growth & Infrastructure Gap</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growthTrend} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="evGrowth" name="EV Growth %" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="stationGap" name="Infrastructure Gap" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="newStations" name="New Stations" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Investment Table */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">Top Investment Opportunities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ev-gray text-xs uppercase tracking-wide border-b border-ev-dark-border">
                <th className="text-left py-2 pr-4">Location</th>
                <th className="text-left py-2 pr-4">City</th>
                <th className="text-right py-2 pr-4">Demand</th>
                <th className="text-right py-2 pr-4">ROI %</th>
                <th className="text-right py-2 pr-4">Investment</th>
                <th className="text-right py-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {investmentRanking.slice(0, 8).map((r, i) => (
                <tr key={i} className="border-b border-ev-dark-border/50 hover:bg-ev-dark-border/20 transition-colors">
                  <td className="py-2.5 pr-4 text-white font-medium">{r.name}</td>
                  <td className="py-2.5 pr-4 text-ev-gray">{r.city}</td>
                  <td className="py-2.5 pr-4 text-right font-mono" style={{ color: r.demandScore >= 70 ? '#ef4444' : '#22c55e' }}>{r.demandScore}</td>
                  <td className="py-2.5 pr-4 text-right text-green-400 font-mono">{r.estimatedROI}%</td>
                  <td className="py-2.5 pr-4 text-right text-white">{formatCurrency(r.estimatedCost)}</td>
                  <td className="py-2.5 text-right">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ color: PRIORITY_COLORS[r.priority], background: PRIORITY_COLORS[r.priority] + '18', border: `1px solid ${PRIORITY_COLORS[r.priority]}44` }}>
                      {r.priority}
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

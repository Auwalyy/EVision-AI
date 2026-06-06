import { useFetch } from '../../hooks/useFetch';
import { getAnalytics, getRecommendations } from '../../utils/api';
import { LoadingSpinner, ErrorState } from '../../components/dashboard/States';
import { Building2, Map, BarChart2, Layers, TrendingUp } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import { scoreColor } from '../../utils/helpers';

const tt = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, itemStyle: { color: '#94a3b8' } };
const CITY_COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f97316', '#eab308', '#06b6d4', '#ec4899', '#84cc16', '#f43f5e', '#8b5cf6'];

export default function PlannerDashboard() {
  const { data, loading, error, refetch } = useFetch(getAnalytics);
  const { data: recData } = useFetch(() => getRecommendations({ limit: 100 }));

  if (loading) return <LoadingSpinner text="Loading urban planning data..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { summary, cityBreakdown = [], forecastData = [] } = data?.data || {};
  const recs = recData?.data || [];

  // EV Readiness Index per city (composite of avgDemand + stationCount coverage)
  const readinessData = cityBreakdown.map(c => ({
    city: c.city,
    readiness: Math.min(100, Math.round(c.avgDemand * 0.6 + c.stationCount * 4)),
    demand: c.avgDemand,
    stations: c.stationCount,
    gap: Math.max(0, 100 - Math.round(c.avgDemand * 0.6 + c.stationCount * 4)),
  }));

  // Radar per city
  const radarData = cityBreakdown.map(c => ({
    city: c.city,
    demand: c.avgDemand,
    coverage: Math.min(100, c.stationCount * 6),
    investment: Math.min(100, c.totalInvestment / 80000),
  }));

  // Growth simulation
  const growthSimulation = forecastData.map((f, i) => ({
    ...f,
    evAdoption: Math.round(5 + i * 2.2),
    infrastructureReady: Math.round(20 + i * 3.5),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-amber-500/10 to-ev-dark-card border-amber-500/20">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-amber-400" />
          <div>
            <h2 className="text-white font-bold text-lg">Urban EV Planning Dashboard</h2>
            <p className="text-ev-gray text-sm">Smart city EV readiness intelligence · Nigeria</p>
          </div>
        </div>
      </div>

      {/* Planner KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cities Analyzed', value: cityBreakdown.length, icon: Map, color: 'text-amber-400', sub: 'Across Nigeria' },
          { label: 'Avg EV Readiness', value: readinessData.length ? `${Math.round(readinessData.reduce((s, c) => s + c.readiness, 0) / readinessData.length)}%` : '—', icon: BarChart2, color: 'text-blue-400', sub: 'Composite score' },
          { label: 'Infrastructure Gaps', value: recs.filter(r => r.routeGapScore >= 50).length, icon: Layers, color: 'text-red-400', sub: 'Coverage deficits' },
          { label: 'Locations Planned', value: summary?.totalLocations ?? 0, icon: TrendingUp, color: 'text-green-400', sub: 'Total assessed' },
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

      {/* City Readiness + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-white font-semibold mb-4">EV Readiness Index by City</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={readinessData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip {...tt} formatter={v => [`${v}%`, 'Readiness']} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="readiness" name="EV Readiness %" radius={[4, 4, 0, 0]}>
                {readinessData.map((c, i) => <Cell key={i} fill={CITY_COLORS[i % CITY_COLORS.length]} />)}
              </Bar>
              <Bar dataKey="gap" name="Infrastructure Gap" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">City Multi-Dimension Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="city" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar dataKey="demand" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="Demand" />
              <Radar dataKey="coverage" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} name="Coverage" />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Urban Growth Simulation */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">Urban EV Adoption vs Infrastructure Readiness Simulation</h3>
        <p className="text-ev-gray text-sm mb-4">Simulated 12-month trajectory showing EV adoption growth vs current infrastructure preparation rate.</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growthSimulation} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...tt} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="evAdoption" name="EV Adoption %" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="infrastructureReady" name="Infrastructure Ready %" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="utilization" name="Station Utilization %" stroke="#0ea5e9" strokeWidth={2} dot={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* City Readiness Table */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">City Planning Intelligence Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ev-gray text-xs uppercase border-b border-ev-dark-border">
                <th className="text-left pb-2">City</th>
                <th className="text-right pb-2">EV Readiness</th>
                <th className="text-right pb-2">Demand Score</th>
                <th className="text-right pb-2">Stations</th>
                <th className="text-right pb-2">Infrastructure Gap</th>
                <th className="text-right pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {readinessData.map((c, i) => (
                <tr key={i} className="border-b border-ev-dark-border/40 hover:bg-ev-dark-border/20">
                  <td className="py-2.5 text-white font-medium">{c.city}</td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: scoreColor(c.readiness) }}>{c.readiness}%</td>
                  <td className="py-2.5 text-right font-mono" style={{ color: scoreColor(c.demand) }}>{c.demand}</td>
                  <td className="py-2.5 text-right text-white">{c.stations}</td>
                  <td className="py-2.5 text-right text-red-400">{c.gap}%</td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.readiness >= 60 ? 'bg-green-500/20 text-green-400'
                      : c.readiness >= 40 ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                    }`}>
                      {c.readiness >= 60 ? 'EV Ready' : c.readiness >= 40 ? 'Developing' : 'Needs Action'}
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

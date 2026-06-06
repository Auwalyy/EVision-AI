import { useFetch } from '../../hooks/useFetch';
import { getAnalytics, getLocations, getRecommendations } from '../../utils/api';
import { LoadingSpinner, ErrorState } from '../../components/dashboard/States';
import { Radio, Activity, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, Legend,
} from 'recharts';
import { scoreColor } from '../../utils/helpers';

const tt = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, itemStyle: { color: '#94a3b8' } };

export default function OperatorDashboard() {
  const { data, loading, error, refetch } = useFetch(getAnalytics);
  const { data: locData } = useFetch(getLocations);
  const { data: recData } = useFetch(() => getRecommendations({ limit: 100 }));

  if (loading) return <LoadingSpinner text="Loading station performance..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { summary, forecastData = [], cityBreakdown = [] } = data?.data || {};
  const locations = locData?.data || [];
  const recs = recData?.data || [];

  const existingStations = locations.filter(l => l.hasExistingStation);
  const expansionSuggestions = recs.filter(r => r.priority === 'Critical' || r.priority === 'High').slice(0, 5);

  // Utilization by station type
  const stationTypes = existingStations.reduce((acc, l) => {
    acc[l.stationType] = (acc[l.stationType] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(stationTypes).map(([type, count]) => ({ type, count }));

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-purple-500/10 to-ev-dark-card border-purple-500/20">
        <div className="flex items-center gap-3">
          <Radio size={28} className="text-purple-400" />
          <div>
            <h2 className="text-white font-bold text-lg">Station Operations Dashboard</h2>
            <p className="text-ev-gray text-sm">Monitor performance, utilization, and expansion opportunities</p>
          </div>
        </div>
      </div>

      {/* Operator KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Stations', value: existingStations.length, icon: Radio, color: 'text-purple-400', sub: 'Currently deployed' },
          { label: 'Avg Utilization', value: `${summary?.avgUtilization ?? 0}%`, icon: Activity, color: 'text-green-400', sub: 'Platform average' },
          { label: 'Expansion Sites', value: expansionSuggestions.length, icon: TrendingUp, color: 'text-blue-400', sub: 'High priority' },
          { label: 'Coverage Gaps', value: recs.filter(r => r.routeGapScore >= 60).length, icon: AlertTriangle, color: 'text-amber-400', sub: 'Route gaps detected' },
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

      {/* Utilization Forecast + Station Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-white font-semibold mb-4">12-Month Utilization Forecast</h3>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="opGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tt} />
              <Area type="monotone" dataKey="utilization" name="Utilization %" stroke="#a855f7" fill="url(#opGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">Station Types Deployed</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={typeData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tt} />
              <Bar dataKey="count" name="Stations" radius={[4, 4, 0, 0]}>
                {typeData.map((_, i) => (
                  <Cell key={i} fill={['#a855f7', '#0ea5e9', '#22c55e', '#f97316'][i % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expansion Suggestions */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap size={16} className="text-purple-400" /> Top Expansion Opportunities
        </h3>
        <div className="space-y-3">
          {expansionSuggestions.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-ev-dark border border-ev-dark-border">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-purple-400 font-bold text-sm">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{r.locationId?.name}</p>
                <p className="text-ev-gray text-xs">{r.locationId?.city} · {r.chargersNeeded} chargers needed</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono font-bold text-sm" style={{ color: scoreColor(r.demandScore) }}>{r.demandScore}</p>
                <p className="text-ev-gray text-xs">Demand</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-green-400 font-mono font-bold text-sm">{r.estimatedUtilization}%</p>
                <p className="text-ev-gray text-xs">Utilization</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                r.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
              }`}>{r.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

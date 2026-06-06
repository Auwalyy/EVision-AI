import { useFetch } from '../../hooks/useFetch';
import { getAnalytics, getRecommendations } from '../../utils/api';
import { LoadingSpinner, ErrorState } from '../../components/dashboard/States';
import { formatCurrency } from '../../utils/helpers';
import { MapPin, Zap, Flame, Globe, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area, Legend,
} from 'recharts';

const CITY_COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f97316', '#eab308', '#06b6d4', '#ec4899', '#84cc16', '#f43f5e', '#8b5cf6'];
const tt = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, itemStyle: { color: '#94a3b8' } };

export default function GovernmentDashboard() {
  const { data, loading, error, refetch } = useFetch(getAnalytics);
  const { data: recData } = useFetch(() => getRecommendations({ limit: 100 }));

  if (loading) return <LoadingSpinner text="Loading national EV overview..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { summary, cityBreakdown = [], forecastData = [], priorityDistribution = [] } = data?.data || {};
  const recs = recData?.data || [];
  const criticalZones = recs.filter(r => r.priority === 'Critical' || r.priority === 'High');
  const infrastructureGap = recs.filter(r => !r.locationId?.hasExistingStation).length;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-blue-500/10 to-ev-dark-card border-blue-500/20">
        <div className="flex items-center gap-3">
          <Globe size={28} className="text-blue-400" />
          <div>
            <h2 className="text-white font-bold text-lg">National EV Infrastructure Dashboard</h2>
            <p className="text-ev-gray text-sm">Ministry of Transport · Nigeria EV Planning Intelligence</p>
          </div>
        </div>
      </div>

      {/* Policy KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Locations Analyzed', value: summary?.totalLocations ?? 0, icon: MapPin, color: 'text-blue-400', sub: 'Across 10 cities' },
          { label: 'Infrastructure Gaps', value: infrastructureGap, icon: AlertTriangle, color: 'text-red-400', sub: 'Unserved locations' },
          { label: 'Critical Zones', value: criticalZones.length, icon: Flame, color: 'text-orange-400', sub: 'Need immediate action' },
          { label: 'Projected Investment', value: formatCurrency(summary?.totalEstimatedInvestment ?? 0), icon: TrendingUp, color: 'text-green-400', sub: 'National requirement' },
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

      {/* City Demand Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-white font-semibold mb-4">EV Demand by City — Infrastructure Priority</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cityBreakdown} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tt} />
              <Bar dataKey="avgDemand" name="Avg Demand Score" radius={[4, 4, 0, 0]}>
                {cityBreakdown.map((_, i) => <Cell key={i} fill={CITY_COLORS[i % CITY_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">12-Month National EV Demand Forecast</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="govGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tt} />
              <Area type="monotone" dataKey="demandGrowth" name="Demand Growth" stroke="#3b82f6" fill="url(#govGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Zones Table */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap size={16} className="text-red-400" /> Critical Infrastructure Zones — Policy Action Required
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ev-gray text-xs uppercase border-b border-ev-dark-border">
                <th className="text-left pb-2">Location</th>
                <th className="text-left pb-2">City</th>
                <th className="text-right pb-2">Demand Score</th>
                <th className="text-right pb-2">Chargers Needed</th>
                <th className="text-right pb-2">Est. Cost</th>
                <th className="text-right pb-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {criticalZones.slice(0, 8).map((r, i) => (
                <tr key={i} className="border-b border-ev-dark-border/40 hover:bg-ev-dark-border/20">
                  <td className="py-2.5 text-white font-medium">{r.locationId?.name}</td>
                  <td className="py-2.5 text-ev-gray">{r.locationId?.city}</td>
                  <td className="py-2.5 text-right text-red-400 font-mono font-bold">{r.demandScore}</td>
                  <td className="py-2.5 text-right text-white">{r.chargersNeeded} units</td>
                  <td className="py-2.5 text-right text-ev-gray">{formatCurrency(r.estimatedCost)}</td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
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

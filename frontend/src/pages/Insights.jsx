import { useFetch } from '../hooks/useFetch';
import { getAnalytics, getRecommendations } from '../utils/api';
import { LoadingSpinner, ErrorState } from '../components/dashboard/States';
import InsightCard from '../components/insights/InsightCard';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { formatCurrency, scoreColor } from '../utils/helpers';
import { Route, DollarSign, Clock, Shield } from 'lucide-react';

export default function Insights() {
  const { data: analyticsData, loading: aLoading, error: aError } = useFetch(getAnalytics);
  const { data: recData, loading: rLoading } = useFetch(() => getRecommendations({ limit: 100 }));

  if (aLoading || rLoading) return <LoadingSpinner text="Generating AI insights..." />;
  if (aError) return <ErrorState message={aError} />;

  const { topInsights = [], investmentRanking = [], cityBreakdown = [] } = analyticsData?.data || {};
  const recommendations = recData?.data || [];

  // Route gap analysis — locations with high route gap score
  const routeGaps = recommendations
    .filter((r) => r.locationId && r.routeGapScore >= 50)
    .sort((a, b) => b.routeGapScore - a.routeGapScore)
    .slice(0, 8)
    .map((r) => ({ name: r.locationId.name, city: r.locationId.city, routeGapScore: r.routeGapScore }));

  // Radar data for top city comparison
  const radarData = cityBreakdown.map((c) => ({
    city: c.city,
    demand: c.avgDemand,
    stations: Math.min(100, c.stationCount * 5),
    investment: Math.min(100, c.totalInvestment / 100000),
  }));

  // ROI Champions
  const roiChampions = investmentRanking
    .filter((r) => r.estimatedROI)
    .sort((a, b) => b.estimatedROI - a.estimatedROI)
    .slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      {/* AI Insight Cards */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4">AI-Generated Location Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {topInsights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      </div>

      {/* Route Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Route size={18} className="text-ev-blue" />
            <h3 className="text-white font-semibold">Route Coverage Gaps</h3>
          </div>
          <p className="text-ev-gray text-sm mb-4">Locations with insufficient EV charging coverage along travel routes — immediate infrastructure targets.</p>
          <div className="space-y-2">
            {routeGaps.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-ev-gray text-xs w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white">{r.name} <span className="text-ev-gray">({r.city})</span></span>
                    <span className="font-mono" style={{ color: scoreColor(r.routeGapScore) }}>{r.routeGapScore}</span>
                  </div>
                  <div className="w-full bg-ev-dark-border rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${r.routeGapScore}%`, background: scoreColor(r.routeGapScore) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-green-400" />
            <h3 className="text-white font-semibold">ROI Champions</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roiChampions} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={70} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v) => [`${v}%`, 'Annual ROI']}
                itemStyle={{ color: '#22c55e' }}
              />
              <Bar dataKey="estimatedROI" radius={[0, 4, 4, 0]}>
                {roiChampions.map((_, i) => (
                  <Cell key={i} fill="#22c55e" fillOpacity={0.8 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* City Radar + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-white font-semibold mb-4">City Performance Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="city" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar dataKey="demand" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} name="Demand" />
              <Radar dataKey="investment" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} name="Investment" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            {
              icon: DollarSign, color: 'text-green-400', label: 'Total Est. ROI',
              value: investmentRanking.length
                ? `${Math.round(investmentRanking.reduce((s, r) => s + (r.estimatedROI || 0), 0) / investmentRanking.length)}%`
                : '—',
              sub: 'Average annual ROI',
            },
            {
              icon: Clock, color: 'text-amber-400', label: 'Fastest Payback',
              value: investmentRanking.length
                ? `${Math.min(...investmentRanking.map((r) => r.paybackPeriodMonths || 99))}mo`
                : '—',
              sub: 'Best payback period',
            },
            {
              icon: Route, color: 'text-ev-blue', label: 'Route Gap Locations',
              value: routeGaps.length,
              sub: 'Underserved corridors',
            },
            {
              icon: Shield, color: 'text-purple-400', label: 'Low Risk Zones',
              value: recommendations.filter((r) => r.riskLevel === 'Low').length,
              sub: 'Safe investment zones',
            },
          ].map(({ icon: Icon, color, label, value, sub }) => (
            <div key={label} className="card flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-current/10 ${color}`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-ev-gray text-xs uppercase tracking-wide">{label}</p>
                <p className="text-white text-xl font-bold">{value}</p>
                <p className="text-ev-gray text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

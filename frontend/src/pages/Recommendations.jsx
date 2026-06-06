import { useState, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getLocations, getRecommendations } from '../utils/api';
import { LoadingSpinner, ErrorState } from '../components/dashboard/States';
import { priorityColor, priorityClass, formatCurrency, scoreColor } from '../utils/helpers';
import { MapPin, Zap, TrendingUp, DollarSign, Clock, BarChart2 } from 'lucide-react';

const CITIES = ['All Cities', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Kaduna', 'Enugu', 'Jos', 'Maiduguri', 'Abeokuta'];

function ForecastBar({ label, value, max = 100 }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-ev-gray w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-ev-dark-border rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, background: scoreColor(value) }} />
      </div>
      <span className="font-mono text-white w-8 text-right">{value}</span>
    </div>
  );
}

export default function Recommendations() {
  const [city, setCity] = useState('All Cities');
  const [priority, setPriority] = useState('All');

  const { data: locData, loading: locLoading, error } = useFetch(getLocations);
  const { data: recData, loading: recLoading } = useFetch(() => getRecommendations({ limit: 100 }));

  const recMap = useMemo(() => {
    const map = {};
    (recData?.data || []).forEach((r) => {
      if (r.locationId) map[r.locationId._id || r.locationId] = r;
    });
    return map;
  }, [recData]);

  const filtered = useMemo(() => {
    return (recData?.data || [])
      .filter((r) => {
        if (!r.locationId) return false;
        if (city !== 'All Cities' && r.locationId.city !== city) return false;
        if (priority !== 'All' && r.priority !== priority) return false;
        return true;
      })
      .sort((a, b) => b.demandScore - a.demandScore);
  }, [recData, city, priority]);

  if (locLoading || recLoading) return <LoadingSpinner text="Loading recommendations..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-ev-gray text-sm">City:</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-ev-dark-card border border-ev-dark-border rounded-lg px-3 py-1.5 text-white text-sm focus:border-ev-blue outline-none"
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-ev-gray text-sm">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-ev-dark-card border border-ev-dark-border rounded-lg px-3 py-1.5 text-white text-sm focus:border-ev-blue outline-none"
          >
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <span className="text-ev-gray text-sm ml-auto">{filtered.length} locations found</span>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Recommendations', value: filtered.length, icon: MapPin, color: 'text-ev-blue' },
          { label: 'Critical + High', value: filtered.filter((r) => ['Critical', 'High'].includes(r.priority)).length, icon: Zap, color: 'text-red-400' },
          { label: 'Avg Demand Score', value: filtered.length ? Math.round(filtered.reduce((s, r) => s + r.demandScore, 0) / filtered.length) : 0, icon: BarChart2, color: 'text-green-400' },
          { label: 'Est. Total Investment', value: formatCurrency(filtered.reduce((s, r) => s + (r.estimatedCost || 0), 0)), icon: DollarSign, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-current/10 ${color}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-ev-gray text-xs uppercase tracking-wide">{label}</p>
              <p className="text-white font-bold text-lg">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((rec) => {
          const loc = rec.locationId;
          const color = priorityColor(rec.priority);
          // Per-location 6-month & 12-month forecast
          const forecast6m = Math.min(100, Math.round(rec.demandScore * 1.08));
          const forecast12m = Math.min(100, Math.round(rec.demandScore * 1.18));

          return (
            <div key={rec._id} className="card border border-ev-dark-border hover:border-ev-blue/30 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{loc.name}</h3>
                  <p className="text-ev-gray text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {loc.city}, {loc.state}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold border shrink-0"
                  style={{ color, borderColor: color + '44', background: color + '18' }}
                >
                  {rec.priority}
                </span>
              </div>

              {/* Scores */}
              <div className="space-y-2 mb-3">
                <ForecastBar label="Demand Score" value={rec.demandScore} />
                <ForecastBar label="Investment Score" value={rec.investmentScore} />
                <ForecastBar label="6-Month Forecast" value={forecast6m} />
                <ForecastBar label="1-Year Forecast" value={forecast12m} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-ev-dark-border pt-3">
                <div>
                  <p className="text-ev-gray">Chargers Needed</p>
                  <p className="text-white font-medium">{rec.chargersNeeded} units</p>
                </div>
                <div>
                  <p className="text-ev-gray">Est. Utilization</p>
                  <p className="text-white font-medium">{rec.estimatedUtilization}%</p>
                </div>
                <div>
                  <p className="text-ev-gray">Annual ROI</p>
                  <p className="text-green-400 font-medium">{rec.estimatedROI}%</p>
                </div>
                <div>
                  <p className="text-ev-gray">Payback Period</p>
                  <p className="text-amber-400 font-medium flex items-center gap-1">
                    <Clock size={11} />{rec.paybackPeriodMonths}mo
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-ev-gray">Est. Investment</p>
                  <p className="text-white font-medium">{formatCurrency(rec.estimatedCost)}</p>
                </div>
              </div>

              {/* AI Insight */}
              {rec.aiInsight && (
                <p className="text-ev-gray/80 text-xs italic border-t border-ev-dark-border pt-3 mt-3 leading-relaxed line-clamp-3">
                  {rec.aiInsight}
                </p>
              )}

              {/* Risk badge */}
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  rec.riskLevel === 'Low' ? 'text-green-400 border-green-500/30 bg-green-500/10'
                  : rec.riskLevel === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  : 'text-red-400 border-red-500/30 bg-red-500/10'
                }`}>
                  {rec.riskLevel} Risk
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  rec.roiCategory === 'High Potential' ? 'text-green-400 border-green-500/30 bg-green-500/10'
                  : rec.roiCategory === 'Medium Potential' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  : 'text-ev-gray border-ev-dark-border bg-ev-dark'
                }`}>
                  {rec.roiCategory || 'Low Potential'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12">
          <MapPin size={32} className="text-ev-gray/30 mx-auto mb-3" />
          <p className="text-ev-gray">No recommendations match the selected filters.</p>
        </div>
      )}
    </div>
  );
}

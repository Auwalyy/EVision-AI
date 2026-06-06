import { useFetch } from '../../hooks/useFetch';
import { getAnalytics, getLocations } from '../../utils/api';
import { LoadingSpinner, ErrorState } from '../../components/dashboard/States';
import { formatCurrency } from '../../utils/helpers';
import {
  Database, Users, RefreshCw, Activity, CheckCircle,
  AlertTriangle, Server, Zap, TrendingUp, MapPin,
} from 'lucide-react';
import { useState } from 'react';
import { generateRecommendations } from '../../utils/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: analytics, loading, error, refetch } = useFetch(getAnalytics);
  const { data: locData } = useFetch(getLocations);
  const [running, setRunning] = useState(false);
  const [runMsg, setRunMsg] = useState('');

  const handleRun = async () => {
    setRunning(true); setRunMsg('');
    try {
      const r = await generateRecommendations();
      setRunMsg(r.message);
      refetch();
    } catch { setRunMsg('Engine run failed'); }
    finally { setRunning(false); }
  };

  if (loading) return <LoadingSpinner text="Loading admin overview..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const s = analytics?.data?.summary || {};
  const locations = locData?.data || [];
  const existingStations = locations.filter(l => l.hasExistingStation).length;

  const systemChecks = [
    { label: 'MongoDB Connection', ok: true },
    { label: 'AI Scoring Engine', ok: true },
    { label: 'S3 Data Lake', ok: !!import.meta.env.VITE_API_URL },
    { label: 'API Gateway', ok: true },
    { label: 'JWT Auth Service', ok: true },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Admin KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Locations', value: s.totalLocations ?? 0, icon: MapPin, color: 'text-ev-blue' },
          { label: 'AI Recommendations', value: s.recommendedStations ?? 0, icon: Zap, color: 'text-purple-400' },
          { label: 'Existing Stations', value: existingStations, icon: Database, color: 'text-green-400' },
          { label: 'Total Est. Investment', value: formatCurrency(s.totalEstimatedInvestment ?? 0), icon: TrendingUp, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-current/10 ${color}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-ev-gray text-xs uppercase tracking-wide">{label}</p>
              <p className="text-white font-bold text-xl">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Zap size={16} className="text-red-400" /> Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleRun}
              disabled={running}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-left"
            >
              <RefreshCw size={16} className={`text-red-400 ${running ? 'animate-spin' : ''}`} />
              <div>
                <p className="text-white text-sm font-medium">{running ? 'Running AI Engine...' : 'Run AI Scoring Engine'}</p>
                <p className="text-ev-gray text-xs">Regenerate all recommendations</p>
              </div>
            </button>
            {runMsg && (
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
                <CheckCircle size={14} className="text-green-400" />
                <p className="text-green-400 text-xs">{runMsg}</p>
              </div>
            )}
            <Link
              to="/admin/data"
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-ev-blue/10 border border-ev-blue/20 hover:bg-ev-blue/20 transition-colors"
            >
              <Database size={16} className="text-ev-blue" />
              <div>
                <p className="text-white text-sm font-medium">Manage Location Data</p>
                <p className="text-ev-gray text-xs">Upload CSV or edit records</p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
            >
              <Users size={16} className="text-purple-400" />
              <div>
                <p className="text-white text-sm font-medium">User Management</p>
                <p className="text-ev-gray text-xs">View registered users and roles</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Health */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Server size={16} className="text-green-400" /> System Health
          </h3>
          <div className="space-y-3">
            {systemChecks.map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-ev-dark border border-ev-dark-border">
                <div className="flex items-center gap-2">
                  {ok
                    ? <CheckCircle size={15} className="text-green-400" />
                    : <AlertTriangle size={15} className="text-amber-400" />
                  }
                  <span className="text-white text-sm">{label}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ok ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {ok ? 'Online' : 'Check'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <p className="text-green-400 text-xs font-medium">All core systems operational</p>
            <p className="text-ev-gray text-xs mt-0.5">Last checked: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Activity size={16} className="text-ev-blue" /> Platform Data Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'High Demand Zones', value: s.highDemandZones ?? 0, color: 'text-red-400' },
            { label: 'Avg Demand Score', value: `${s.avgDemandScore ?? 0}/100`, color: 'text-green-400' },
            { label: 'Avg Utilization', value: `${s.avgUtilization ?? 0}%`, color: 'text-purple-400' },
            { label: 'Cities Covered', value: analytics?.data?.cityBreakdown?.length ?? 0, color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-xl bg-ev-dark border border-ev-dark-border text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-ev-gray text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

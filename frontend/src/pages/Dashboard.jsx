import { MapPin, Zap, Flame, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DemandChart from '../components/dashboard/DemandChart';
import UtilizationChart from '../components/dashboard/UtilizationChart';
import InvestmentRankingTable from '../components/dashboard/InvestmentRankingTable';
import PriorityPieChart from '../components/dashboard/PriorityPieChart';
import { LoadingSpinner, ErrorState } from '../components/dashboard/States';
import { useFetch } from '../hooks/useFetch';
import { getAnalytics } from '../utils/api';
import { formatCurrency } from '../utils/helpers';

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch(getAnalytics);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { summary, cityBreakdown, investmentRanking, forecastData, priorityDistribution } =
    data?.data || {};

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Locations Analyzed" value={summary?.totalLocations ?? 0} icon={MapPin} color="text-ev-blue" trend={12} />
        <StatCard title="Recommended Stations" value={summary?.recommendedStations ?? 0} icon={Zap} color="text-purple-400" trend={8} />
        <StatCard title="High Demand Zones" value={summary?.highDemandZones ?? 0} icon={Flame} color="text-red-400" trend={15} />
        <StatCard title="Avg Demand Score" value={summary?.avgDemandScore ?? 0} subtitle="out of 100" icon={Activity} color="text-green-400" />
        <StatCard
          title="Total Investment"
          value={formatCurrency(summary?.totalEstimatedInvestment ?? 0)}
          subtitle="estimated"
          icon={TrendingUp}
          color="text-amber-400"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DemandChart data={cityBreakdown} />
        <UtilizationChart data={forecastData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <InvestmentRankingTable data={investmentRanking} />
        </div>
        <PriorityPieChart data={priorityDistribution} />
      </div>
    </div>
  );
}

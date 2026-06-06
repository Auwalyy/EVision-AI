import { useState } from 'react';
import EVMap from '../components/map/EVMap';
import { LoadingSpinner, ErrorState } from '../components/dashboard/States';
import { useFetch } from '../hooks/useFetch';
import { getLocations, getRecommendations } from '../utils/api';
import { MapPin, Zap, Flame } from 'lucide-react';

export default function MapPage() {
  const [cityFilter, setCityFilter] = useState('');
  const { data: locData, loading: locLoading, error: locErr } = useFetch(getLocations);
  const { data: recData, loading: recLoading } = useFetch(getRecommendations);

  if (locLoading || recLoading) return <LoadingSpinner text="Loading map data..." />;
  if (locErr) return <ErrorState message={locErr} />;

  const locations = locData?.data || [];
  const recommendations = recData?.data || [];

  const filtered = cityFilter
    ? locations.filter((l) => l.city.toLowerCase().includes(cityFilter.toLowerCase()))
    : locations;

  const cities = [...new Set(locations.map((l) => l.city))];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="p-4 flex items-center gap-4 border-b border-ev-dark-border bg-ev-dark-card flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-ev-gray text-sm">Filter by city:</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-ev-dark border border-ev-dark-border rounded-lg px-3 py-1.5 text-white text-sm focus:border-ev-blue outline-none"
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4 ml-auto text-xs text-ev-gray">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> {locations.filter((l) => l.hasExistingStation).length} Existing</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> {recommendations.filter((r) => r.demandScore < 70).length} Recommended</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> {recommendations.filter((r) => r.demandScore >= 70).length} High Demand</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <EVMap locations={filtered} recommendations={recommendations} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import CSVUpload from '../components/admin/CSVUpload';
import LocationManager from '../components/admin/LocationManager';
import { LoadingSpinner, ErrorState } from '../components/dashboard/States';
import { useFetch } from '../hooks/useFetch';
import { getLocations, generateRecommendations } from '../utils/api';
import { RefreshCw, Database, Cloud, CheckCircle } from 'lucide-react';

export default function Admin() {
  const { data, loading, error, refetch } = useFetch(getLocations);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await generateRecommendations();
      setGenMsg(res.message);
    } catch (err) {
      setGenMsg(err?.error || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin panel..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const locations = data?.data || [];

  return (
    <div className="p-6 space-y-6">
      {/* Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-ev-blue/10 flex items-center justify-center">
            <Database size={22} className="text-ev-blue" />
          </div>
          <div>
            <p className="text-ev-gray text-xs uppercase tracking-wide">Total Locations</p>
            <p className="text-white text-2xl font-bold">{locations.length}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Cloud size={22} className="text-green-400" />
          </div>
          <div>
            <p className="text-ev-gray text-xs uppercase tracking-wide">Existing Stations</p>
            <p className="text-white text-2xl font-bold">{locations.filter((l) => l.hasExistingStation).length}</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between gap-3">
          <div>
            <p className="text-ev-gray text-xs uppercase tracking-wide mb-1">Regenerate AI Recommendations</p>
            <p className="text-ev-gray text-xs">Re-run the scoring engine on all locations</p>
          </div>
          {genMsg && (
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-400" />
              <p className="text-green-400 text-xs">{genMsg}</p>
            </div>
          )}
          <button onClick={handleGenerate} disabled={generating} className="btn-primary text-sm py-1.5">
            <RefreshCw size={15} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Generating...' : 'Run AI Engine'}
          </button>
        </div>
      </div>

      {/* CSV Upload */}
      <CSVUpload onSuccess={refetch} />

      {/* Location Manager */}
      <LocationManager locations={locations} onRefresh={refetch} />

      {/* CSV Template */}
      <div className="card">
        <h3 className="text-white font-semibold mb-3">CSV Template</h3>
        <p className="text-ev-gray text-xs mb-3">Use this header format for your CSV file:</p>
        <pre className="bg-ev-dark rounded-lg p-3 text-ev-blue text-xs overflow-x-auto leading-relaxed">{`name,city,state,latitude,longitude,populationDensity,trafficVolume,commercialScore,evScore,hasExistingStation,stationType,routeCoverage
Victoria Island,Lagos,Lagos,6.4281,3.4219,88,95,97,72,true,dcfast,60
Wuse 2,Abuja,FCT,9.0670,7.4833,65,78,90,72,false,none,40`}</pre>
      </div>
    </div>
  );
}

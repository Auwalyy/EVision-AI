import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { priorityColor, formatCurrency } from '../../utils/helpers';
import { priorityClass } from '../../utils/helpers';

const NIGERIA_CENTER = [9.082, 8.6753];

function getMarkerConfig(loc, recommendation) {
  if (loc.hasExistingStation) return { color: '#22c55e', label: 'Existing Station', radius: 10 };
  if (recommendation) {
    if (recommendation.demandScore >= 70)
      return { color: '#ef4444', label: 'High Demand Zone', radius: 12 };
    return { color: '#0ea5e9', label: 'Recommended', radius: 9 };
  }
  return { color: '#64748b', label: 'Analyzed', radius: 7 };
}

export default function EVMap({ locations = [], recommendations = [] }) {
  const recMap = Object.fromEntries(
    recommendations
      .filter((r) => r.locationId)
      .map((r) => [r.locationId._id || r.locationId, r])
  );

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <MapContainer
        center={NIGERIA_CENTER}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {locations.map((loc) => {
          const rec = recMap[loc._id];
          const { color, label, radius } = getMarkerConfig(loc, rec);
          return (
            <CircleMarker
              key={loc._id}
              center={[loc.latitude, loc.longitude]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup maxWidth={280}>
                <div className="text-white text-sm space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-base">{loc.name}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: color + '22', color, border: `1px solid ${color}44` }}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{loc.city}, {loc.state}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className="text-slate-400">Population:</span>
                    <span className="text-white font-medium">{loc.populationDensity}/100</span>
                    <span className="text-slate-400">Traffic:</span>
                    <span className="text-white font-medium">{loc.trafficVolume}/100</span>
                    <span className="text-slate-400">Commercial:</span>
                    <span className="text-white font-medium">{loc.commercialScore}/100</span>
                    <span className="text-slate-400">EV Adoption:</span>
                    <span className="text-white font-medium">{loc.evScore}/100</span>
                  </div>
                  {rec && (
                    <>
                      <div className="border-t border-slate-600 pt-2 grid grid-cols-2 gap-1 text-xs">
                        <span className="text-slate-400">Demand Score:</span>
                        <span className="font-bold" style={{ color }}>{rec.demandScore}</span>
                        <span className="text-slate-400">Investment:</span>
                        <span className="text-sky-400 font-semibold">{rec.investmentScore}</span>
                        <span className="text-slate-400">ROI:</span>
                        <span className="text-green-400 font-semibold">{rec.estimatedROI}%</span>
                        <span className="text-slate-400">Chargers:</span>
                        <span className="text-white">{rec.chargersNeeded} units</span>
                        <span className="text-slate-400">Cost:</span>
                        <span className="text-white">{formatCurrency(rec.estimatedCost)}</span>
                        <span className="text-slate-400">Priority:</span>
                        <span className={priorityClass(rec.priority)}>{rec.priority}</span>
                      </div>
                      {rec.aiInsight && (
                        <p className="text-slate-300 text-xs italic border-t border-slate-600 pt-2 leading-relaxed">
                          {rec.aiInsight}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-ev-dark-card/90 border border-ev-dark-border rounded-xl p-3 backdrop-blur-sm">
        <p className="text-white text-xs font-semibold mb-2">Map Legend</p>
        {[
          { color: '#22c55e', label: 'Existing Station' },
          { color: '#0ea5e9', label: 'Recommended' },
          { color: '#ef4444', label: 'High Demand Zone' },
          { color: '#64748b', label: 'Analyzed Location' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-ev-gray text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { scoreColor } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ev-dark-card border border-ev-dark-border rounded-lg p-3 text-xs">
      <p className="text-white font-semibold">{label}</p>
      <p className="text-ev-blue mt-1">Avg Demand: <span className="font-bold">{payload[0].value}</span></p>
      <p className="text-ev-gray">Stations: {payload[0].payload.stationCount}</p>
    </div>
  );
};

export default function DemandChart({ data = [] }) {
  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Demand Score by City</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14,165,233,0.05)' }} />
          <Bar dataKey="avgDemand" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={scoreColor(entry.avgDemand)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

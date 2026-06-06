import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ev-dark-card border border-ev-dark-border rounded-lg p-3 text-xs">
      <p className="text-white font-semibold">{label}</p>
      <p className="text-ev-blue">Utilization: <span className="font-bold">{payload[0]?.value}%</span></p>
      <p className="text-purple-400">Demand Growth: <span className="font-bold">{payload[1]?.value}</span></p>
    </div>
  );
};

export default function UtilizationChart({ data = [] }) {
  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">12-Month Utilization Forecast</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="utilization" stroke="#0ea5e9" fill="url(#utilGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="demandGrowth" stroke="#a855f7" fill="url(#demandGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

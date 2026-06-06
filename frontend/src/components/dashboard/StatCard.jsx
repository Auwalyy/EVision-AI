export default function StatCard({ title, value, subtitle, icon: Icon, color = 'text-ev-blue', trend }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center bg-current/10 ${color}`}>
        <Icon size={22} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ev-gray text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {subtitle && <p className="text-ev-gray text-xs mt-0.5">{subtitle}</p>}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}
